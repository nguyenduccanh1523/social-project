import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Header from './component/header';
import Sidebar from './component/sidebar';
import './style.css';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <Header />
      <div className="admin-content">
        <Container fluid>
          <Row>
            <Col md={3} lg={2} className="sidebar-wrapper">
              <Sidebar />
            </Col>
            <Col md={9} lg={10} className="content-wrapper">
              <div className="content">
                <Outlet />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default AdminLayout; 