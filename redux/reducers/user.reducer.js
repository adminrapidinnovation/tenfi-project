import {
  AUTH_START,
  AUTH_SUCCESS,
  AUTH_FAIL,
  LOGOUT,
  IS_LOGGED_IN,
} from "../actions/action.config";

const initialState = {
  isLoggedIn: false,
  authLoading: false,
  isLoaded: false,
  userInfo: null,
};

export const userReducer = (state = initialState, action) => {
  const { type, data } = action;
  switch (type) {
    case AUTH_START:
      return {
        ...state,
        authLoading: true,
      };

    case AUTH_SUCCESS:
      return {
        ...state,
        authLoading: false,
        userInfo: data,
      };

    case IS_LOGGED_IN:
      return {
        ...state,
        isLoggedIn: data.isLoggedIn,
        userInfo: data.userInfo,
      };
    case AUTH_FAIL:
    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        authLoading: false,
        userInfo: null,
      };
    default:
      return state;
  }
};
