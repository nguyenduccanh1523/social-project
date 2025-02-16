import actionTypes from "../actions/actionTypes";

const initialState = {
  loading: false,
  conversations: {}, // Đổi thành object để lưu theo groupId
  error: null,
};

const converReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CONVERSATION_SUCCESS:
      //console.log('Updating members for groupId:', action.payload.groupId, action.payload.members);
      // Lưu members theo groupId
      return {
        ...state,
        loading: false,
        conversations: {
          ...state.conversations,
          [action.payload.userId]: action.payload.conversations, // Lưu theo groupId
        },
      };
    case actionTypes.CONVERSATION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default converReducer;