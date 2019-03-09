/*
 * Action Types
 */
export const CONTACTS_GETALL = 'CONTACTS_GETALL';
export const CONTACTS_GETALL_START = 'CONTACTS_GETALL_START';
export const CONTACTS_GETALL_SUCCESS = 'CONTACTS_GETALL_SUCCESS';
export const CONTACTS_GETALL_FAILURE = 'CONTACTS_GETALL_FAILURE';

/*
 * Action Creators
 */
export function getAll(domain, token) {
  return {
    type: CONTACTS_GETALL,
    domain,
    token,
  };
}
