import actionTypes from "../actions/actionTypes";

const initialState = {
  loading: false,
  support: {}, // Đổi thành object để lưu theo groupId
  error: null,
};

const supportReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SUPPORT_SUCCESS:
      return {
        ...state,
        loading: false,
        support: action.payload,
      };
    case actionTypes.SUPPORT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default supportReducer;