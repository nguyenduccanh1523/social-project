import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';

const AdsManagement = () => {
  return (
    <Container>
      <h2>Quảng cáo</h2>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Tiêu đề chiến dịch</Form.Label>
          <Form.Control type="text" placeholder="Nhập tiêu đề" />
        </Form.Group>
        <Button variant="primary">Tạo chiến dịch</Button>
      </Form>
    </Container>
  );
};

export default AdsManagement;