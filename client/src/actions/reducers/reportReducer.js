import actionTypes from "../actions/actionTypes";

const initialState = {
  loading: false,
  reports: {}, // Đổi thành object để lưu theo groupId
  error: null,
};

const reportReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.REPORT_SUCCESS:
      //console.log("Reducer NATION_SUCCESS with payload:", action.payload);
      return {
        ...state,
        loading: false,
        reports: action.payload,
      };
    case actionTypes.REPORT_FAILURE:
      //console.error("Reducer NATION_FAILURE with error:", action.payload);
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default reportReducer;