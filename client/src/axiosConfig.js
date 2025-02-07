import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    // Attach token from localStorage
    const token = localStorage.getItem("token");
    //console.log("Bearer Token: ", token); // Debug token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken) {
          const refreshResponse = await axios.post(
            `${process.env.REACT_APP_API_URL}/auth/refresh`,
            { refreshToken }
          );

          const newToken = refreshResponse.data.token;

          // Save the new token in localStorage
          localStorage.setItem("token", newToken);

          // Update the Authorization header
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          // Retry the original request
          return instance(originalRequest);
        }
      } catch (err) {
        // Handle refresh token errors
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/sign-in"; // Redirect to login
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
