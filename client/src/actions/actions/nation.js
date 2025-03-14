import { apiGetNation } from "../../services/nation";
import actionTypes from "./actionTypes";

export const fetchNation = () => async (dispatch) => {
  try {
    const nations = await apiGetNation();
    //console.log("Dispatching NATION_SUCCESS with payload:", nations);
    dispatch({ type: actionTypes.NATION_SUCCESS, payload: nations });
  } catch (error) {
    //console.error("Dispatching NATION_FAILURE with error:", error);
    dispatch({
      type: actionTypes.NATION_FAILURE,
      payload: error.response?.data?.message || "Failed to fetch nations",
    });
  }
};