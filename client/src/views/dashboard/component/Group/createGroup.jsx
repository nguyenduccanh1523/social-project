import React, { useEffect, useState } from "react";
import {
    Drawer,
    Form,
    Input,
    Button,
    Space,
    Upload,
    Modal,
    notification,
    Select,
} from "antd";
import ImgCrop from "antd-img-crop"; // Ensure you have antd-img-crop installed
import styled from "styled-components";

import {
    apiPublicMedia,
    createMedia,
    uploadToMediaLibrary,
} from "../../../../services/media";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { fetchTag } from "../../../../actions/actions/tag";
import { apiCreatePage } from "../../../../services/page";
import { apiCreatePostTag } from "../../../../services/tag"; // Import the API function
import { apiCreateGroup } from "../../../../services/groupServices/group";

const CreateGroup = ({ open, onClose }) => {
    const dispatch = useDispatch();
    const { profile } = useSelector((state) => state.root.user || {});
    const [form] = Form.useForm();
    const [uploading, setUploading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null); // For media library selection
    const [uploadedImage, setUploadedImage] = useState(null); // For user-uploaded image
    const [isPrivate, setIsPrivate] = useState(false);
    const queryClient = useQueryClient();

    useEffect(() => {
        dispatch(fetchTag());
    }, [dispatch]);

    //console.log("Tags:", tags);

    const {
        data: publicMedia,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["publicMedia"],
        queryFn: apiPublicMedia,
    });

    const mediaOptions = publicMedia?.data?.data || [];

    //console.log('publicMedia:', mediaOptions);

    const handleBannerUpload = ({ file, fileList }) => {
        setFileList(fileList);

        if (file.status === "removed") {
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
                message: "Image Missing",
                description: "Please select or upload an image before submitting.",
                placement: "topRight",
            });
            return;
        }

        const imageData = uploadedImage
            ? { type: "uploaded", url: uploadedImage }
            : { type: "media", documentId: selectedMedia.documentId };

        const pageData = {
            ...values,
            tag: values.tag,
            image: imageData,
            type: isPrivate ? "private" : "public",
        };

        console.log("Page Data:", pageData);
        try {
            let pageResponse;
            if (imageData.type === "uploaded") {
                //console.log("Uploading image to media library...");
                const binaryImage = await fetch(imageData.url)
                    .then((res) => res.blob())
                    .then((blob) => {
                        const fileType = blob.type;
                        const fileName = "uploaded-image.jpg";
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
                const payloadEvent = {
                    data: {
                        group_name: values.name,
                        description: values.description,
                        type: isPrivate ? 'pkw7l5p5gd4e70uy5bvgpnpv' : 'elx6zlfz9ywp6esoyfi6a1yl',
                        admin_id: profile.documentId,
                        media: response.data.data.documentId,
                    },
                };
                pageResponse = await apiCreateGroup(payloadEvent);
            } else if (imageData.type === "media") {
                //console.log("Using selected media...");
                const payload = {
                    data: {
                        group_name: values.name,
                        description: values.description,
                        type: isPrivate ? 'pkw7l5p5gd4e70uy5bvgpnpv' : 'elx6zlfz9ywp6esoyfi6a1yl',
                        admin_id: profile.documentId,
                        media: imageData.documentId,
                    },
                };
                pageResponse = await apiCreateGroup(payload);
            }

            const pageId = pageResponse?.data?.data?.documentId; // Extract the page ID

            notification.success({
                message: "Success",
                description: "Group created successfully",
                placement: "topRight",
            });

            // Reset form and states after successful submission
            form.resetFields();
            setUploadedImage(null);
            setSelectedMedia(null);
            onClose();

        } catch (error) {
            console.error("Error submitting page:", error);
            notification.error({
                message: "Submission Failed",
                description:
                    "An error occurred while submitting the Page. Please try again.",
                placement: "topRight",
            });
        }
        queryClient.invalidateQueries("myPages");
    };

    const handleCheckboxChange = (e) => {
        setIsPrivate(e.target.checked);
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
            title="Create Group"
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
            style={{ marginTop: "74px", height: "calc(100% - 74px)" }} // Adjust marginTop and height
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>

                <Form.Item
                    name="name"
                    label="Group Name"
                    rules={[{ required: true, message: "Please enter the page name" }]}
                >
                    <Input placeholder="Enter event name" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Page Description"
                    rules={[{ required: true, message: "Please enter the page description" }]}
                >
                    <Input placeholder="Enter page intro" />
                </Form.Item>

                <StyledWrapper className="mt-3 mb-3">
                    <div>
                        <label className="switch">
                            <input type="checkbox" checked={isPrivate} onChange={handleCheckboxChange} />
                            <span>
                                <em />
                                <strong />
                            </span>
                        </label>
                    </div>
                </StyledWrapper>

                <p>Image banner</p>
                <hr />
                <div className="position-relative m-2">
                    <img
                        src={
                            uploadedImage // Show uploaded image if available
                                ? uploadedImage
                                : selectedMedia // Otherwise, show selected media
                                    ? selectedMedia.file_path
                                    : "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTPLni8uRBVk1jPCfgzmEF3P9EkrvQTj70C7QMd4ZkaWWdr14ww"
                        }
                        alt="Page Profile"
                        className="img-fluid rounded"
                        style={{ maxHeight: "270px", objectFit: "fill", width: "100%" }}
                    />
                </div>
                <ImgCrop aspect={16 / 9} rotationSlider>
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
                                    margin: "10px",
                                    cursor: "pointer",
                                    border:
                                        selectedMedia?.id === media.id
                                            ? "2px solid blue"
                                            : "1px solid #ccc",
                                    borderRadius: "5px",
                                    overflow: "hidden",
                                }}
                                onClick={() => handleSelectMedia(media)}
                            >
                                <img
                                    src={media.file_path}
                                    alt={media.file_type}
                                    style={{
                                        width: "200px",
                                        height: "200px",
                                        objectFit: "cover",
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </Modal>
            </Form>
        </Drawer>
    );
};

const StyledWrapper = styled.div`
  .switch {
    height: 24px;
    display: block;
    position: relative;
    cursor: pointer;
  }
  .switch input {
    display: none;
  }
  .switch input + span {
    padding-left: 50px;
    min-height: 24px;
    line-height: 24px;
    display: block;
    color: #99a3ba;
    position: relative;
    vertical-align: middle;
    white-space: nowrap;
    transition: color 0.3s ease;
  }
  .switch input + span:before,
  .switch input + span:after {
    content: "";
    display: block;
    position: absolute;
    border-radius: 12px;
  }
  .switch input + span:before {
    top: 0;
    left: 0;
    width: 42px;
    height: 24px;
    background: #e4ecfa;
    transition: all 0.3s ease;
  }
  .switch input + span:after {
    width: 18px;
    height: 18px;
    background: #fff;
    top: 3px;
    left: 3px;
    box-shadow: 0 1px 3px rgba(18, 22, 33, 0.1);
    transition: all 0.45s ease;
  }
  .switch input + span em {
    width: 8px;
    height: 7px;
    background: #99a3ba;
    position: absolute;
    left: 8px;
    bottom: 7px;
    border-radius: 2px;
    display: block;
    z-index: 1;
    transition: all 0.45s ease;
  }
  .switch input + span em:before {
    content: "";
    width: 2px;
    height: 2px;
    border-radius: 1px;
    background: #fff;
    position: absolute;
    display: block;
    left: 50%;
    top: 50%;
    margin: -1px 0 0 -1px;
  }
  .switch input + span em:after {
    content: "";
    display: block;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border: 1px solid #99a3ba;
    border-bottom: 0;
    width: 6px;
    height: 4px;
    left: 1px;
    bottom: 6px;
    position: absolute;
    z-index: 1;
    transform-origin: 0 100%;
    transition: all 0.45s ease;
    transform: rotate(-35deg) translate(0, 1px);
  }
  .switch input + span strong {
    font-weight: normal;
    position: relative;
    display: block;
    top: 1px;
  }
  .switch input + span strong:before,
  .switch input + span strong:after {
    font-size: 14px;
    font-weight: 500;
    display: block;
    font-family: "Mukta Malar", Arial;
    -webkit-backface-visibility: hidden;
  }
  .switch input + span strong:before {
    content: "Group Public";
    transition: all 0.3s ease 0.2s;
  }
  .switch input + span strong:after {
    content: "Group Private";
    opacity: 0;
    visibility: hidden;
    position: absolute;
    left: 0;
    top: 0;
    color: #02923c;
    transition: all 0.3s ease;
    transform: translate(2px, 0);
  }
  .switch input:checked + span:before {
    background: #eae7e7;
  }
  .switch input:checked + span:after {
    background: #fff;
    transform: translate(18px, 0);
  }
  .switch input:checked + span em {
    transform: translate(18px, 0);
    background: #02923c;
  }
  .switch input:checked + span em:after {
    border-color: #02923c;
    transform: rotate(0deg) translate(0, 0);
  }
  .switch input:checked + span strong:before {
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    transform: translate(-2px, 0);
  }
  .switch input:checked + span strong:after {
    opacity: 1;
    visibility: visible;
    transform: translate(0, 0);
    transition: all 0.3s ease 0.2s;
  }

  .switch :before,
  :after {
    box-sizing: border-box;
  }`;

export default CreateGroup;
