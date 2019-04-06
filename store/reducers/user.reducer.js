import * as userActions from '../actions/user.actions';

const initialState = {
  baseUrl: null,
  name: null,
  displayName: null,
  email: null,
  token: null,
  error: null,
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case userActions.USER_LOGIN_START:
      return Object.assign({}, state, {
        isLoading: true,
        error: null,
      });
    case userActions.USER_LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isLoading: false,
        domain: action.domain,
        token: action.user.token,
        username: action.user.user_nicename,
        displayName: action.user.user_display_name,
        email: action.user.user_email,
      });
    case userActions.USER_LOGIN_FAILURE:
      return Object.assign({}, state, {
        isLoading: false,
        error: action.error,
      });
    case userActions.USER_LOGOUT:
      return Object.assign({}, state, {
        token: null,
      });
    default:
      return state;
  }
}
