import actionTypes from "../actions/actionTypes";

const initialState = {
  loading: false,
  status: {}, // Đổi thành object để lưu theo groupId
  error: null,
};

const statusReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.STATUS_ACTIVITY_SUCCESS:
      return {
        ...state,
        loading: false,
        status: action.payload,
      };
    case actionTypes.STATUS_ACTIVITY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default statusReducer;