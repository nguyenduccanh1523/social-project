import actionTypes from "../actions/actionTypes";

const initialState = {
  loading: false,
  medias: {}, // Đổi thành object để lưu theo groupId
  error: null,
};

const mediaReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.POST_MEDIA_SUCCESS:
      //console.log('Updating members for groupId:', action.payload.groupId, action.payload.members);
      // Lưu members theo groupId
      return {
        ...state,
        loading: false,
        medias: {
          ...state.medias,
          [action.payload.postId]: action.payload.medias, // Lưu theo groupId
        },
      };
    case actionTypes.POST_MEDIA_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default mediaReducer;