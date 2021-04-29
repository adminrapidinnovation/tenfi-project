import {
  AUTH_START,
  AUTH_SUCCESS,
  AUTH_FAIL,
  LOGOUT,
} from "../actions/action.config";

const initialState = {
  authLoading: false,
  isLoaded: false,
  userInfo: "",
};

export const userReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case AUTH_START:
      return {
        ...state,
        authLoading: true,
      };

    case AUTH_SUCCESS:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        loading: false,
        loggedIn: true,
        isLoaded: true,
        authLoading: false,
        userInfo: payload.userInfo,
      };
    case AUTH_FAIL:
    case LOGOUT:
      localStorage.removeItem("token");
      return {
        ...state,
        loading: false,
        loggedIn: false,
        isLoaded: true,
        authLoading: false,
      };
    default:
      return state;
  }
};
