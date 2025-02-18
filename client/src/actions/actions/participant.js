import actionTypes from "./actionTypes";

import { apiGetParticipantByUser } from "../../services/participant";


export const fetchParticipantByUser = (userId) => async (dispatch) => {
    
  try {
    const response = await apiGetParticipantByUser({ userId });
    //console.log('Fetched members for group:', postId, response.data);
    dispatch({ 
      type: actionTypes.PARICIPANT_SUCCESS, 
      payload: { userId, participants: response.data } 
    });
  } catch (error) {
    dispatch({
      type: actionTypes.PARICIPANT_FAILURE,
      payload: error.response?.data?.message || "Failed to fetch group members",
    });
  }
};