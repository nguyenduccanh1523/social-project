import actionTypes from "./actionTypes";

import { apiGetMessage } from "../../services/message";


export const fetchMessage = (conversationId, pageParam = 1) => async (dispatch) => {
    
    try {
      const response = await apiGetMessage({ conversationId, pageParam });
      //console.log('Fetched members for group:', postId, response.data);
      dispatch({ 
        type: actionTypes.MESSAGE_SUCCESS, 
        payload: {
          conversationId,
          messages: response.data,
          pageParam: response.pageParam,
          hasNextPage: response.hasNextPage,
        },
      });
    } catch (error) {
      dispatch({
        type: actionTypes.MESSAGE_FAILURE,
        payload: error.response?.data?.message || "Failed to fetch group members",
      });
    }
};