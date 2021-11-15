/**
 * Action Types
 */
export const GET_USERS = 'GET_USERS';
export const GET_USERS_START = 'GET_USERS_START';
export const GET_USERS_SUCCESS = 'GET_USERS_SUCCESS';
export const GET_USERS_RESPONSE = 'GET_USERS_RESPONSE';
export const GET_USERS_FAILURE = 'GET_USERS_FAILURE';

export const GET_CONTACT_FILTERS = 'GET_CONTACT_FILTERS';
export const GET_CONTACT_FILTERS_START = 'GET_CONTACT_FILTERS_START';
export const GET_CONTACT_FILTERS_SUCCESS = 'GET_CONTACT_FILTERS_SUCCESS';
export const GET_CONTACT_FILTERS_RESPONSE = 'GET_CONTACT_FILTERS_RESPONSE';
export const GET_CONTACT_FILTERS_FAILURE = 'GET_CONTACT_FILTERS_FAILURE';

export const GET_GROUP_FILTERS = 'GET_GROUP_FILTERS';
export const GET_GROUP_FILTERS_START = 'GET_GROUP_FILTERS_START';
export const GET_GROUP_FILTERS_SUCCESS = 'GET_GROUP_FILTERS_SUCCESS';
export const GET_GROUP_FILTERS_RESPONSE = 'GET_GROUP_FILTERS_RESPONSE';
export const GET_GROUP_FILTERS_FAILURE = 'GET_GROUP_FILTERS_FAILURE';

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

export function getContactFilters(domain, token) {
  return {
    type: GET_CONTACT_FILTERS,
    domain,
    token,
  };
}

export function getGroupFilters(domain, token) {
  return {
    type: GET_GROUP_FILTERS,
    domain,
    token,
  };
}
