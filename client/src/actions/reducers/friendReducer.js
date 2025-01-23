import actionTypes from "../actions/actionTypes";

const initialState = {
  acceptedFriends: [],
  recentFriends: [],
  pendingFriends: [],
  sentFriends: [],
  loading: false,
  error: null,
};

const friendReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FRIEND_SENT_REQUEST:
    case actionTypes.FRIEND_PENDING_REQUEST:
    case actionTypes.FRIEND_ACCEPTED_REQUEST:
    case actionTypes.FRIEND_BY_DATE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case actionTypes.FRIEND_ACCEPTED_SUCCESS:
      return {
        ...state,
        loading: false,
        acceptedFriends: action.payload, // Dữ liệu từ FRIEND_ACCEPTED
      };
    case actionTypes.FRIEND_PENDING_SUCCESS:
      return {
        ...state,
        loading: false,
        pendingFriends: action.payload,
      };
    case actionTypes.FRIEND_SENT_SUCCESS:
      return {
        ...state,
        loading: false,
        sentFriends: action.payload,
      };
    case actionTypes.FRIEND_BY_DATE_SUCCESS:
      return {
        ...state,
        loading: false,
        recentFriends: action.payload, // Dữ liệu từ FRIEND_BY_DATE
      };
    // Cập nhật trong reducer sau khi xử lý confirm/reject
    case actionTypes.CONFIRM_FRIEND_SUCCESS:
      return {
        ...state,
        pendingFriends: state?.pendingFriends?.filter(
          (friend) => friend?.documentId !== action.payload
        ),
        acceptedFriends: [...state?.acceptedFriends, action?.updatedFriend], // Thêm bạn đã accepted vào danh sách
      };

    case actionTypes.REJECTED_FRIEND_SUCCESS:
      return {
        ...state,
        pendingFriends: state?.pendingFriends?.filter(
          (friend) => friend?.documentId !== action.payload
        ),
      };

    case actionTypes.FRIEND_ACCEPTED_FAILURE:
    case actionTypes.FRIEND_BY_DATE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default friendReducer;
