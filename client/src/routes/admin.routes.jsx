import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Admin Components
import AdminLayout from '../views/dashboard/admin/layout';
import Dashboard from '../views/dashboard/admin/file/dasboard';
import UsersManagement from '../views/dashboard/admin/file/UsersManagement';
import PostsManagement from '../views/dashboard/admin/file/PostsManagement';
import MessagesManagement from '../views/dashboard/admin/file/MessagesManagement';
import Analytics from '../views/dashboard/admin/file/Analytics';
import AdsManagement from '../views/dashboard/admin/file/AdsManagement';
import Settings from '../views/dashboard/admin/file/Settings';
import EventsManagement from '../views/dashboard/admin/file/EventsManagement';
import Moderation from '../views/dashboard/admin/file/Moderation';
import Notifications from '../views/dashboard/admin/file/Notifications';

const AdminRoutes = () => {
  const { isLoggedIn, user } = useSelector((state) => state.root.auth || {});

  // Kiểm tra nếu chưa đăng nhập hoặc không phải admin
  if (!isLoggedIn || user?.role?.roleName !== 'admin') {
    return <Navigate to="/sign-in" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="posts" element={<PostsManagement />} />
        <Route path="messages" element={<MessagesManagement />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="ads" element={<AdsManagement />} />
        <Route path="settings" element={<Settings />} />
        <Route path="events" element={<EventsManagement />} />
        <Route path="moderation" element={<Moderation />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes; 