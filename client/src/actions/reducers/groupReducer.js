import actionTypes from "../actions/actionTypes";

const initialState = {
  loading: false,
  groups: null,
  findgroup: {},
  mygroups: {},
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
    case actionTypes.GROUP_FIND_ONE_SUCCESS:
      return {
        ...state,
        loading: false,
        findgroup: {
          ...state.findgroup,
          [action.payload.groupId]: action.payload.group,
        },
      };
    case actionTypes.MY_GROUP_SUCCESS:
      return {
        ...state,
        loading: false,
        mygroups: {
          ...state.mygroups,
          [action.payload.userId]: action.payload.groups,
        },
      };
    case actionTypes.GROUP_MEMBERS_SUCCESS:
      //console.log('Updating members for groupId:', action.payload.groupId, action.payload.members);
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