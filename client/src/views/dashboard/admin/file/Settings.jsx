import React from 'react';
import { Container, Form } from 'react-bootstrap';

const Settings = () => {
  return (
    <Container>
      <h2>Cài đặt</h2>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Mô tả trang</Form.Label>
          <Form.Control as="textarea" rows={3} />
        </Form.Group>
      </Form>
    </Container>
  );
};

export default Settings;