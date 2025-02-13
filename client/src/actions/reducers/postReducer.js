import actionTypes from "../actions/actionTypes";

const initialState = {
  loading: false,
  posts: {}, // Đổi thành object để lưu theo groupId
  error: null,
};

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GROUP_POST_SUCCESS:
      //console.log('Updating members for groupId:', action.payload.groupId, action.payload.posts);
      // Lưu members theo groupId
      return {
        ...state,
        loading: false,
        posts: {
          ...state.posts,
          [action.payload.groupId]: action.payload.posts, // Lưu theo groupId
        },
      };
    case actionTypes.GROUP_POST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    
    default:
      return state;
  }
};

export default postReducer;