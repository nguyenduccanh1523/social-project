import React from 'react';
import { Container, ListGroup } from 'react-bootstrap';

const Notifications = () => {
  // Logic thông báo (giả lập)
  const notifications = [
    { id: 1, message: 'Bài đăng mới từ user1', time: '2025-06-17 10:30' },
  ];

  return (
    <Container>
      <h2>Thông báo</h2>
      <ListGroup>
        {notifications.map(notification => (
          <ListGroup.Item key={notification.id}>
            {notification.message} <br />
            <small>{notification.time}</small>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default Notifications;