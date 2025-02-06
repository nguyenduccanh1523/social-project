import actionTypes from "../actions/actionTypes";

const initialState = {
  loading: false,
  groups: null,
  members: {}, // Đổi thành object để lưu theo groupId
  error: null,
};

const groupReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GROUP_SUCCESS:
      return {
        ...state,
        loading: false,
        groups: action.payload,
      };
    case actionTypes.GROUP_MEMBERS_SUCCESS:
      // Lưu members theo groupId
      return {
        ...state,
        loading: false,
        members: {
          ...state.members,
          [action.payload.groupId]: action.payload.members, // Lưu theo groupId
        },
      };
    case actionTypes.GROUP_MEMBERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case actionTypes.GROUP_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default groupReducer;