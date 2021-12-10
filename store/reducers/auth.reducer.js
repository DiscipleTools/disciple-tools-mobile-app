import * as actions from 'store/actions/auth.actions';
import { REHYDRATE } from 'redux-persist/lib/constants';

const initialState = {
  isAutoLogin: null,
  rememberLoginDetails: null,
  hasPIN: null,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case REHYDRATE:
      return {
        ...state
      };
    case actions.AUTH_TOGGLE_AUTO_LOGIN:
      return {
        ...state,
        isAutoLogin: !state.isAutoLogin,
      };
    case actions.AUTH_TOGGLE_REMEMBER_LOGIN_DETAILS:
      return {
        ...state,
        rememberLoginDetails: !state.rememberLoginDetails,
      };
    case actions.AUTH_TOGGLE_HAS_PIN:
      return {
        ...state,
        hasPIN: action?.hasPIN,
      };
    default:
      return state;
  };
};