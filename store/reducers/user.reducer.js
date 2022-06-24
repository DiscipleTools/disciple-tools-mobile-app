import * as actions from "store/actions/user.actions";
import { REHYDRATE } from "redux-persist/lib/constants";

const userDataInitialState = {
  username: null,
  displayName: null,
  locale: null,
  id: null,
  expoPushToken: null,
  theme: null,
};
const initialState = {
  error: null,
  loading: null,
  domain: null,
  filters: null,
  userData: {
    ...userDataInitialState,
  },
};

export default function userReducer(state = initialState, action) {
  const newState = {
    ...state,
    error: null,
  };
  switch (action.type) {
    case REHYDRATE:
      console.log("*** REHYDRATE! ***");
      return {
        ...newState,
        loading: false,
      };
    case actions.SET_FILTER:
      return {
        ...newState,
        userData: {
          ...newState?.userData,
        },
        filters: {
          ...newState?.filters,
          [action?.key]: action?.filter,
        },
      };
    case actions.SET_THEME:
      return {
        ...newState,
        userData: {
          ...newState?.userData,
        },
        theme: action?.theme,
      };
    case actions.SET_PIN_SUCCESS:
      return {
        ...newState,
        hasPIN: true,
      };
    case actions.DELETE_PIN_SUCCESS:
      return {
        ...newState,
        hasPIN: false,
      };
    case actions.SET_CNONCE_LOGIN:
      return {
        ...newState,
        cnonceLogin: action?.cnonceLogin,
      };
    case actions.GENERATE_PIN_CNONCE_SUCCESS:
      return {
        ...newState,
        cnoncePIN: action?.cnoncePIN,
      };
    case actions.GENERATE_PIN_CNONCE_FAILURE:
      return {
        ...newState,
        cnoncePIN: null,
        error: action?.error,
      };
    case actions.USER_LOGIN_START:
      return {
        ...newState,
        loading: true,
      };
    case actions.USER_LOGIN_SUCCESS:
      return {
        ...newState,
        loading: false,
        userData: {
          ...newState?.userData,
          displayName: action?.user?.user_display_name,
          locale: action?.user?.locale,
          id: null,
        },
        cnonceLogin: action?.cnonceLogin,
      };
    case actions.USER_LOGIN_FAILURE:
      return {
        ...newState,
        error: action?.error,
        loading: false,
        cnonceLogin: null,
      };
    case actions.GET_MY_USER_INFO_SUCCESS:
      return {
        ...newState,
        userData: {
          ...newState?.userData,
          locale: action?.userInfo?.locale,
          id: action?.userInfo?.ID,
        },
      };
    case actions.GET_MY_USER_INFO_FAILURE:
      return {
        ...newState,
        error: action?.error,
        loading: false,
      };
    //case actions.USER_GET_PUSH_TOKEN:
    case actions.USER_ADD_PUSH_TOKEN:
      return {
        ...newState,
        userData: {
          ...newState?.userData,
          expoPushToken: action?.expoPushToken,
        },
      };
    case actions.USER_LOGOUT_SUCCESS:
      return {
        ...initialState,
        hasPIN: state?.hasPIN, // TODO: explain
        isSignout: action?.isSignout,
      };
    case actions.TOGGLE_AUTO_LOGIN:
      return {
        ...newState,
        isAutoLogin: !newState?.isAutoLogin,
      };
    case actions.TOGGLE_REMEMBER_LOGIN_DETAILS_SUCCESS:
      return {
        ...newState,
        userData: {
          ...newState?.userData,
          ...action?.userData,
        },
        rememberLoginDetails: action?.rememberLoginDetails,
      };
    case actions.TOGGLE_REMEMBER_LOGIN_DETAILS_FAILURE:
      return {
        ...newState,
        error: action?.error,
      };
    case actions.UPDATE_USER_INFO_SUCCESS:
      return {
        ...newState,
        userData: {
          ...newState?.userData,
          locale: action?.locale,
        },
      };
    case actions.UPDATE_USER_INFO_FAILURE:
    case actions.SET_PIN_FAILURE:
    case actions.DELETE_PIN_FAILURE:
    case actions.USER_LOGOUT_FAILURE:
      return {
        ...newState,
        error: action?.error,
      };
    default:
      return newState;
  }
}
