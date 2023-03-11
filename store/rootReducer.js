import { combineReducers } from "redux";

import authReducer from "./reducers/auth.reducer";
import i18nReducer from "./reducers/i18n.reducer";
import networkReducer from "./reducers/network.reducer";
import requestReducer from "./reducers/request.reducer";
import userReducer from "./reducers/user.reducer";
import cacheReducer from "./reducers/cache.reducer";

const rootReducer = combineReducers({
  authReducer,
  i18nReducer,
  networkReducer,
  requestReducer,
  userReducer,
  cacheReducer,
});
export default rootReducer;
