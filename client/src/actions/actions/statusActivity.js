import { apiGetStatus } from "../../services/statusActivity";
import actionTypes from "./actionTypes";


export const fetchStatus= () => async (dispatch) => {
    try {
      const response = await apiGetStatus();
      dispatch({ type: actionTypes.STATUS_ACTIVITY_SUCCESS , payload: response.data });
    } catch (error) {
      dispatch({
        type: actionTypes.STATUS_ACTIVITY_FAILURE,
        payload: error.response?.data?.message || "Failed to fetch profile",
      });
    }
  };
