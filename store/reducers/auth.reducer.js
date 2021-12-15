import * as actions from "store/actions/auth.actions";
import { REHYDRATE } from "redux-persist/lib/constants";

const initialState = {
  rehydrate: false,
  isAutoLogin: null,
  rememberLoginDetails: null,
  hasPIN: null,
  cnoncePIN: null,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case REHYDRATE:
      return {
        ...state,
        rehydrate: true 
      };
    case actions.AUTH_TOGGLE_AUTO_LOGIN:
      return {
        ...state,
        isAutoLogin: !state.isAutoLogin,
        rehydrate: false 
      };
    case actions.AUTH_TOGGLE_REMEMBER_LOGIN_DETAILS:
      return {
        ...state,
        rememberLoginDetails: !state.rememberLoginDetails,
        rehydrate: false 
      };
    case actions.AUTH_TOGGLE_HAS_PIN:
      return {
        ...state,
        hasPIN: !state.hasPIN,
        rehydrate: false 
      };
    case actions.AUTH_SET_HAS_PIN:
      return {
        ...state,
        hasPIN: action?.hasPIN,
        rehydrate: false 
      };
    case actions.AUTH_SET_CNONCE_PIN:
      return {
        ...state,
        cnoncePIN: action?.cnoncePIN,
        rehydrate: false 
      };
    default:
      return {
        ...state,
        rehydrate: false 
      };
  }
}
