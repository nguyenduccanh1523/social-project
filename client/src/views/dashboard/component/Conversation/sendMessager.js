import React, { useState, useRef } from "react";
import { Form, Button } from "react-bootstrap";
import {
  SmileOutlined,
  PaperClipOutlined,
  SendOutlined,
  FileImageOutlined
} from "@ant-design/icons";
import { Upload, Modal } from 'antd';
import { useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { apiGetConver } from "../../../../services/conversation";
import { useSelector } from "react-redux";
import EmojiPicker from 'emoji-picker-react';
import { createMedia, uploadToMediaLibrary } from "../../../../services/media";
import { apiCreateMessager } from "../../../../services/message";
import socket from "../../../../socket";
import { useEffect } from "react";

const SendMessager = ({ conversation }) => {
  const { user } = useSelector((state) => state.root.auth || {});
  const { token } = useSelector((state) => state.root.auth || {});
  const [message, setMessage] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [otherFiles, setOtherFiles] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const pickerRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: conver } = useQuery({
    queryKey: ['conver', conversation],
    queryFn: () => apiGetConver({ documentId: conversation }),
    enabled: !!conversation,
    staleTime: 600000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  const converData = conver?.data?.data || {};

  useEffect(() => {
    if (user?.documentId) {
      socket.emit("register", user.documentId);
    }
  }, [user?.documentId]);
  

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() && fileList.length === 0 && otherFiles.length === 0) {
      return; // Do not send if the message is empty and no file is selected
    }
    const data = {
      conversationId: conversation,
      content: message,
      senderId: "currentUserId", // Replace with actual sender ID
      files: fileList, // Add image files to the data
      otherFiles: otherFiles.map(file => ({ name: file.name, url: file.url || file.thumbUrl })), // Add other files to the data
    };
    // console.log("Sending message:", data);
    // console.log("Message content:", message);
    // console.log("Image files:", selectedImages);
    // console.log("Other files:", otherFiles);

    if (message.trim()) {
      const payload = {
        sender_id: user?.documentId,
        conversation_id: conversation,
        content: message,
      };
      await apiCreateMessager(payload);
      // Gửi tin nhắn qua socket
      socket.emit("send_message", {
        toUserId: converData?.participant?.documentId === user?.documentId ? converData?.creator?.documentId : converData?.participant?.documentId, // người nhận
        message: {
          ...payload,
          sender: user,
          createdAt: new Date().toISOString(),
        }
      });
    }
    if (selectedImages?.length) {
      for (const image of selectedImages) {

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

        const binaryImage = await fetch(image.url)
          .then(res => res.blob())
          .then(blob => {
            const fileType = blob.type;
            const fileName = image.name || 'image.jpg';
            return new File([blob], fileName, { type: fileType });
          });
        try {
          const uploadedFile = await uploadToCloudinary(binaryImage, "default");
          const payload = {
            file_path: uploadedFile.url,
            file_type: uploadedFile.mime,
            file_size: uploadedFile.size.toString(),
            type_id: "pkw7l5p5gd4e70uy5bvgpnpv",
          };
          const response = await createMedia(payload, token);
          const payloadMessage = {
            sender_id: user?.documentId,
            conversation_id: conversation,
            media_id: response.data.data.documentId,
          };
          await apiCreateMessager(payloadMessage);
          // Gửi tin nhắn qua socket
          socket.emit("send_message", {
            toUserId: converData?.participant?.documentId === user?.documentId ? converData?.creator?.documentId : converData?.participant?.documentId, // người nhận
            message: {
              ...payload,
              media: response.data.data, 
              sender: user,
              createdAt: new Date().toISOString(),
            }
          });
        } catch (error) {
          console.error('Error adding image:', error.response || error);
        }
      }
    }

    // Add your send message logic here
    setMessage(""); // Clear the input after sending
    setSelectedImages([]); // Clear the image file list after sending
    setOtherFiles([]); // Clear the other file list after sending
    queryClient.invalidateQueries('messages');
  };

  const onEmojiClick = (emoji) => {
    setMessage(prevMessage => prevMessage + emoji.emoji);
  };

  const handlePreview = async file => {
    setPreviewImage(file.url || file.preview || file.thumbUrl);
    setPreviewVisible(true);
  };

  const handleRemoveImage = (imageUrl) => {
    setSelectedImages((prevImages) => prevImages.filter((img) => img.url !== imageUrl));
    setFileList((prevFileList) => prevFileList.filter((file) => file.thumbUrl !== imageUrl));
    // Delay revoking the object URL to ensure it can be re-added
    setTimeout(() => {
      URL.revokeObjectURL(imageUrl);
    }, 100);
  };

  const handleBannerUpload = ({ file, fileList }) => {
    setFileList(fileList);

    if (file.status === 'removed') {
      setSelectedImages((prevImages) => prevImages.filter((img) => img.name !== file.name));
      return;
    }

    if (file.status === 'uploading') {
      setUploading(true);
      return;
    }

    if (file.status === 'done' || file.status === 'error') {
      setUploading(false);
    }

    if (file.originFileObj) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImages((prevImages) => [...prevImages, { url: reader.result, name: file.name }]);
      };
      reader.readAsDataURL(file.originFileObj);
    }
  };

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  const handleOtherFilesUpload = ({ file, fileList }) => {
    if (file.status === 'removed') {
      setOtherFiles([]);
      return;
    }

    if (fileList.length > 1) {
      fileList = [fileList[fileList.length - 1]];
    }

    setOtherFiles(fileList.map(file => {
      if (file.originFileObj) {
        const reader = new FileReader();
        reader.onload = () => {
          file.url = reader.result;
        };
        reader.readAsDataURL(file.originFileObj);
      }
      return file;
    }));
  };

  return (
    <>
      {selectedImages.length > 0 && (
        <div className="d-flex flex-wrap justify-content-center mb-3">
          {selectedImages.map((image, index) => (
            <div key={index} className="position-relative m-2">
              <img
                src={image.url}
                alt={`Selected ${index}`}
                className="img-fluid rounded"
                style={{ maxHeight: "150px" }}
              />
              <button
                type="button"
                className="btn btn-danger btn-sm position-absolute top-0 end-0"
                onClick={() => handleRemoveImage(image.url)}
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="chat-footer p-3 bg-white">
        <Form className="d-flex align-items-center" action="#" onSubmit={handleSendMessage} style={{ width: '100%' }}>
          <div className="chat-attagement d-flex gap-2 align-items-center">
            <SmileOutlined onClick={() => setShowPicker(!showPicker)} />
            <Upload
              accept="image/*"
              showUploadList={false}
              customRequest={dummyRequest}
              onChange={handleBannerUpload}
              fileList={fileList}
              onRemove={(file) => handleRemoveImage(file.thumbUrl)}
              onPreview={() => { }}
            >
              <FileImageOutlined style={{ fontSize: '24px', cursor: 'pointer' }} />
            </Upload>
            <Upload
              fileList={otherFiles}
              onChange={handleOtherFilesUpload}
              beforeUpload={() => false} // Prevent automatic upload
              accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx" // Accept only non-image files
            >
              {otherFiles.length >= 1 ? null : <PaperClipOutlined style={{ fontSize: '24px', cursor: 'pointer' }} />}
            </Upload>
          </div>
          <Form.Control
            type="text"
            className="me-3 flex-grow-1 ms-2"
            placeholder="Type your message"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              socket.emit("typing", {
                conversationId: conversation,
                fromUserId: user?.documentId,
                toUserId: converData?.participant?.documentId === user?.documentId ? converData?.creator?.documentId : converData?.participant?.documentId,
              });
              console.log("Đang gửi typing socket tới:", converData?.participant?.documentId);
            }}
          />
          <Button type="submit" variant="primary d-flex align-items-center" disabled={!message.trim() && fileList.length === 0 && otherFiles.length === 0}>
            <SendOutlined />
            <span className="d-none d-lg-block ms-1">Send</span>
          </Button>
        </Form>
      </div>
      {showPicker && (
        <div ref={pickerRef} className="replyPicker" style={{ position: 'absolute', bottom: '60px', right: '20px', zIndex: 1000 }}>
          <EmojiPicker onEmojiClick={onEmojiClick} style={{ height: '400px' }} />
        </div>
      )}
      <Modal open={previewVisible} footer={null} onCancel={() => setPreviewVisible(false)}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default SendMessager;
