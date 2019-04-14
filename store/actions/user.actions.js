/*
 * Action Types
 */
export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGIN_START = 'USER_LOGIN_START';
export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
export const USER_LOGIN_RESPONSE = 'USER_LOGIN_RESPONSE';
export const USER_LOGIN_FAILURE = 'USER_LOGIN_FAILURE';
export const USER_LOGOUT = 'USER_LOGOUT';
export const USER_CLEAR_ERROR = 'USER_CLEAR_ERROR';

/*
 * Action Creators
 */
export function login(domain, username, password) {
  return {
    type: USER_LOGIN,
    domain,
    username,
    password,
  };
}

export function logout() {
  return { type: USER_LOGOUT };
}

export function clearError() {
  return { type: USER_CLEAR_ERROR };
}
