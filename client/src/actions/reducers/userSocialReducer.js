import actionTypes from "../actions/actionTypes";

const initialState = {
    socials: null,
    loading: false,
    error: null,
  };
  
  const userSocialsReducer = (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.USER_SOCIAL_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
      case actionTypes.USER_SOCIAL_SUCCESS:
        return {
          ...state,
          loading: false,
          socials: action.payload,
        };
      case actionTypes.USER_SOCIAL_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default userSocialsReducer;