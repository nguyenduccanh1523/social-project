import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm } from 'antd';
import { Container } from 'react-bootstrap';

const PostsManagement = () => {
  const [posts, setPosts] = useState([
    { id: 1, title: 'Bài viết 1', status: 'Published', date: '2025-06-17', author: 'user1', content: 'Nội dung bài viết 1', lastUpdated: '2025-06-18' },
    { id: 2, title: 'Bài viết 2', status: 'Draft', date: '2025-06-16', author: 'user2', content: 'Nội dung bài viết 2', lastUpdated: '2025-06-17' },
    { id: 3, title: 'Bài viết 3', status: 'Published', date: '2025-06-15', author: 'user3', content: 'Nội dung bài viết 3', lastUpdated: '2025-06-18' },
    { id: 4, title: 'Bài viết 4', status: 'Draft', date: '2025-06-14', author: 'user4', content: 'Nội dung bài viết 4', lastUpdated: '2025-06-16' },
    { id: 5, title: 'Bài viết 5', status: 'Published', date: '2025-06-13', author: 'user5', content: 'Nội dung bài viết 5', lastUpdated: '2025-06-18' },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [viewingPost, setViewingPost] = useState(null);
  const [form] = Form.useForm();

  // Thêm bài viết
  const handleAddPost = () => {
    setEditingPost(null);
    form.resetFields();
    setIsEditModalVisible(true);
  };

  const handleEditOk = () => {
    form.validateFields().then(values => {
      if (editingPost) {
        // Cập nhật bài viết
        setPosts(posts.map(post =>
          post.id === editingPost.id ? { ...post, ...values, lastUpdated: new Date().toISOString().split('T')[0] } : post
        ));
      } else {
        // Thêm bài viết mới
        const newPost = {
          id: posts.length + 1,
          ...values,
          status: 'Draft',
          date: new Date().toISOString().split('T')[0],
          lastUpdated: new Date().toISOString().split('T')[0],
        };
        setPosts([...posts, newPost]);
      }
      setIsEditModalVisible(false);
      form.resetFields();
    });
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    form.resetFields();
  };

  // Xem bài viết
  const handleViewPost = (record) => {
    setViewingPost(record);
    setIsViewModalVisible(true);
  };

  // Sửa bài viết
  const handleEditPost = (record) => {
    setEditingPost(record);
    form.setFieldsValue(record);
    setIsEditModalVisible(true);
  };

  // Xóa bài viết
  const handleDeletePost = (id) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
    { title: 'Tác giả', dataIndex: 'author', key: 'author' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <span className={text === 'Published' ? 'text-success' : 'text-danger'}>
          {text}
        </span>
      ),
    },
    { title: 'Ngày đăng', dataIndex: 'date', key: 'date' },
    { title: 'Cập nhật lần cuối', dataIndex: 'lastUpdated', key: 'lastUpdated' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="default" onClick={() => handleViewPost(record)}>
            Xem
          </Button>
          <Button type="primary" onClick={() => handleEditPost(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa bài viết này?"
            onConfirm={() => handleDeletePost(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Container className="py-4 bg-light min-vh-100">
      <h2 className="text-center mb-4">Quản lý bài viết</h2>
      <div className="mb-3 text-end">
        <Button type="primary" onClick={handleAddPost}>
          Thêm bài viết
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={posts}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: posts.length,
          onChange: (page) => setCurrentPage(page),
          onShowSizeChange: (_, size) => setPageSize(size),
          showSizeChanger: true,
          pageSizeOptions: ['3', '5', '10'],
        }}
        bordered
        className="shadow-sm"
      />
      {/* Modal chỉnh sửa/thêm */}
      <Modal
        title={editingPost ? 'Sửa bài viết' : 'Thêm bài viết'}
        visible={isEditModalVisible}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="author"
            label="Tác giả"
            rules={[{ required: true, message: 'Vui lòng nhập tác giả!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="content"
            label="Nội dung"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="date"
            label="Ngày đăng"
            rules={[{ required: true, message: 'Vui lòng nhập ngày đăng!' }]}
          >
            <Input disabled={!!editingPost} />
          </Form.Item>
        </Form>
      </Modal>
      {/* Modal xem chi tiết */}
      <Modal
        title="Thông tin chi tiết bài viết"
        visible={isViewModalVisible}
        onOk={() => setIsViewModalVisible(false)}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsViewModalVisible(false)}>
            Đóng
          </Button>,
        ]}
      >
        {viewingPost && (
          <div>
            <p><strong>ID:</strong> {viewingPost.id}</p>
            <p><strong>Tiêu đề:</strong> {viewingPost.title}</p>
            <p><strong>Tác giả:</strong> {viewingPost.author}</p>
            <p>
              <strong>Trạng thái:</strong>
              <span className={viewingPost.status === 'Published' ? 'text-success' : 'text-danger'}>
                {viewingPost.status}
              </span>
            </p>
            <p><strong>Nội dung:</strong> {viewingPost.content}</p>
            <p><strong>Ngày đăng:</strong> {viewingPost.date}</p>
            <p><strong>Cập nhật lần cuối:</strong> {viewingPost.lastUpdated}</p>
          </div>
        )}
      </Modal>
    </Container>
  );
};

export default PostsManagement;