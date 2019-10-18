import * as actions from '../actions/user.actions';

const initialState = {
  error: null,
  loading: null,
  domain: null,
  userData: {
    domain: null,
    token: null,
    username: null,
    displayName: null,
    email: null,
    locale: null,
  },
};

export default function userReducer(state = initialState, action) {
  const newState = {
    ...state,
    error: null,
  };
  switch (action.type) {
    case actions.USER_LOGIN_START:
      return {
        ...newState,
        loading: true,
      };
    case actions.USER_LOGIN_SUCCESS:
      return {
        ...newState,
        userData: {
          domain: action.domain,
          token: action.user.token,
          username: action.user.user_nicename,
          displayName: action.user.user_display_name,
          email: action.user.user_email,
          locale: null,
        },
        loading: false,
      };
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
        },
      };
    case actions.USER_LOGOUT:
      return {
        ...newState,
        userData: {
          ...newState.userData,
          token: null,
        },
      };
    default:
      return newState;
  }
}
