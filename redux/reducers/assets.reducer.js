import assets from "data/assets";
import { FILTER_ASSETS_LIST, SET_ASSETS } from "redux/actions/action.config";

const initialState = {
  assets: assets,
};

export const assetsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ASSETS:
      return {
        ...state,
        assets: action.data,
      };

    case FILTER_ASSETS_LIST:
      const value = action.data;

      if (value === "") return { ...state, assets: assets };

      let filteredAssets = assets.filter((item) =>
        item.title.toLowerCase().includes(value.toLowerCase())
      );
      return {
        ...state,
        assets: filteredAssets,
      };

    default:
      return state;
  }
};
