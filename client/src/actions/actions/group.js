import actionTypes from "./actionTypes";
import { apiGetGroup, apiGetGroupMembers, apiGetGroupPosts } from "../../services/group";

export const fetchGroup = () => async (dispatch) => {
  try {
    const response = await apiGetGroup();
    dispatch({ type: actionTypes.GROUP_SUCCESS , payload: response.data });
  } catch (error) {
    dispatch({
      type: actionTypes.GROUP_FAILURE,
      payload: error.response?.data?.message || "Failed to fetch profile",
    });
  }
};

export const fetchGroupMembers = (groupId) => async (dispatch) => {
    try {
      const response = await apiGetGroupMembers({ groupId });
      dispatch({ 
        type: actionTypes.GROUP_MEMBERS_SUCCESS, 
        payload: { groupId, members: response.data } 
      });
    } catch (error) {
      dispatch({
        type: actionTypes.GROUP_MEMBERS_FAILURE,
        payload: error.response?.data?.message || "Failed to fetch group members",
      });
    }
};
