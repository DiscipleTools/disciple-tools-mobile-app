import * as actions from '../actions/user.actions';
import { REHYDRATE } from 'redux-persist/lib/constants';

const userDataInitialState = {
  domain: null,
  token: null,
  username: null,
  password: null,
  displayName: null,
  email: null,
  locale: null,
  id: null,
  expoPushToken: null,
};
const initialState = {
  error: null,
  loading: null,
  domain: null,
  userData: {
    ...userDataInitialState,
  },
  rememberPassword: true,
  pinCode: {
    enabled: false,
    value: null,
  },
};

export default function userReducer(state = initialState, action) {
  const newState = {
    ...state,
    error: null,
  };
  switch (action.type) {
    case REHYDRATE: {
      return {
        ...newState,
        loading: false,
      };
    }
    case actions.USER_LOGIN_START:
      return {
        ...newState,
        loading: true,
      };
    case actions.USER_LOGIN_SUCCESS: {
      let state = { ...newState };
      if (newState.userData.username !== action.user.username) {
        state = {
          ...state,
          pinCode: {
            enabled: false,
            value: null,
          },
        };
      }
      state = {
        ...state,
        userData: {
          domain: action.domain,
          token: action.user.token,
          username: action.user.username,
          password: action.user.password,
          displayName: action.user.user_display_name,
          email: action.user.user_email,
          locale: null,
          id: null,
        },
      };
      return state;
    }
    case actions.USER_LOGIN_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
      };
    case actions.GET_MY_USER_INFO_SUCCESS:
      return {
        ...newState,
        userData: {
          ...newState.userData,
          locale: action.userInfo.locale,
          id: action.userInfo.ID,
        },
      };
    case actions.GET_MY_USER_INFO_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
      };
    case actions.USER_GET_PUSH_TOKEN:
      return {
        ...newState,
        userData: {
          ...newState.userData,
        },
      };
    case actions.USER_ADD_PUSH_TOKEN:
      return {
        ...newState,
        userData: {
          ...newState.userData,
          expoPushToken: action.expoPushToken,
        },
      };
    case actions.USER_LOGOUT:
      return {
        ...newState,
        userData: {
          ...newState.userData,
          token: null,
          password: null,
        },
        pinCode: {
          enabled: false,
          value: null,
        },
        rememberPassword: false,
        loading: false,
      };
    case actions.REMEMBER_PASSWORD:
      return {
        ...newState,
        rememberPassword: !newState.rememberPassword,
      };
    case actions.SAVE_PIN_CODE:
      return {
        ...newState,
        pinCode: {
          enabled: true,
          value: action.value,
        },
      };
    case actions.REMOVE_PIN_CODE:
      return {
        ...newState,
        pinCode: {
          enabled: false,
          value: null,
        },
      };
    case actions.UPDATE_USER_INFO_SUCCESS: {
      return {
        ...newState,
        userData: {
          ...newState.userData,
          locale: action.locale,
        },
      };
    }
    case actions.UPDATE_USER_INFO_FAILURE:
      return {
        ...newState,
        error: action.error,
      };
    default:
      return newState;
  }
}
