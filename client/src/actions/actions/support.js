import actionTypes from "./actionTypes";

import { apiGetSupport } from "../../services/support";


export const fetchSupport= () => async (dispatch) => {
  try {
    const response = await apiGetSupport();
    dispatch({ type: actionTypes.SUPPORT_SUCCESS , payload: response.data });
  } catch (error) {
    dispatch({
      type: actionTypes.SUPPORT_FAILURE,
      payload: error.response?.data?.message || "Failed to fetch support",
    });
  }
};