import React, { useState, useEffect } from 'react';
import { Form as AntdForm, Drawer, Button, Space, Upload, Input, message, DatePicker, Row, Col, Modal, notification } from 'antd';
import ImgCrop from 'antd-img-crop'; // Ensure you have antd-img-crop installed
import { useQueryClient, useQuery } from '@tanstack/react-query';
import moment from 'moment';

import { apiPublicMedia, createMedia, uploadToMediaLibrary } from '../../../../services/media';
import { apiCreateEvent, apiEditEvent } from '../../../../services/eventServices/event';
import { useSelector } from 'react-redux';

const EditEvent = ({ oldData, open, onClose }) => {
    const [form] = AntdForm.useForm();
    const [fileList, setFileList] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [nameEvent, setNameEvent] = useState('');
    const [descriptionEvent, setDescriptionEvent] = useState('');
    const [locationEvent, setLocationEvent] = useState('');
    const { profile } = useSelector((state) => state.root.user || {});
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const queryClient = useQueryClient();
    //console.log('oldData', oldData);

    useEffect(() => {
        if (open && oldData) {
            form.setFieldsValue({
                name: oldData.name || '',
                description: oldData.description || '',
                location: oldData.location || '',
                startTime: oldData.start_time ? moment(oldData.start_time) : null,
                endTime: oldData.end_time ? moment(oldData.end_time) : null,
            });
        }
    }, [open, oldData, form]);



    const { data: publicMedia, isLoading, isError } = useQuery({
        queryKey: ['publicMedia'],
        queryFn: apiPublicMedia,
    });

    const mediaOptions = publicMedia?.data?.data || [];

    //console.log('publicMedia:', mediaOptions);

    const handleBannerUpload = ({ file, fileList }) => {
        setFileList(fileList);

        if (file.status === 'removed') {
            setUploadedImage(null);
            return;
        }

        if (file.originFileObj) {
            const reader = new FileReader();
            reader.onload = () => {
                setUploadedImage(reader.result); // Store the uploaded image URL
            };
            reader.readAsDataURL(file.originFileObj);
        }
    };

    const handleSubmit = async (values) => {
        const { startTime, endTime } = values;
        const changes = {};

        if (values.name !== oldData?.name) changes.name = values.name;
        if (values.description !== oldData?.description) changes.description = values.description;
        if (values.location !== oldData?.location) changes.location = values.location;

        if (startTime?.toISOString() !== oldData?.start_time) changes.start_time = startTime?.toISOString();
        if (endTime?.toISOString() !== oldData?.end_time) changes.end_time = endTime?.toISOString();

        // 👇 Bắt thay đổi ảnh (banner) theo loại
        if (uploadedImage) {
            changes.image = {
                type: 'uploaded',
                url: uploadedImage,
            };
        } else if (selectedMedia?.documentId !== oldData?.banner_id?.documentId) {
            if (selectedMedia) {
                changes.image = {
                    type: 'media',
                    documentId: selectedMedia.documentId,
                };
            }
        }

        // ✅ Nếu không có gì thay đổi
        if (Object.keys(changes).length === 0) {
            notification.info({
                message: 'No change',
                description: 'You have not changed any content compared to the old data.',
                placement: 'topRight',
            });
            return;
        }

        // ✅ Nếu không có ảnh ở bất kỳ loại nào
        const isImageMissing = !uploadedImage && !selectedMedia && !oldData?.banner_id?.file_path;
        if (isImageMissing) {
            notification.error({
                message: 'Image Missing',
                description: 'Please select or upload an image before submitting.',
                placement: 'topRight',
            });
            return;
        }

        // ✅ Chuẩn bị payload cuối cùng
        const imageData = changes.image
            ? changes.image
            : { type: 'existing', url: oldData?.banner_id?.file_path };

        const eventData = {
            ...values,
            startTime,
            endTime,
            image: imageData,
        };

        console.log('Changes:', changes);
        console.log('Event Data:', eventData);

        try {
            let bannerId = oldData?.banner_id?.documentId;

            console.log('imageData', imageData)
            // ✅ Trường hợp ảnh mới được upload:
            if (imageData.type === 'uploaded') {
                const binaryImage = await fetch(imageData.url)
                    .then(res => res.blob())
                    .then(blob => {
                        const fileType = blob.type;
                        const fileName = 'uploaded-image.jpg';
                        return new File([blob], fileName, { type: fileType });
                    });

                const uploadedFile = await uploadToMediaLibrary({ file: binaryImage });
                const payload = {
                    data: {
                        file_path: `http://localhost:1337${uploadedFile.data[0].url}`,
                        file_type: uploadedFile.data[0].mime,
                        file_size: uploadedFile.data[0].size.toString(),
                    },
                };
                const response = await createMedia(payload);
                bannerId = response.data.data.documentId;
            }

            // ✅ Trường hợp chọn media có sẵn:
            if (imageData.type === 'media') {
                bannerId = imageData.documentId;
            }

            // ✅ Payload cuối cùng để cập nhật sự kiện
            const payload = {
                data: {
                    ...(changes.name && { name: changes.name }),
                    ...(changes.description && { description: changes.description }),
                    ...(changes.location && { location: changes.location }),
                    ...(changes.start_time && { start_time: changes.start_time }),
                    ...(changes.end_time && { end_time: changes.end_time }),
                    ...(bannerId && { banner_id: bannerId }),
                }
            };
            console.log('Final Payload:', payload);

            // // ✅ Gọi API cập nhật thay vì tạo mới (ví dụ: `apiUpdateEvent`)
            await apiEditEvent({documentId: oldData.documentId, payload}); // <-- ⚠️ Giả sử bạn có hàm `apiUpdateEvent`

            notification.success({
                message: 'Success',
                description: 'Event updated successfully',
                placement: 'topRight',
            });

            // form.resetFields();
            // setStartTime(null);
            // setEndTime(null);
            // setUploadedImage(null);
            // setSelectedMedia(null);
            onClose();
        } catch (error) {
            console.error('Error submitting event:', error);
            notification.error({
                message: 'Submission Failed',
                description: 'An error occurred while submitting the event. Please try again.',
                placement: 'topRight',
            });
        }

        queryClient.invalidateQueries('eventDetails');
    };

    const handleStartTimeChange = (date) => {
        console.log('Selected Start Time:', date ? date.toISOString() : null); // Log start_time
        setStartTime(date); // Store moment object directly
    };

    const handleEndTimeChange = (date) => {
        console.log('Selected End Time:', date ? date.toISOString() : null); // Log end_time
        setEndTime(date); // Store moment object directly
    };

    const handleOk = () => {
        form.submit();
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSelectMedia = (media) => {
        setSelectedMedia(media); // Store the selected media from the library
        setUploadedImage(null); // Clear the uploaded image if a media is selected
        setIsModalOpen(false);
    };

    if (isLoading) {
        return <p>Loading public media...</p>;
    }

    if (isError) {
        return <p>Error loading public media.</p>;
    }

    return (
        <Drawer
            title="Create Event"
            placement="right"
            width={500}
            onClose={onClose}
            open={open}
            extra={
                <Space>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="primary" onClick={handleOk}>
                        OK
                    </Button>
                </Space>
            }
            style={{ marginTop: "74px" }}
        >
            <AntdForm
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <AntdForm.Item
                    name="name"
                    label="Event Name"
                    //initialValue={nameEvent}
                    rules={[{ required: true, message: 'Please enter the event name' }]}
                >
                    <Input placeholder="Enter event name" />
                </AntdForm.Item>
                <AntdForm.Item
                    name="description"
                    label="Description"
                    rules={[
                        { required: true, message: 'Please enter the event description' },
                        { max: 500, message: 'Description cannot exceed 500 characters' },
                    ]}
                >
                    <Input.TextArea rows={4} placeholder="Enter event description" />
                </AntdForm.Item>
                <AntdForm.Item
                    name="location"
                    label="Location"
                    rules={[
                        { required: true, message: 'Please enter the event location' },
                        { max: 200, message: 'Location cannot exceed 200 characters' },
                    ]}
                >
                    <Input placeholder="Enter event location" />
                </AntdForm.Item>
                <Row gutter={16}>
                    <Col span={12}>
                        <AntdForm.Item
                            name="startTime"
                            label="Start Time"
                            //initialValue={startTime} // Set initial value from oldData
                            rules={[{ required: true, message: 'Please select the start time' }]}
                        >
                            <DatePicker
                                onChange={(date) => form.setFieldsValue({ startTime: date })}
                                showTime
                                format="YYYY-MM-DD HH:mm"
                                className="mb-3"
                            />
                        </AntdForm.Item>
                    </Col>
                    <Col span={12}>
                        <AntdForm.Item
                            name="endTime"
                            label="End Time"
                            //initialValue={endTime} // Set initial value from oldData
                            rules={[{ required: true, message: 'Please select the end time' }]}
                        >
                            <DatePicker
                                onChange={(date) => form.setFieldsValue({ endTime: date })}
                                showTime
                                format="YYYY-MM-DD HH:mm"
                                className="mb-3"
                            />
                        </AntdForm.Item>
                    </Col>
                </Row>

                <p>Image banner</p>
                <hr />
                <div className="position-relative m-2">
                    <img
                        src={
                            uploadedImage // Show uploaded image if available
                                ? uploadedImage
                                : selectedMedia // Otherwise, show selected media
                                    ? selectedMedia.file_path
                                    : oldData?.banner_id?.file_path
                        }
                        alt="Event Banner"
                        className="img-fluid rounded"
                        style={{ maxHeight: "270px", objectFit: "fill", width: "100%" }}
                    />
                </div>
                <ImgCrop aspect={16 / 9} rotationSlider >
                    <Upload
                        fileList={fileList}
                        onChange={handleBannerUpload}
                        showUploadList={false}
                    >
                        <Button className="mt-3">Upload New Image</Button>
                    </Upload>
                </ImgCrop>
                <Button type="primary" onClick={handleOpenModal} className="mb-3 ms-5">
                    Select Image from Media
                </Button>
                <Modal
                    title="Select an Image"
                    open={isModalOpen}
                    onCancel={handleCloseModal}
                    footer={null}
                >
                    <div className="d-flex flex-wrap">
                        {mediaOptions.map((media) => (
                            <div
                                key={media.documentId}
                                style={{
                                    margin: '10px',
                                    cursor: 'pointer',
                                    border: selectedMedia?.id === media.id ? '2px solid blue' : '1px solid #ccc',
                                    borderRadius: '5px',
                                    overflow: 'hidden',
                                }}
                                onClick={() => handleSelectMedia(media)}
                            >
                                <img
                                    src={media.file_path}
                                    alt={media.file_type}
                                    style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                                />
                            </div>
                        ))}
                    </div>
                </Modal>
            </AntdForm>
        </Drawer>
    );
};

export default EditEvent;