import actionTypes from "./actionTypes";

import { apiGetPostTag } from "../../services/tag";


export const fetchPostTag = (postId) => async (dispatch) => {
    
    try {
      const response = await apiGetPostTag({ postId });
      //console.log('Fetched members for group:', postId, response.data);
      dispatch({ 
        type: actionTypes.POST_TAG_SUCCESS, 
        payload: { postId, tags: response.data } 
      });
    } catch (error) {
      dispatch({
        type: actionTypes.POST_TAG_FAILURE,
        payload: error.response?.data?.message || "Failed to fetch group members",
      });
    }
};