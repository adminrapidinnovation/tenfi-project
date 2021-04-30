import {
  AUTH_START,
  AUTH_SUCCESS,
  AUTH_FAIL,
  LOGOUT,
  IS_LOGGED_IN,
} from "./action.config";

export const authStart = () => {
  return {
    type: AUTH_START,
  };
};

export const authSuccess = (authData) => {
  return {
    type: AUTH_SUCCESS,
    data: authData,
  };
};

export const authFail = (errorData) => {
  return {
    type: AUTH_FAIL,
    data: errorData,
  };
};

export const logout = () => {
  return {
    type: LOGOUT,
  };
};

export const isLoggedIn = (userInfo, isLoggedIn) => {
  return {
    type: IS_LOGGED_IN,
    data: { userInfo, isLoggedIn },
  };
};
