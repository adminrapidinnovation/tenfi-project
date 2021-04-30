import { FILTER_ASSETS_LIST, SET_ASSETS } from "redux/actions/action.config";

const initialState = {
  assets: [],
  filteredAssets: [],
};

export const assetsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ASSETS:
      return {
        ...state,
        assets: action.data,
        filteredAssets: action.data,
      };

    case FILTER_ASSETS_LIST:
      const value = action.data;

      if (value === "") return { ...state, filteredAssets: state.assets };

      let filteredAssets = state.assets.filter((item) =>
        item.title.toLowerCase().includes(value.toLowerCase())
      );
      return {
        ...state,
        filteredAssets,
      };

    default:
      return state;
  }
};
