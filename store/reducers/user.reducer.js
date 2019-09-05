import * as actions from '../actions/user.actions';

const initialState = {
  baseUrl: null,
  name: null,
  displayName: null,
  email: null,
  token: null,
  error: null,
};

export default function userReducer(state = initialState, action) {
  const newState = {
    ...state,
    type: action.type,
    error: null,
  };
  switch (action.type) {
    case actions.USER_LOGIN_START:
      return {
        ...newState,
      };
    case actions.USER_LOGIN_SUCCESS:
      return {
        ...newState,
        domain: action.domain,
        token: action.user.token,
        username: action.user.user_nicename,
        displayName: action.user.user_display_name,
        email: action.user.user_email,
      };
    case actions.USER_LOGIN_FAILURE:
      return {
        ...newState,
        error: action.error,
      };
    case actions.USER_LOGOUT:
      return {
        ...newState,
        token: null,
      };
    default:
      return state;
  }
}
