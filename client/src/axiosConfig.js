import axios from "axios";
import reduxStore from "./redux";

// Biến để kiểm soát quá trình refresh token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Tạo một instance axios với cấu hình cơ bản
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8989/api/v1/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Lấy store một cách an toàn
const getStore = () => {
  return reduxStore().store;
};

// Interceptor cho requests
instance.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage và thêm vào header
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
    return response;
  },
  async (error) => {
    console.error('Response Error:', error);
    
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
      // Kiểm tra xem đường dẫn hiện tại có phải là refresh token không
      if (originalRequest.url.includes('auth/refresh')) {
        // Nếu request refresh token thất bại, đăng xuất người dùng
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        sessionStorage.removeItem("isNewLogin");
        
        if (!window.location.pathname.includes('/sign-in') && 
            !window.location.pathname.includes('/sign-up')) {
          window.location.href = "/sign-in";
        }
        return Promise.reject(error);
      }
      
      // Đánh dấu request này đã được retry
      originalRequest._retry = true;
      
      if (!isRefreshing) {
        isRefreshing = true;
        
        const refreshTokenValue = localStorage.getItem("refreshToken");
        
        if (!refreshTokenValue) {
          isRefreshing = false;
          localStorage.removeItem("token");
          
          if (!window.location.pathname.includes('/sign-in') && 
              !window.location.pathname.includes('/sign-up')) {
            window.location.href = "/sign-in";
          }
          
          return Promise.reject(error);
        }
        
        try {
          const store = getStore();
          const refreshAction = (await import('./actions/actions/auth')).refreshToken;
          
          const success = await store.dispatch(refreshAction(refreshTokenValue));
          
          if (success) {
            const newToken = localStorage.getItem("token");
            isRefreshing = false;
            processQueue(null, newToken);
            
            // Cập nhật token cho request ban đầu
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return instance(originalRequest);
          } else {
            isRefreshing = false;
            processQueue(new Error('Failed to refresh token'));
            
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            sessionStorage.removeItem("isNewLogin");
            
            if (!window.location.pathname.includes('/sign-in') && 
                !window.location.pathname.includes('/sign-up')) {
              window.location.href = "/sign-in";
            }
            
            return Promise.reject(error);
          }
        } catch (err) {
          isRefreshing = false;
          processQueue(err);
          
          console.error('Error refreshing token:', err);
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          sessionStorage.removeItem("isNewLogin");
          
          if (!window.location.pathname.includes('/sign-in') && 
              !window.location.pathname.includes('/sign-up')) {
            window.location.href = "/sign-in";
          }
          
          return Promise.reject(err);
        }
      } else {
        // Nếu đang refresh token, đưa request vào hàng đợi
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return instance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
