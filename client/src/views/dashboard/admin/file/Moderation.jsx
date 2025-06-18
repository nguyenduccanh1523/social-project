import React from 'react';
import { Container, ListGroup } from 'react-bootstrap';

const Moderation = () => {
  // Logic kiểm duyệt (giả lập)
  const reports = [
    { id: 1, content: 'Bài viết vi phạm', reportedBy: 'user1', time: '2025-06-17 11:00' },
  ];

  return (
    <Container>
      <h2>Kiểm duyệt</h2>
      <ListGroup>
        {reports.map(report => (
          <ListGroup.Item key={report.id}>
            {report.content} <br />
            <small>Báo cáo bởi: {report.reportedBy}, {report.time}</small>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default Moderation;