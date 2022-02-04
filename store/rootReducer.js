import { combineReducers } from "redux";

import authReducer from "./reducers/auth.reducer";
import i18nReducer from "./reducers/i18n.reducer";
import networkReducer from "./reducers/network.reducer";
import requestReducer from "./reducers/request.reducer";
import userReducer from "./reducers/user.reducer";

import * as actions from "./rootActions";

//const combinedReducers = combineReducers({
const rootReducer = combineReducers({
  authReducer,
  i18nReducer,
  networkReducer,
  requestReducer,
  userReducer,
});

// Handling CLEAR_REDUX_DATA in each individual reducer reducer is better bc we can reset to initialState rather than completely undefined
/* 
const rootReducer = (state, action) => {
  switch (action.type) {
    //case REHYDRATE:
    //  return state;
    // Clear all data in redux store (reset to initial)
    case actions.CLEAR_REDUX_DATA:
      return state = undefined;
    default:
      return combinedReducers(state, action);
  };
};
*/
export default rootReducer;
