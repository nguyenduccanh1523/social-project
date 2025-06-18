import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';

const EventsManagement = () => {
  return (
    <Container>
      <h2>Sự kiện</h2>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Tên sự kiện</Form.Label>
          <Form.Control type="text" placeholder="Nhập tên sự kiện" />
        </Form.Group>
        <Button variant="primary">Tạo sự kiện</Button>
      </Form>
    </Container>
  );
};

export default EventsManagement;