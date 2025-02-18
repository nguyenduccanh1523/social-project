import actionTypes from "./actionTypes";
import { apiRegister, apiLogin } from "../../services/auth";

export const register = (payload) => async (dispatch) => {
  try {
    const response = await apiRegister(payload);
    if (response?.data.err === 0) {
      dispatch({
        type: actionTypes.REGISTER_SUCCESS,
        data: response.data.token,
      });
    } else {
      dispatch({
        type: actionTypes.REGISTER_FAIL,
        data: response.data.msg,
      });
    }
  } catch (error) {
    dispatch({
      type: actionTypes.REGISTER_FAIL,
      data: null,
    });
  }
};
export const login = (payload) => async (dispatch) => {
  try {
    dispatch({
      type: actionTypes.LOGIN_REQUEST,
    });
    const response = await apiLogin(payload);
    //console.log('response: ', response)
    if (response?.data?.jwt) {
      const token = response.data.jwt;

      // Lưu token vào localStorage
      localStorage.setItem("token", token);
      
      dispatch({
        type: actionTypes.LOGIN_SUCCESS,
        data: response?.data?.jwt,
      });
    } else {
      dispatch({
        type: actionTypes.LOGIN_FAIL,
        data: response.data.error.message,
      });
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.error?.message ||
      error.message ||
      "An unknown error occurred";
    //console.log('errorMessage: ', errorMessage)
    dispatch({
      type: actionTypes.LOGIN_FAIL,
      data: errorMessage,
    });
  }
};

export const logout = () => (dispatch) => {
  // Xóa token và refreshToken khỏi localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("toastShown");

  // Gửi action để cập nhật state (đăng xuất)
  dispatch({
    type: actionTypes.LOGOUT,
  });
};