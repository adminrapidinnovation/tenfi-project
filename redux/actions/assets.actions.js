import { FILTER_ASSETS_LIST, SET_ASSETS } from "./action.config";

export const setAssets = (assetsArray) => {
  return {
    type: SET_ASSETS,
    data: assetsArray,
  };
};

export const filterAssets = (token) => {
  return {
    type: FILTER_ASSETS_LIST,
    data: token,
  };
};
