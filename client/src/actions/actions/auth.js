import actionTypes from "./actionTypes";
import { apiRegister, apiLogin, apiLogout, apiRefreshToken } from "../../services/auth";

export const register = (payload) => async (dispatch) => {
  try {
    dispatch({
      type: actionTypes.LOGIN_REQUEST,
    });
    const response = await apiRegister(payload);
    console.log("Register response:", response.data);
    
    if (response?.data?.success && response?.data?.jwt) {
      const token = response.data.jwt;
      const refreshToken = response.data.refresh_token;
      const user = response.data.user;

      // Lưu token vào localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      
      dispatch({
        type: actionTypes.REGISTER_SUCCESS,
        data: {
          token,
          user
        },
      });
    } else {
      dispatch({
        type: actionTypes.REGISTER_FAIL,
        data: response.data?.message || "Đăng ký thất bại",
      });
    }
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    const errorMessage =
      error.response?.data?.message || 
      error.message ||
      "Đã có lỗi xảy ra khi đăng ký";
    dispatch({
      type: actionTypes.REGISTER_FAIL,
      data: errorMessage,
    });
  }
};

export const login = (payload) => async (dispatch) => {
  try {
    dispatch({
      type: actionTypes.LOGIN_REQUEST,
    });
    const response = await apiLogin(payload);
    console.log("Login response:", response.data);
    
    if (response?.data?.success && response?.data?.jwt) {
      const token = response.data.jwt;
      const refreshToken = response.data.refresh_token;
      const user = response.data.user;

      // Lưu token vào localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      // Ghi lại thời gian đăng nhập để có thể kiểm tra token
      localStorage.setItem("tokenTimestamp", Date.now().toString());
      // Đánh dấu đây là phiên đăng nhập mới
      sessionStorage.setItem("isNewLogin", "true");
      
      dispatch({
        type: actionTypes.LOGIN_SUCCESS,
        data: {
          token,
          user
        },
      });
    } else {
      dispatch({
        type: actionTypes.LOGIN_FAIL,
        data: response.data?.message || "Đăng nhập thất bại",
      });
    }
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    const errorMessage =
      error.response?.data?.message || 
      error.message ||
      "Đã có lỗi xảy ra khi đăng nhập";
    dispatch({
      type: actionTypes.LOGIN_FAIL,
      data: errorMessage,
    });
  }
};

export const refreshToken = (refreshTokenValue) => async (dispatch) => {
  try {
    console.log("Bắt đầu refresh token");
    if (!refreshTokenValue) {
      console.error("Không có refresh token");
      return false;
    }
    
    const response = await apiRefreshToken(refreshTokenValue);
    
    if (response?.data?.success && response?.data?.jwt) {
      const newToken = response.data.jwt;
      const newRefreshToken = response.data.refresh_token;

      console.log("Refresh token thành công, cập nhật token mới");
      localStorage.setItem("token", newToken);
      localStorage.setItem("tokenTimestamp", Date.now().toString());
      
      if (newRefreshToken) {
        localStorage.setItem("refreshToken", newRefreshToken);
      }
      
      return true;
    }
    console.error("Refresh token thất bại: không có token mới");
    return false;
  } catch (error) {
    console.error("Lỗi refresh token:", error);
    // Ghi log đầy đủ thông tin lỗi
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    return false;
  }
};

export const logout = () => async (dispatch) => {
  try {
    await apiLogout();
  } catch (error) {
    console.error("Lỗi khi đăng xuất:", error);
  } finally {
    // Xóa token và refreshToken khỏi localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("tokenTimestamp");
    localStorage.removeItem("toastShown");

    // Gửi action để cập nhật state (đăng xuất)
    dispatch({
      type: actionTypes.LOGOUT,
    });
  }
};

// Thêm action xóa thông báo
export const clearMessage = () => ({
  type: actionTypes.CLEAR_MESSAGE
});