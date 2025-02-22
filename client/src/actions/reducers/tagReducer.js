import actionTypes from "../actions/actionTypes";

const initialState = {
  loading: false,
  tags: {}, // Đổi thành object để lưu theo groupId
  error: null,
};

const tagReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.POST_TAG_SUCCESS:
      //console.log('Updating members for groupId:', action.payload.groupId, action.payload.members);
      // Lưu members theo groupId
      return {
        ...state,
        loading: false,
        tags: {
          ...state.tags,
          [action.payload.postId]: action.payload.tags, // Lưu theo groupId
        },
      };
    case actionTypes.TAG_SUCCESS:
      return {
        ...state,
        loading: false,
        tags: action.payload,
      };
    case actionTypes.POST_TAG_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case actionTypes.TAG_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default tagReducer;