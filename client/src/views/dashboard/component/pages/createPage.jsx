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

import {
  apiPublicMedia,
  createMedia,
  uploadToMediaLibrary,
} from "../../../../services/media";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiCreateEvent } from "../../../../services/eventServices/event";
import { useDispatch, useSelector } from "react-redux";
import { fetchTag } from "../../../../actions/actions/tag";
import { apiCreatePage } from "../../../../services/page";
import { apiCreatePostTag } from "../../../../services/tag"; // Import the API function

const CreatePage = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { tags } = useSelector((state) => state.root.tag || {});
  const { profile } = useSelector((state) => state.root.user || {});
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null); // For media library selection
  const [uploadedImage, setUploadedImage] = useState(null); // For user-uploaded image
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
    if (!values.tag) {
      notification.error({
        message: "Tag Missing",
        description: "Please select a tag before submitting.",
        placement: "topRight",
      });
      return;
    }

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
    };

    try {
      let pageResponse;
      if (imageData.type === "uploaded") {
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
            page_name: values.name,
            intro: values.intro,
            about: values.about,
            phone: values.phone,
            author: profile.documentId,
            profile_picture: response.data.data.documentId,
          },
        };
        pageResponse = await apiCreatePage(payloadEvent);
      } else if (imageData.type === "media") {
        const payload = {
          data: {
            page_name: values.name,
            intro: values.intro,
            about: values.about,
            phone: values.phone,
            author: profile.documentId,
            profile_picture: imageData.documentId,
          },
        };
        pageResponse = await apiCreatePage(payload);
      }

      const pageId = pageResponse?.data?.data?.documentId; // Extract the page ID
      if (pageId) {
        const postTagPayload = {
          data: {
            page_id: pageId,
            tag_id: values.tag,
          },
        };
        await apiCreatePostTag(postTagPayload); // Call the API to create the post tag
      }

      notification.success({
        message: "Success",
        description: "Page and tag association created successfully",
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
          "An error occurred while submitting the page. Please try again.",
        placement: "topRight",
      });
    }
    queryClient.invalidateQueries("myPages");
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
      title="Create Page"
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
          label="Page Name"
          rules={[{ required: true, message: "Please enter the event name" }]}
        >
          <Input placeholder="Enter event name" />
        </Form.Item>
        <Form.Item
          name="intro"
          label="Page Intro"
          rules={[{ required: true, message: "Please enter the page intro" }]}
        >
          <Input placeholder="Enter page intro" />
        </Form.Item>
        <Form.Item
          name="about"
          label="Page About"
          rules={[{ required: true, message: "Please enter the page about" }]}
        >
          <Input.TextArea rows={4} placeholder="Enter page about" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Page Phone"
          rules={[{ required: true, message: "Please enter the Page Phone" }]}
        >
          <Input placeholder="Enter page phone" />
        </Form.Item>
        <Form.Item
          name="tag"
          label="Select Tag"
          rules={[{ required: true, message: "Please select a tag" }]}
        >
          <Select
            placeholder="Select a tag"
            options={tags?.data?.map((item) => ({
              label: item.name,
              value: item.documentId,
            }))}
          />
        </Form.Item>

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
            style={{ maxHeight: "150px", objectFit: "fill", width: "50%" }}
          />
        </div>
        <ImgCrop aspect={4 / 4} rotationSlider>
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

export default CreatePage;
