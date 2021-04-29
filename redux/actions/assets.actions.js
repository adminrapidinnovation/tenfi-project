import { FILTER_ASSETS_LIST, SET_ASSETS } from "./action.config";

export const setAssets = (assets) => {
  return {
    type: SET_ASSETS,
    data: assets,
  };
};

export const filterAssets = (token) => {
  return {
    type: FILTER_ASSETS_LIST,
    data: token,
  };
};
