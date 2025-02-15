import actionTypes from "./actionTypes";

import { apiGetPostMedia } from "../../services/media";


export const fetchPostMedia = (postId) => async (dispatch) => {
    
    try {
      const response = await apiGetPostMedia({ postId });
      //console.log('Fetched members for group:', postId, response.data);
      dispatch({ 
        type: actionTypes.POST_MEDIA_SUCCESS, 
        payload: { postId, medias: response.data } 
      });
    } catch (error) {
      dispatch({
        type: actionTypes.POST_MEDIA_FAILURE,
        payload: error.response?.data?.message || "Failed to fetch group members",
      });
    }
};