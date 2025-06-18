import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm } from 'antd';
import { Container } from 'react-bootstrap';

const UsersManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, username: 'user1', role: 'Admin', status: 'Active', email: 'user1@example.com', joinedDate: '2025-06-01', address: '123 Hanoi St.' },
    { id: 2, username: 'user2', role: 'Editor', status: 'Inactive', email: 'user2@example.com', joinedDate: '2025-06-02', address: '456 Ho Chi Minh City' },
    { id: 3, username: 'user3', role: 'Moderator', status: 'Active', email: 'user3@example.com', joinedDate: '2025-06-03', address: '789 Da Nang St.' },
    { id: 4, username: 'user4', role: 'Viewer', status: 'Inactive', email: 'user4@example.com', joinedDate: '2025-06-04', address: '101 Hai Phong St.' },
    { id: 5, username: 'user5', role: 'Admin', status: 'Active', email: 'user5@example.com', joinedDate: '2025-06-05', address: '202 Can Tho St.' },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [form] = Form.useForm();

  // Thêm người dùng
  const handleAddUser = () => {
    setEditingUser(null);
    form.resetFields();
    setIsEditModalVisible(true);
  };

  const handleEditOk = () => {
    form.validateFields().then(values => {
      if (editingUser) {
        // Cập nhật người dùng
        setUsers(users.map(user =>
          user.id === editingUser.id ? { ...user, ...values } : user
        ));
      } else {
        // Thêm người dùng mới
        const newUser = {
          id: users.length + 1,
          ...values,
          status: 'Active',
          joinedDate: new Date().toISOString().split('T')[0], // Ngày tham gia mặc định là hôm nay
        };
        setUsers([...users, newUser]);
      }
      setIsEditModalVisible(false);
      form.resetFields();
    });
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    form.resetFields();
  };

  // Xem người dùng
  const handleViewUser = (record) => {
    setViewingUser(record);
    setIsViewModalVisible(true);
  };

  // Sửa người dùng
  const handleEditUser = (record) => {
    setEditingUser(record);
    form.setFieldsValue(record);
    setIsEditModalVisible(true);
  };

  // Xóa người dùng
  const handleDeleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Tên người dùng', dataIndex: 'username', key: 'username' },
    { title: 'Vai trò', dataIndex: 'role', key: 'role' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <span className={text === 'Active' ? 'text-success' : 'text-danger'}>
          {text}
        </span>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="default" onClick={() => handleViewUser(record)}>
            Xem
          </Button>
          <Button type="primary" onClick={() => handleEditUser(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa người dùng này?"
            onConfirm={() => handleDeleteUser(record.id)}
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
      <h2 className="text-center mb-4">Quản lý người dùng</h2>
      <div className="mb-3 text-end">
        <Button type="primary" onClick={handleAddUser}>
          Thêm người dùng
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: users.length,
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
        title={editingUser ? 'Sửa người dùng' : 'Thêm người dùng'}
        visible={isEditModalVisible}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="Tên người dùng"
            rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="joinedDate"
            label="Ngày tham gia"
            rules={[{ required: true, message: 'Vui lòng nhập ngày tham gia!' }]}
          >
            <Input disabled={!!editingUser} />
          </Form.Item>
          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      {/* Modal xem chi tiết */}
      <Modal
        title="Thông tin chi tiết người dùng"
        visible={isViewModalVisible}
        onOk={() => setIsViewModalVisible(false)}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsViewModalVisible(false)}>
            Đóng
          </Button>,
        ]}
      >
        {viewingUser && (
          <div>
            <p><strong>ID:</strong> {viewingUser.id}</p>
            <p><strong>Tên người dùng:</strong> {viewingUser.username}</p>
            <p><strong>Vai trò:</strong> {viewingUser.role}</p>
            <p>
              <strong>Trạng thái:</strong>
              <span className={viewingUser.status === 'Active' ? 'text-success' : 'text-danger'}>
                {viewingUser.status}
              </span>
            </p>
            <p><strong>Email:</strong> {viewingUser.email}</p>
            <p><strong>Ngày tham gia:</strong> {viewingUser.joinedDate}</p>
            <p><strong>Địa chỉ:</strong> {viewingUser.address}</p>
          </div>
        )}
      </Modal>
    </Container>
  );
};

export default UsersManagement;