
import { apiGetReport } from "../../services/report";
import actionTypes from "./actionTypes";

export const fetchReport = () => async (dispatch) => {
  try {
    const reports = await apiGetReport();
    //console.log("Dispatching NATION_SUCCESS with payload:", nations);
    dispatch({ type: actionTypes.REPORT_SUCCESS, payload: reports });
  } catch (error) {
    //console.error("Dispatching NATION_FAILURE with error:", error);
    dispatch({
      type: actionTypes.REPORT_FAILURE,
      payload: error.response?.data?.message || "Failed to fetch nations",
    });
  }
};