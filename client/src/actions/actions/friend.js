import actionTypes from "./actionTypes";
import {
  apiGetFriendAccepted,
  apiGetFriendsByDate,
  apiGetFriendRequest,
  apiGetFriendSent,
  apiUpdateFriendStatus,
} from "../../services/friend";

export const fetchFriendAccepted = (documentId) => async (dispatch) => {
  dispatch({ type: actionTypes.FRIEND_ACCEPTED_REQUEST });

  try {
    const response = await apiGetFriendAccepted({ documentId });
    const friends = response.data.data;

    // Tạo mảng Promise để lấy `friendCount` của từng bạn bè
    const updatedFriends = await Promise.all(
      friends.map(async (friend) => {
        const friendData =
          friend.user_id.documentId === documentId
            ? friend.friend_id
            : friend.user_id;

        // Lấy danh sách bạn bè của friendData
        const friendResponse = await apiGetFriendAccepted({
          documentId: friendData.documentId,
        });
        const friendCount = friendResponse.data.data.length; // Đếm số lượng bạn bè của friendData

        // Gắn số lượng bạn bè vào friendData
        return {
          ...friend,
          friendCount,
        };
      })
    );

    dispatch({
      type: actionTypes.FRIEND_ACCEPTED_SUCCESS,
      payload: updatedFriends,
    });
  } catch (error) {
    dispatch({
      type: actionTypes.FRIEND_ACCEPTED_FAILURE,
      payload:
        error.response?.data?.message || "Failed to fetch friend accepted",
    });
  }
};

export const confirmFriend = (friendId) => async (dispatch) => {
  try {
    const response = await apiUpdateFriendStatus({
      friendId,
      status_type: "accepted",
    });
    dispatch({
      type: actionTypes.CONFIRM_FRIEND_SUCCESS,
      payload: friendId,
      updatedFriend: response?.data?.data, // Thêm dữ liệu bạn bè đã accepted
    });

  } catch (error) {
    dispatch({
      type: actionTypes.CONFIRM_FRIEND_FAILURE,
      payload: error.response?.data?.message || "Failed to accept friend request",
    });
  }
};

export const deleteFriend = (friendId) => async (dispatch) => {
  try {
    await apiUpdateFriendStatus({
      friendId,
      status_type: "cancel",
    });

    dispatch({
      type: actionTypes.REJECTED_FRIEND_SUCCESS,
      payload: friendId,
    });

  } catch (error) {
    dispatch({
      type: actionTypes.REJECTED_FRIEND_FAILURE,
      payload: error.response?.data?.message || "Failed to reject friend request",
    });

  }
};

export const fetchFriendRequest = (documentId) => async (dispatch) => {
  dispatch({ type: actionTypes.FRIEND_PENDING_REQUEST });

  try {
    const response = await apiGetFriendRequest({ documentId });
    const friends = response.data.data;

    // Tạo mảng Promise để lấy `friendCount` của từng bạn bè
    const updatedFriends = await Promise.all(
      friends.map(async (friend) => {
        const friendData =
          friend.user_id.documentId === documentId
            ? friend.friend_id
            : friend.user_id;

        // Lấy danh sách bạn bè của friendData
        const friendResponse = await apiGetFriendAccepted({
          documentId: friendData.documentId,
        });
        const friendCount = friendResponse.data.data.length; // Đếm số lượng bạn bè của friendData

        // Gắn số lượng bạn bè vào friendData
        return {
          ...friend,
          friendCount,
        };
      })
    );

    dispatch({
      type: actionTypes.FRIEND_PENDING_SUCCESS,
      payload: updatedFriends,
    });
  } catch (error) {
    dispatch({
      type: actionTypes.FRIEND_PENDING_FAILURE,
      payload:
        error.response?.data?.message || "Failed to fetch friend accepted",
    });
  }
};

export const fetchFriendSent = (documentId) => async (dispatch) => {
  dispatch({ type: actionTypes.FRIEND_SENT_REQUEST });

  try {
    const response = await apiGetFriendSent({ documentId });
    const friends = response.data.data;

    // Tạo mảng Promise để lấy `friendCount` của từng bạn bè
    const updatedFriends = await Promise.all(
      friends.map(async (friend) => {
        const friendData =
          friend.user_id.documentId === documentId
            ? friend.friend_id
            : friend.user_id;

        // Lấy danh sách bạn bè của friendData
        const friendResponse = await apiGetFriendAccepted({
          documentId: friendData.documentId,
        });
        const friendCount = friendResponse.data.data.length; // Đếm số lượng bạn bè của friendData

        // Gắn số lượng bạn bè vào friendData
        return {
          ...friend,
          friendCount,
        };
      })
    );

    dispatch({
      type: actionTypes.FRIEND_SENT_SUCCESS,
      payload: updatedFriends,
    });
  } catch (error) {
    dispatch({
      type: actionTypes.FRIEND_SENT_FAILURE,
      payload:
        error.response?.data?.message || "Failed to fetch friend accepted",
    });
  }
};

export const fetchFriendsByDate =
  (documentId, daysAgo = 7) =>
  async (dispatch) => {
    dispatch({ type: actionTypes.FRIEND_BY_DATE_REQUEST });

    try {
      const response = await apiGetFriendsByDate(documentId, daysAgo);
      const friends = response.data.data;

      // Tạo mảng Promise để lấy `friendCount` của từng bạn bè
      const updatedFriends = await Promise.all(
        friends.map(async (friend) => {
          const friendData =
            friend.user_id.documentId === documentId
              ? friend.friend_id
              : friend.user_id;

          // Lấy danh sách bạn bè của friendData
          const friendResponse = await apiGetFriendsByDate(
            friendData.documentId,
            daysAgo
          );
          const friendCount = friendResponse.data.data.length; // Đếm số lượng bạn bè của friendData

          return {
            ...friend,
            friendCount,
          };
        })
      );

      dispatch({
        type: actionTypes.FRIEND_BY_DATE_SUCCESS,
        payload: updatedFriends,
      });
    } catch (error) {
      dispatch({
        type: actionTypes.FRIEND_BY_DATE_FAILURE,
        payload:
          error.response?.data?.message || "Failed to fetch friends by date",
      });
    }
  };
