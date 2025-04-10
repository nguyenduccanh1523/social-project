import actionTypes from "../actions/actionTypes";

const initState = {
  isLoggedIn: false, // Mặc định là false
  token: null,
  user: null,
  msg: "",
  update: false,
  loading: false,
};

// Khôi phục token từ localStorage nếu có
const storedToken = localStorage.getItem("token");
if (storedToken) {
  initState.isLoggedIn = true;
  initState.token = storedToken;
}

const authReducer = (state = initState, action) => {
  //console.log('action: ', action.type)
  switch (action.type) {
    case actionTypes.LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        msg: "", // Reset msg khi bắt đầu request
      };
    case actionTypes.REGISTER_SUCCESS:
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        token: action.data.token,
        user: action.data.user,
        msg: "Đăng nhập thành công", // Cập nhật thông báo thành công
        loading: false,
      };
    case actionTypes.REGISTER_FAIL:
    case actionTypes.LOGIN_FAIL:
      return {
        ...state,
        isLoggedIn: false,
        msg: action.data,
        token: null,
        user: null,
        update: !state.update,
        loading: false,
      };
    case actionTypes.LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        token: null,
        user: null,
        msg: "",
      };
    case actionTypes.CLEAR_MESSAGE:
      return {
        ...state,
        msg: "",
      };
    default:
      return state;
  }
};

export default authReducer;
