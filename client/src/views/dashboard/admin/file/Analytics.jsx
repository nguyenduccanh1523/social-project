import React, { useState } from 'react';
import { Table } from 'antd';
import { Container } from 'react-bootstrap';

const Analytics = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Dữ liệu giả lập danh sách quốc gia có số người dùng nhiều nhất
  const usersByCountry = [
    { id: 1, country: 'Vietnam', users: 5000, percentage: '15%' },
    { id: 2, country: 'United States', users: 4500, percentage: '13.5%' },
    { id: 3, country: 'India', users: 4000, percentage: '12%' },
    { id: 4, country: 'Brazil', users: 3500, percentage: '10.5%' },
    { id: 5, country: 'Indonesia', users: 3000, percentage: '9%' },
    { id: 6, country: 'Mexico', users: 2500, percentage: '7.5%' },
    { id: 7, country: 'Philippines', users: 2000, percentage: '6%' },
    { id: 8, country: 'Russia', users: 1800, percentage: '5.4%' },
  ];

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Quốc gia', dataIndex: 'country', key: 'country' },
    { title: 'Số người dùng', dataIndex: 'users', key: 'users' },
    { title: 'Tỷ lệ (%)', dataIndex: 'percentage', key: 'percentage' },
  ];

  return (
    <Container className="py-4 bg-light min-vh-100">
      <h2 className="text-center mb-4">Phân tích - Quốc gia có người dùng nhiều nhất</h2>
      <Table
        columns={columns}
        dataSource={usersByCountry}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: usersByCountry.length,
          onChange: (page) => setCurrentPage(page),
          onShowSizeChange: (_, size) => setPageSize(size),
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20'],
        }}
        bordered
        className="shadow-sm"
      />
    </Container>
  );
};

export default Analytics;