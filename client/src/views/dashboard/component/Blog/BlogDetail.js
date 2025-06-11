import React, { useRef, useState } from "react";
import {
  Modal,
  Image,
  Space,
  Avatar,
  Divider,
  Typography,
  Tag,
} from "antd";
import {
  MessageOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { colorsTag, convertToVietnamDate } from "../../others/format";
import "./BlogDetail.css";
import ActionComment from "./actionComment/actionComment";
import { useSelector } from "react-redux";
import Send from "./actionComment/Send";
import EmojiPicker from 'emoji-picker-react';
import { useQuery } from '@tanstack/react-query';
import { apiGetDocumentTag } from "../../../../services/tag";


const { Title, Text, Paragraph } = Typography;

const BlogDetail = ({ blog, visible, onClose, onSave, isSaved }) => {
  const { user } = useSelector((state) => state.root.auth || {});
  const { token } = useSelector((state) => state.root.auth || {});
  const [comment, setComment] = useState((''));
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

  const { data: documentTag, isLoading: isFollowStatusLoading } = useQuery({
    queryKey: ["documentTag", blog?.documentId],
    queryFn: async () => {
      const response = await apiGetDocumentTag({ documentId: blog?.documentId, token });
      //console.log('s', response )
      return response.data?.data;
    },
    enabled: !!blog?.documentId,
  });

  if (!blog) return null;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setComment(prevComment => prevComment + '\n');
    }
  };

  const handleClickOutside = (event) => {
    if (pickerRef.current && !pickerRef.current.contains(event.target)) {
      setShowPicker(false);
    }
  };

  const handleSendClick = async () => {
    // Logic for sending the comment
    // You can call the Send component's handleSendClick function here if needed
    setComment(''); // Reset the comment after sending
  };

  const handleSendSuccess = () => {
    setComment(''); // Reset the comment after successful send
  };

  const onEmojiClick = (emoji) => {
    setComment(prevComment => prevComment + emoji.emoji);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = async (e) => {
    console.log('Form data:', comment);
    e.preventDefault();
    // Add your submit logic here
    await handleSendClick(); // Call the send function
    setShowPicker(false); // Close the emoji picker
  };




  return (
    <>
      <Modal
        open={visible}
        onCancel={onClose}
        width={800}
        footer={null}
        centered
        style={{ top: 50, maxHeight: "80vh", overflowY: "auto" }}
      //bodyStyle={{ maxHeight: "80vh", overflowY: "auto", padding: 0 }}
      >
        <div className="blog-detail-container">
          {/* Header Image & Title */}
          <div className="blog-image-container">
            <div className="blog-image-wrapper">
              <Image
                src={blog?.media?.file_path}
                alt={blog?.title}
                preview={false}
                className="blog-image w-100 h-100"
              />
            </div>
            <div className="blog-gradient-overlay">
              <Title level={2} className="blog-title ant-typography">
                {blog?.title}
              </Title>
            </div>
          </div>

          {/* Author & Content Section */}
          <div className="blog-author-section">
            <div className="blog-author-header">
              <Space align="center">
                <Avatar
                  src={blog?.creator?.avatarMedia?.file_path}
                  icon={<UserOutlined />}
                  size={45}
                />
                <div>
                  <Text strong style={{ fontSize: 16, marginTop: '10px' }}>
                    {blog?.creator?.username || "Anonymous"}
                  </Text>
                  <div>
                    <Text type="secondary">
                      {convertToVietnamDate(blog?.createdAt)}
                    </Text>

                  </div>
                </div>
              </Space>
              <div className="blog-tags mb-2">
                {blog?.tags?.map((tagItem, index) => (
                  <Tag
                    key={tagItem?.tag?.documentId}
                    color={colorsTag[index % colorsTag.length]}
                    style={{ marginBottom: '5px' }}
                  >
                    {tagItem?.tag?.name}
                  </Tag>
                ))}
              </div>
              <Space size="large">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <MessageOutlined style={{ fontSize: 22, marginRight: 8 }} />
                  <Text>{blog?.comments?.length || 0} comments</Text>
                </div>
              </Space>
            </div>

            <Divider />

            {/* Blog Content */}
            <div className="blog-content">
              <Paragraph className="blog-content-text">
                {blog?.description}
              </Paragraph>
              {blog?.content && (
                <Paragraph className="blog-content-text">
                  {blog?.content}
                </Paragraph>
              )}
            </div>

            <div className="d-flex justify-content-center align-items-center">
              <div className="user-img">
                <img
                  src={user?.avatarMedia?.file_path}
                  alt="user1"
                  className="avatar-45 rounded-circle img-fluid"
                />
              </div>
              <form className="comment-text d-flex align-items-center m-2" onSubmit={handleSubmit}>
                <textarea
                  className="form-control rounded replyText"
                  placeholder="Enter Your Comment"
                  value={comment}
                  onChange={handleCommentChange}
                  onKeyDown={handleKeyDown}
                  rows="3"
                  style={{ width: "450px", height: "30px", boxShadow: "none", resize: "none" }}
                />
                <div className="d-flex align-items-center m-1 replyEmoSend gap-2">
                  <span
                    className="material-symbols-outlined ms-2"
                    onClick={() => setShowPicker(!showPicker)}
                    style={{ cursor: "pointer" }}
                  >
                    emoji_emotions
                  </span>
                  <Send formData={{
                    inputText: comment,
                  }} blog={blog} profile={user} onSend={handleSendSuccess} />
                </div>
              </form>

            </div>
            {showPicker && (
              <div ref={pickerRef} className="replyPicker">
                <EmojiPicker onEmojiClick={onEmojiClick} style={{ height: '400px' }} />
              </div>
            )}

            {/* Comments Section */}
            <ActionComment blog={blog} />
          </div>
        </div>


      </Modal>

    </>
  );
};

export default BlogDetail;
