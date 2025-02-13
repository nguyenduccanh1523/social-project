import actionTypes from "./actionTypes";

import { apiGetPost, apiGetPostComments, apiGetPostLikes, apiGetPostShares, apiGetPostViews, apiGetGroupPost } from "../../services/post";

export const fetchGroupPost = (groupId) => async (dispatch) => {
    try {
      const response = await apiGetGroupPost({ groupId });
      //console.log('Fetched members for group:', groupId, response.data);
      dispatch({ 
        type: actionTypes.GROUP_POST_SUCCESS, 
        payload: { groupId, posts: response.data } 
      });
    } catch (error) {
      dispatch({
        type: actionTypes.GROUP_POST_FAILURE,
        payload: error.response?.data?.message || "Failed to fetch group posts",
      });
    }
};