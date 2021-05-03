import {
  CONNECT_WALLET,
  DISCONNECT_WALLET,
  POOL_DATA_LOADING,
  UPDATE_POOL_DATA,
} from "../actions/action.config";

const initialState = {
  isLoggedIn: false,
  address: null,
  poolDataLoading: false,
  poolData: [],
};

export const userReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case CONNECT_WALLET:
      return {
        ...state,
        isLoggedIn: true,
        address: payload,
      };
    case DISCONNECT_WALLET:
      return {
        ...state,
        isLoggedIn: false,
        address: null,
      };
    case POOL_DATA_LOADING:
      return {
        ...state,
        poolDataLoading: payload,
      };
    case UPDATE_POOL_DATA:
      return {
        ...state,
        poolData: payload,
      };

    default:
      return state;
  }
};
