import { combineReducers } from "redux";

import networkConnectivityReducer from "./reducers/networkConnectivity.reducer";

const rootReducer = combineReducers({
  networkConnectivityReducer,
});
export default rootReducer;
