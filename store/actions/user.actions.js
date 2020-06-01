/*
 * Action Types
 */
export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGIN_START = 'USER_LOGIN_START';
export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
export const USER_LOGIN_RESPONSE = 'USER_LOGIN_RESPONSE';
export const USER_LOGIN_FAILURE = 'USER_LOGIN_FAILURE';
export const USER_LOGOUT = 'USER_LOGOUT';

export const USER_GET_PUSH_TOKEN = 'USER_GET_PUSH_TOKEN';

export const USER_ADD_PUSH_TOKEN = 'USER_ADD_PUSH_TOKEN';
export const USER_ADD_PUSH_TOKEN_RESPONSE = 'USER_ADD_PUSH_TOKEN_RESPONSE';
export const USER_ADD_PUSH_TOKEN_SUCCESS = 'USER_ADD_PUSH_TOKEN_SUCCESS';
export const USER_ADD_PUSH_TOKEN_FAILURE = 'USER_ADD_PUSH_TOKEN_FAILURE';

export const GET_MY_USER_INFO = 'GET_MY_USER_INFO';
export const GET_MY_USER_INFO_START = 'GET_MY_USER_INFO_START';
export const GET_MY_USER_INFO_RESPONSE = 'GET_MY_USER_INFO_RESPONSE';
export const GET_MY_USER_INFO_SUCCESS = 'GET_MY_USER_INFO_SUCCESS';
export const GET_MY_USER_INFO_FAILURE = 'GET_MY_USER_INFO_FAILURE';

export const REMEMBER_PASSWORD = 'REMEMBER_PASSWORD';

export const SAVE_PIN_CODE = 'SAVE_PIN_CODE';
export const REMOVE_PIN_CODE = 'REMOVE_PIN_CODE';

export const UPDATE_USER_INFO = 'UPDATE_USER_INFO';
export const UPDATE_USER_INFO_RESPONSE = 'UPDATE_USER_INFO_RESPONSE';
export const UPDATE_USER_INFO_SUCCESS = 'UPDATE_USER_INFO_SUCCESS';
export const UPDATE_USER_INFO_FAILURE = 'UPDATE_USER_INFO_FAILURE';

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

export function getPushToken(domain, token) {
  return {
    type: USER_GET_PUSH_TOKEN,
    domain,
    token,
  };
}

export function getUserInfo(domain, token) {
  return {
    type: GET_MY_USER_INFO,
    domain,
    token,
  };
}

export function logout() {
  return { type: USER_LOGOUT };
}

export function toggleRememberPassword() {
  return { type: REMEMBER_PASSWORD };
}

export function savePINCode(value) {
  return { type: SAVE_PIN_CODE, value };
}

export function removePINCode() {
  return { type: REMOVE_PIN_CODE };
}

export function updateUserInfo(domain, token, userInfo) {
  return { type: UPDATE_USER_INFO, domain, token, userInfo };
}
