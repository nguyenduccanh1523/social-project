import actionTypes from "./actionTypes";
import { apiGetUser, apiGetUserSocial } from "../../services/user";

export const fetchUserProfile = () => async (dispatch) => {
    dispatch({ type: actionTypes.PROFILE_REQUEST });

  try {
    const response = await apiGetUser();
    dispatch({ type: actionTypes.PROFILE_SUCCESS , payload: response.data });
  } catch (error) {
    dispatch({
      type: actionTypes.PROFILE_FAILURE,
      payload: error.response?.data?.message || "Failed to fetch profile",
    });
  }
};

export const fetchUserSocials = (documentId) => async (dispatch) => {
  dispatch({ type: actionTypes.USER_SOCIAL_REQUEST });

  try {
    const response = await apiGetUserSocial({ documentId });
    dispatch({
      type: actionTypes.USER_SOCIAL_SUCCESS,
      payload: response.data, // Lưu dữ liệu trả về
    });
  } catch (error) {
    dispatch({
      type: actionTypes.USER_SOCIAL_FAILURE,
      payload: error.response?.data?.message || "Failed to fetch user socials",
    });
  }
};