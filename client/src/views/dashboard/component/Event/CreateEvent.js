import React, { useState } from 'react';
import { Drawer, Form, Input, Button, Space, TimePicker, Upload, Row, Col, Modal, notification } from 'antd';
import ImgCrop from 'antd-img-crop'; // Ensure you have antd-img-crop installed
import moment from 'moment';

import { apiPublicMedia, createMedia, uploadToMediaLibrary } from '../../../../services/media';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiCreateEvent } from '../../../../services/eventServices/event';
import { useSelector } from 'react-redux';


const CreateEvent = ({ open, onClose }) => {
    const { token, user } = useSelector((state) => state.root.auth || {});
    const [form] = Form.useForm();
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null); // For media library selection
    const [uploadedImage, setUploadedImage] = useState(null); // For user-uploaded image
    const queryClient = useQueryClient();

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
        if (!uploadedImage && !selectedMedia) {
            notification.error({
                message: 'Image Missing',
                description: 'Please select or upload an image before submitting.',
                placement: 'topRight',
            });
            return;
        }

        const imageData = uploadedImage
            ? { type: 'uploaded', url: uploadedImage }
            : { type: 'media', documentId: selectedMedia.documentId };

        const eventData = {
            ...values,
            startTime,
            endTime,
            image: imageData,
        };

        console.log('Event Data:', eventData);

        try {
            if (imageData.type === 'uploaded') {

                const uploadToCloudinary = async (file, folder = "default") => {
                    const cloudName = process.env.REACT_APP_CLOUDINARY_NAME;
                    const uploadPreset = process.env.REACT_APP_REACT_UPLOAD;
                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("upload_preset", uploadPreset);
                    formData.append("folder", folder);
                    try {
                      const response = await fetch(
                        `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
                        {
                          method: "POST",
                          body: formData,
                        }
                      );
                      const data = await response.json();
                      if (data.secure_url) {
                        return {
                          url: data.secure_url,
                          public_id: data.public_id,
                          mime: data.resource_type + "/" + data.format,
                          size: data.bytes,
                        };
                      } else {
                        throw new Error(data.error?.message || "Upload failed");
                      }
                    } catch (error) {
                      console.error("Error uploading file to Cloudinary:", error);
                    }
                  };
                // Handle the case where the image is uploaded
                const binaryImage = await fetch(imageData.url)
                    .then(res => res.blob())
                    .then(blob => {
                        const fileType = blob.type;
                        const fileName = 'uploaded-image.jpg'; // Default name for the uploaded image
                        return new File([blob], fileName, { type: fileType });
                    });

                    const uploadedFile = await uploadToCloudinary(binaryImage, "default");
                    const payload = {
                      file_path: uploadedFile.url,
                      file_type: uploadedFile.mime,
                      file_size: uploadedFile.size.toString(),
                      type_id: "pkw7l5p5gd4e70uy5bvgpnpv",
                    };
                    const response = await createMedia(payload, token);
                const payloadEvent = {
                        name: values.name,
                        description: values.description,
                        location: values.location,
                        host_id: user.documentId,
                        start_time: startTime.toISOString(), // Convert to ISO 8601 format
                        end_time: endTime.toISOString(), // Convert to ISO 8601 format
                        banner_id: response.data.data.documentId, // Use the documentId of the uploaded image
                }
                await apiCreateEvent(payloadEvent); // Assuming you have a function to create the event
                notification.success({
                    message: 'Success',
                    description: 'Event create successfully',
                    placement: 'topRight',
                });
                
                // You can add additional logic here if needed
            } else if (imageData.type === 'media') {
                const payload = {
                        name: values.name,
                        description: values.description,
                        location: values.location,
                        host_id: user.documentId,
                        start_time: startTime.toISOString(), // Convert to ISO 8601 format
                        end_time: endTime.toISOString(), // Convert to ISO 8601 format
                        banner_id: imageData.documentId // Use the documentId of the uploaded image
                }
                await apiCreateEvent(payload); // Assuming you have a function to create the event
                notification.success({
                    message: 'Success',
                    description: 'Event create successfully',
                    placement: 'topRight',
                });
            }

            //Reset form and states after successful submission
            form.resetFields();
            setStartTime(null);
            setEndTime(null);
            setUploadedImage(null);
            setSelectedMedia(null);
            onClose();
        } catch (error) {
            console.error('Error submitting event:', error);
            notification.error({
                message: 'Submission Failed',
                description: 'An error occurred while submitting the event. Please try again.',
                placement: 'topRight',
            });
        }
        queryClient.invalidateQueries('events');
    };

    const handleStartTimeChange = (time) => {
        setStartTime(time); // Store moment object directly
    };

    const handleEndTimeChange = (time) => {
        setEndTime(time); // Store moment object directly
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
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    name="name"
                    label="Event Name"
                    rules={[{ required: true, message: 'Please enter the event name' }]}
                >
                    <Input placeholder="Enter event name" />
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: 'Please enter the event description' }]}
                >
                    <Input.TextArea rows={4} placeholder="Enter event description" />
                </Form.Item>
                <Form.Item
                    name="location"
                    label="Location"
                    rules={[{ required: true, message: 'Please enter the event location' }]}
                >
                    <Input placeholder="Enter event location" />
                </Form.Item>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="startTime"
                            label="Start Time"
                            rules={[{ required: true, message: 'Please select the start time' }]}
                        >
                            <TimePicker
                                value={startTime ? moment(startTime, 'HH:mm') : null}
                                onChange={handleStartTimeChange}
                                format="HH:mm"
                                className="mb-3"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="endTime"
                            label="End Time"
                            rules={[{ required: true, message: 'Please select the end time' }]}
                        >
                            <TimePicker
                                value={endTime ? moment(endTime, 'HH:mm') : null}
                                onChange={handleEndTimeChange}
                                format="HH:mm"
                                className="mb-3"
                            />
                        </Form.Item>
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
                                : 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTPLni8uRBVk1jPCfgzmEF3P9EkrvQTj70C7QMd4ZkaWWdr14ww'
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
            </Form>
        </Drawer>
    );
};

export default CreateEvent;
