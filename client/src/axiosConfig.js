import axios from "axios";
import { refreshToken } from "./actions/actions/auth";
import reduxStore from "./redux";

// Để tránh lỗi circular dependency
let store;
setTimeout(() => {
  const reduxStoreObj = reduxStore();
  store = reduxStoreObj.store;
}, 0);

// Tạo một instance axios với cấu hình cơ bản
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8989/api/v1/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Interceptor cho requests
instance.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage và thêm vào header
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log thông tin request để debug
    // console.log('Request:', {
    //   url: config.url,
    //   method: config.method,
    //   data: config.data
    // });
    
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor cho responses
instance.interceptors.response.use(
  (response) => {
    // console.log('Response OK:', response.data);
    return response;
  },
  async (error) => {
    console.error('Response Error:', error);
    
    // Log chi tiết lỗi
    if (error.response) {
      console.log('Error Data:', error.response.data);
      console.log('Error Status:', error.response.status);
    } else if (error.request) {
      console.log('No response received:', error.request);
    } else {
      console.log('Error:', error.message);
    }
    
    const originalRequest = error.config;
    
    // Xử lý refresh token khi gặp lỗi 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshTokenValue = localStorage.getItem("refreshToken");
        
        if (refreshTokenValue && store) {
          const success = await store.dispatch(refreshToken(refreshTokenValue));
          
          if (success) {
            const newToken = localStorage.getItem("token");
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return instance(originalRequest);
          }
        }
        
        // Nếu không có refreshToken hoặc refresh thất bại
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        sessionStorage.removeItem("isNewLogin"); // Xóa cờ đăng nhập mới
        
        // Chỉ chuyển hướng nếu người dùng đang ở trang cần xác thực
        if (!window.location.pathname.includes('/sign-in') && 
            !window.location.pathname.includes('/sign-up')) {
          window.location.href = "/sign-in";
        }
        
      } catch (err) {
        console.error('Error refreshing token:', err);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        sessionStorage.removeItem("isNewLogin"); // Xóa cờ đăng nhập mới
        
        // Chỉ chuyển hướng nếu người dùng đang ở trang cần xác thực
        if (!window.location.pathname.includes('/sign-in') && 
            !window.location.pathname.includes('/sign-up')) {
          window.location.href = "/sign-in";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
