import actionTypes from "../actions/actionTypes";

const initState = {
  isLoggedIn: !!localStorage.getItem("token"), // Kiểm tra token khi khởi tạo
  token: localStorage.getItem("token"),
  msg: "",
  update: false,
  loading: false,
};

const authReducer = (state = initState, action) => {
  //console.log('action: ', action.type)
  switch (action.type) {
    case actionTypes.LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.REGISTER_SUCCESS:
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        token: action.data,
        msg: "",
        loading: false,
      };
    case actionTypes.REGISTER_FAIL:
    case actionTypes.LOGIN_FAIL:
      return {
        ...state,
        isLoggedIn: false,
        msg: action.data,
        token: null,
        update: !state.update,
        loading: false,
      };
    case actionTypes.LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        token: null,
        msg: "",
      };
    default:
      return state;
  }
};

export default authReducer;
