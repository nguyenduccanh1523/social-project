import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
  
    const menuItems = [
      { path: '/admin/dashboard', icon: 'dashboard', title: 'Dashboard' },
      { path: '/admin/users', icon: 'people', title: 'Quản lý người dùng' },
      { path: '/admin/posts', icon: 'article', title: 'Quản lý bài viết' },
      { path: '/admin/messages', icon: 'chat', title: 'Quản lý tin nhắn' },
      { path: '/admin/analytics', icon: 'analytics', title: 'Phân tích' },
      { path: '/admin/ads', icon: 'campaign', title: 'Quảng cáo' },
      { path: '/admin/settings', icon: 'settings', title: 'Cài đặt' },
      { path: '/admin/events', icon: 'event', title: 'Sự kiện' },
      { path: '/admin/moderation', icon: 'shield', title: 'Kiểm duyệt' },
      { path: '/admin/notifications', icon: 'notifications', title: 'Thông báo' }
    ];
  
    return (
      <div className="sidebar bg-light p-3">
        <Nav className="flex-column">
          {menuItems.map((item, index) => (
            <Nav.Item key={index}>
              <Nav.Link
                as={Link}
                to={item.path}
                className={location.pathname === item.path ? 'active bg-primary text-white' : 'text-dark'}
              >
                <span className="material-symbols-outlined me-2">{item.icon}</span>
                {item.title}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      </div>
    );
  };
  
  export default Sidebar;