import actionTypes from "./actionTypes";

import { apiGetConversation } from "../../services/conversation";


export const fetchConversation = (userId) => async (dispatch) => {
    
    try {
      const response = await apiGetConversation({ userId });
      //console.log('Fetched members for group:', postId, response.data);
      dispatch({ 
        type: actionTypes.CONVERSATION_SUCCESS, 
        payload: { userId, conversations: response.data } 
      });
    } catch (error) {
      dispatch({
        type: actionTypes.CONVERSATION_FAILURE,
        payload: error.response?.data?.message || "Failed to fetch group members",
      });
    }
};