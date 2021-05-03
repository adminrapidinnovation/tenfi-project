import { createStore } from "redux";
import rootReducer from "./reducers";

export default (preloadState) => {
  return createStore(rootReducer, preloadState);
};
