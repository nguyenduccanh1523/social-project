import actionTypes from "./actionTypes";
import { apiGetGroup, apiGetGroupMembers, apiGetMyGroup, apiFindOneGroup } from "../../services/group";

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

export const fetchFindOneGroup = (groupId) => async (dispatch) => {
  try {
    const response = await apiFindOneGroup({ groupId });
    //console.log('Fetched members for group:', groupId, response.data);
    dispatch({ 
      type: actionTypes.GROUP_FIND_ONE_SUCCESS, 
      payload: { groupId, group: response.data }
    });
  } catch (error) {
    dispatch({
      type: actionTypes.GROUP_FIND_ONE_FAILURE,
      payload: error.response?.data?.message || "Failed to fetch group members",
    });
  }
};


export const fetchGroupMembers = (groupId) => async (dispatch) => {
    try {
      const response = await apiGetGroupMembers({ groupId });
      //console.log('Fetched members for group:', groupId, response.data);
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


export const fetchMyGroup = (userId) => async (dispatch) => {
  try {
    const response = await apiGetMyGroup({ userId });
    //console.log('Fetched members for userID:', userId, response.data);
    dispatch({ 
      type: actionTypes.MY_GROUP_SUCCESS, 
      payload: { userId, groups: response.data }
    });
  } catch (error) {
    dispatch({
      type: actionTypes.MY_GROUP_FAILURE,
      payload: error.response?.data?.message || "Failed to fetch group members",
    });
  }
};
