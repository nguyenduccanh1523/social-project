import actionTypes from "../actions/actionTypes";

const initialState = {
  loading: false,
  messages: {}, // Đổi thành object để lưu theo groupId
  error: null,
};

const messageReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.MESSAGE_SUCCESS:
      //console.log('Updating members for groupId:', action.payload.groupId, action.payload.members);
      // Lưu members theo groupId
      return {
        ...state,
        loading: false,
        messages: {
          ...state.messages,
          [action.payload.conversationId]: action.payload.messages, // Lưu theo groupId
        },
      };
    case actionTypes.MESSAGE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default messageReducer;