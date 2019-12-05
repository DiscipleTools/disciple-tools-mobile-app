/*
 * Action Types
 */

export const NOTIFICATIONS_BY_USER = 'NOTIFICATIONS_BY_USER';
export const NOTIFICATIONS_BY_USER_START = 'NOTIFICATIONS_BY_USER_START';
export const NOTIFICATIONS_BY_USER_RESPONSE = 'NOTIFICATIONS_BY_USER_RESPONSE';
export const NOTIFICATIONS_BY_USER_SUCCESS = 'NOTIFICATIONS_BY_USER_SUCCESS';
export const NOTIFICATIONS_BY_USER_FAILURE = 'NOTIFICATIONS_BY_USER_FAILURE';

/*
 * Action Creators
 */
export function getAll(domain, token, offset, limit) {
  return {
    type: NOTIFICATIONS_BY_USER,
    domain,
    token,
    offset,
    limit,
  };
}
