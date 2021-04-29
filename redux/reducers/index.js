import { userReducer } from "./user.reducer";
import { assetsReducer } from "./assets.reducer";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  user: userReducer,
  assets: assetsReducer,
});
export default rootReducer;
