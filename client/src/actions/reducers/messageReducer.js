import actionTypes from "../actions/actionTypes";

const initialState = {
  loading: false,
  messages: {}, // Đổi thành object để lưu theo groupId
  error: null,
  hasNextPage: {},
  pageParam: {},

};

const messageReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.MESSAGE_SUCCESS:
      const { conversationId, messages, pageParam, hasNextPage } = action.payload;

      const newMessages = state.messages[conversationId] || [];
      console.log("Existing messages:", newMessages);

      // Kiểm tra và lọc các tin nhắn không trùng lặp
      const uniqueMessages = [
        ...newMessages,
        ...messages.filter((msg) => {
          const isDuplicate = newMessages.some((existingMsg) => existingMsg.documentId === msg.documentId);
          if (!isDuplicate) {
            console.log(`New message added: ${msg.documentId}`);
          }
          return !isDuplicate;
        }),
      ];

      // Log số lượng tin nhắn sau khi gộp
      console.log("Total messages after merging:", uniqueMessages.length);

      return {
        ...state,
        loading: false,
        messages: {
          ...state.messages,
          [conversationId]: uniqueMessages,
        },
        pageParam: {
          ...state.pageParam,
          [conversationId]: pageParam,
        },
        hasNextPage: {
          ...state.hasNextPage,
          [conversationId]: hasNextPage,
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