import { createStore, compose } from "redux";

import rootReducer from "../redux/reducers";

export default (preloadState, options) => {
  return createStore(rootReducer, preloadState);
};
