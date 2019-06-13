/**
 * Action Types
 */
export const GET_USERS = 'GET_USERS';
export const GET_USERS_START = 'GET_USERS_START';
export const GET_USERS_SUCCESS = 'GET_USERS_SUCCESS';
export const GET_USERS_RESPONSE = 'GET_USERS_RESPONSE';
export const GET_USERS_FAILURE = 'GET_USERS_FAILURE';

/**
 * Action Creators
 */
export function getUsers(domain, token) {
  return {
    type: GET_USERS,
    domain,
    token,
  };
}
