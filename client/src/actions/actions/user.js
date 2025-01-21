import actionTypes from "./actionTypes";
import { apiGetUser } from "../../services/user";

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