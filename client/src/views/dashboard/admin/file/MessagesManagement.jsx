import React, { useState } from 'react';
import { Container, Row, Col, ListGroup, Card, Form, Button } from 'react-bootstrap';

const MessagesManagement = () => {
  // Danh sách user và tin nhắn giả lập
  const allMessages = {
    user1: [
      { id: 1, from: 'user1', content: 'Xin chào admin!', time: '2025-06-17 10:00' },
      { id: 2, from: 'admin', content: 'Chào bạn, tôi có thể giúp gì?', time: '2025-06-17 10:01' },
    ],
    user2: [
      { id: 3, from: 'user2', content: 'Cần hỗ trợ!', time: '2025-06-17 09:30' },
    ],
  };

  const [selectedUser, setSelectedUser] = useState(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(allMessages);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now(),
      from: 'admin',
      content: input,
      time: new Date().toLocaleString(),
    };

    setMessages(prev => ({
      ...prev,
      [selectedUser]: [...(prev[selectedUser] || []), newMessage],
    }));

    setInput('');
  };

  const users = Object.keys(messages);

  return (
    <Container className="mt-4">
      <h3 className="mb-4">Quản lý tin nhắn</h3>
      <Row>
        {/* Sidebar: Danh sách user */}
        <Col md={4}>
          <Card>
            <Card.Header>Người dùng</Card.Header>
            <ListGroup variant="flush">
              {users.map(user => (
                <ListGroup.Item
                  key={user}
                  action
                  active={user === selectedUser}
                  onClick={() => setSelectedUser(user)}
                >
                  {user}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>

        {/* Chat box */}
        <Col md={8}>
          {selectedUser ? (
            <Card>
              <Card.Header>Đoạn chat với <strong>{selectedUser}</strong></Card.Header>
              <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {messages[selectedUser]?.map(msg => (
                  <div key={msg.id} className={`mb-2 ${msg.from === 'admin' ? 'text-end' : 'text-start'}`}>
                    <div className={`p-2 rounded ${msg.from === 'admin' ? 'bg-primary text-white' : 'bg-light'}`}>
                      <small><strong>{msg.from}</strong>: {msg.content}</small><br />
                      <small className="text-muted">{msg.time}</small>
                    </div>
                  </div>
                ))}
              </Card.Body>
              <Card.Footer>
                <Form className="d-flex">
                  <Form.Control
                    type="text"
                    placeholder="Nhập tin nhắn..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <Button variant="primary" onClick={handleSend} className="ms-2">Gửi</Button>
                </Form>
              </Card.Footer>
            </Card>
          ) : (
            <Card>
              <Card.Body className="text-center text-muted">
                Chọn người dùng để xem tin nhắn
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default MessagesManagement;
