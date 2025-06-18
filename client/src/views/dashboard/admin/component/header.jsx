import React from 'react';
import { Navbar, Container, Button, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../../actions/actions';
import logo from '../../../../assets/images/logo-full.png';
import './header.css';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.root.auth || {});

  const handleLogout = () => {
    dispatch(actions.logout());
    navigate('/sign-in');
  };

  return (
    <Navbar className="admin-header shadow-sm" bg="white" expand="lg" sticky="top">
      <Container fluid className="px-4 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <Image src={logo} alt="Logo" width={36} height={36} className="me-2" />
          <span className="fw-bold fs-5 text-primary">Admin Dashboard</span>
        </div>
        <div className="d-flex align-items-center gap-3">
          <span className="fw-semibold text-dark">Xin chào, {user?.username}</span>
          <Button variant="outline-danger" size="sm" onClick={handleLogout}>
            Đăng xuất
          </Button>
        </div>
      </Container>
    </Navbar>
  );
};

export default Header;
