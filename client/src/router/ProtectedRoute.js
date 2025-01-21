import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // Nếu không có token, chuyển hướng đến /sign-in
    return <Navigate to="/sign-in" replace />;
  }

  // Nếu có token, hiển thị các route được bảo vệ
  return children;
};

export default ProtectedRoute;
