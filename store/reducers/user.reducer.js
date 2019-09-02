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
  },
};

export default function userReducer(state = initialState, action) {
  const newState = {
    ...state,
    error: null,
  };
  // console.log("action.type", action.type)
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
        },
        loading: false,
      };
    case actions.USER_LOGIN_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
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
