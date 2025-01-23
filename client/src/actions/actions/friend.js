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

// Action xác nhận bạn bè
export const confirmFriend = (friendId) => async (dispatch) => {
  try {
    const response = await apiUpdateFriendStatus(friendId, "accepted"); // Gửi API để cập nhật trạng thái
    dispatch({
      type: actionTypes.UPDATE_FRIEND_STATUS_SUCCESS,
      payload: response.data, // Dữ liệu trả về từ API
    });
  } catch (error) {
    dispatch({
      type: actionTypes.UPDATE_FRIEND_STATUS_FAILURE,
      payload: error.response?.data?.message || "Failed to confirm friend",
    });
  }
};

// Action xóa bạn bè
export const deleteFriend = (friendId) => async (dispatch) => {
  try {
    const response = await apiUpdateFriendStatus(friendId, "cancel"); // Gửi API để xóa bạn bè
    dispatch({
      type: actionTypes.UPDATE_FRIEND_STATUS_SUCCESS,
      payload: response.data, // Dữ liệu trả về từ API
    });
  } catch (error) {
    dispatch({
      type: actionTypes.UPDATE_FRIEND_STATUS_FAILURE,
      payload: error.response?.data?.message || "Failed to delete friend",
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
