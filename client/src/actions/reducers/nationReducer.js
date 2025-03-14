import actionTypes from "../actions/actionTypes";

const initialState = {
  loading: false,
  nations: {}, // Đổi thành object để lưu theo groupId
  error: null,
};

const nationReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.NATION_SUCCESS:
      //console.log("Reducer NATION_SUCCESS with payload:", action.payload);
      return {
        ...state,
        loading: false,
        nations: action.payload,
      };
    case actionTypes.NATION_FAILURE:
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

export default nationReducer;