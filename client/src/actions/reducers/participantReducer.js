import actionTypes from "../actions/actionTypes";

const initialState = {
  loading: false,
  participants: {}, // Đổi thành object để lưu theo groupId
  error: null,
};

const participantReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.PARICIPANT_SUCCESS:
      //console.log('Updating members for groupId:', action.payload.groupId, action.payload.members);
      // Lưu members theo groupId
      return {
        ...state,
        loading: false,
        participants: {
          ...state.participants,
          [action.payload.userId]: action.payload.participants, // Lưu theo groupId
        },
      };
    case actionTypes.PARICIPANT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default participantReducer;