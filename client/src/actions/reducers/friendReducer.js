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
    case actionTypes.UPDATE_FRIEND_STATUS_SUCCESS:
      // Cập nhật lại trạng thái bạn bè khi nhấn Confirm hoặc Delete
      return {
        ...state,
        loading: false,
        acceptedFriends: state.pendingFriends.filter(
          (friend) => friend.id !== action.payload.id
        ),
        pendingFriends: state.pendingFriends.filter(
          (friend) => friend.id !== action.payload.id
        ),
      };
    case actionTypes.UPDATE_FRIEND_STATUS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
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
