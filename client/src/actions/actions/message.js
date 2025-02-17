import actionTypes from "./actionTypes";

import { apiGetMessage } from "../../services/message";


export const fetchMessage = (conversationId) => async (dispatch) => {
    
    try {
      const response = await apiGetMessage({ conversationId });
      //console.log('Fetched members for group:', postId, response.data);
      dispatch({ 
        type: actionTypes.MESSAGE_SUCCESS, 
        payload: { conversationId, messages: response.data } 
      });
    } catch (error) {
      dispatch({
        type: actionTypes.MESSAGE_FAILURE,
        payload: error.response?.data?.message || "Failed to fetch group members",
      });
    }
};