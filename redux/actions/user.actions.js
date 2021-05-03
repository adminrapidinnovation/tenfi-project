import {
  CONNECT_WALLET,
  DISCONNECT_WALLET,
  POOL_DATA_LOADING,
  UPDATE_POOL_DATA,
} from "./action.config";

export const connectWallet = (data) => {
  return {
    type: CONNECT_WALLET,
    payload: data,
  };
};

export const disconnectWallet = () => {
  return {
    type: DISCONNECT_WALLET,
  };
};

export const setPoolDataLoading = (loadingStatus) => {
  return {
    type: POOL_DATA_LOADING,
    payload: loadingStatus,
  };
};

export const updatePoolData = (data) => {
  return {
    type: UPDATE_POOL_DATA,
    payload: data,
  };
};
