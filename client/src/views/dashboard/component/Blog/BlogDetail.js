import React from "react";
import {
  Modal,
  Image,
  Space,
  Avatar,
  Divider,
  Typography,
  Input,
  Button,
} from "antd";
import {
  StarOutlined,
  StarFilled,
  MessageOutlined,
  UserOutlined,
  LikeOutlined,
} from "@ant-design/icons";
import { convertToVietnamDate } from "../../others/format";
import "./BlogDetail.css";

const { Title, Text, Paragraph } = Typography;

const CommentItem = ({ comment, isReply = false }) => (
  <div className={`comment-item ${isReply ? "reply" : ""}`}>
    <div className="comment-content">
      <Avatar
        icon={<UserOutlined />}
        style={{
          backgroundColor: isReply ? "#52c41a" : "#1890ff",
          flexShrink: 0,
        }}
      />
      <div className="comment-body">
        <div className="comment-header">
          <Text strong style={{ marginRight: 8 }}>
            {comment.author}
          </Text>
          <Text type="secondary">{convertToVietnamDate(comment.datetime)}</Text>
        </div>
        <Paragraph className="comment-text">{comment.content}</Paragraph>
        <Space>
          <Button type="text" icon={<LikeOutlined />}>
            {comment.likes}
          </Button>
          <Button type="text">Reply</Button>
        </Space>
      </div>
    </div>
  </div>
);

const BlogDetail = ({ blog, visible, onClose, onSave, isSaved }) => {
  if (!blog) return null;

  // Data mẫu cho comments
  const dummyComments = [
    {
      id: 1,
      author: "John Doe",
      content: "Bài viết rất hay và bổ ích!",
      datetime: "2024-03-15T10:00:00",
      likes: 12,
      replies: [
        {
          id: 11,
          author: "Jane Smith",
          content: "Tôi hoàn toàn đồng ý với bạn",
          datetime: "2024-03-15T10:30:00",
          likes: 3,
        },
      ],
    },
    {
      id: 2,
      author: "Alice Johnson",
      content: "Cảm ơn tác giả đã chia sẻ thông tin hữu ích",
      datetime: "2024-03-15T09:00:00",
      likes: 8,
    },
  ];

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      width={800}
      footer={null}
      centered
      style={{ top: 50 }}
      bodyStyle={{ maxHeight: "80vh", overflowY: "auto", padding: 0 }}
    >
      <div className="blog-detail-container">
        {/* Header Image & Title */}
        <div className="blog-image-container">
          <div className="blog-image-wrapper">
            <Image
              src={blog?.media?.file_path}
              alt={blog?.title}
              preview={false}
              className="blog-image"
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
                src={blog?.author?.profile_picture}
                icon={<UserOutlined />}
                size={45}
              />
              <div>
                <Text strong style={{ fontSize: 16 }}>
                  {blog?.author?.username || "Anonymous"}
                </Text>
                <br />
                <Text type="secondary">
                  {convertToVietnamDate(blog?.createdAt)}
                </Text>
              </div>
            </Space>
            <Space size="large">
              <div onClick={onSave} style={{ cursor: "pointer", fontSize: 22 }}>
                {isSaved ? (
                  <StarFilled style={{ color: "#1890ff" }} />
                ) : (
                  <StarOutlined />
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <MessageOutlined style={{ fontSize: 22, marginRight: 8 }} />
                <Text>{blog?.commentCount || 0} comments</Text>
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

          {/* Tags */}
          {blog?.tags && blog.tags.length > 0 && (
            <Space wrap className="blog-tags">
              {blog.tags.map((tag, index) => (
                <Text key={index} code style={{ padding: "4px 12px" }}>
                  {tag}
                </Text>
              ))}
            </Space>
          )}

          {/* Comments Section */}
          <div className="blog-comments-section">
            <Divider orientation="left">
              <Space>
                <MessageOutlined />
                <Text strong>Comments ({dummyComments.length})</Text>
              </Space>
            </Divider>

            {/* Comments List */}
            <div className="comments-section">
              {dummyComments.map((comment) => (
                <div key={comment.id}>
                  <CommentItem comment={comment} />
                  {comment.replies?.map((reply) => (
                    <CommentItem
                      key={reply.id}
                      comment={reply}
                      isReply={true}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* Comment Input */}
            <div className="comment-input-section">
              <Avatar
                icon={<UserOutlined />}
                style={{ backgroundColor: "#1890ff", flexShrink: 0 }}
              />
              <div className="comment-input-wrapper">
                <Input.TextArea
                  rows={4}
                  placeholder="Viết bình luận của bạn..."
                  className="comment-textarea"
                />
                <Button type="primary">Gửi bình luận</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default BlogDetail;
