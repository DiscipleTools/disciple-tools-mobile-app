/*
 * Action Types
 */
export const CONTACTS_GETALL = 'CONTACTS_GETALL';
export const CONTACTS_GETALL_START = 'CONTACTS_GETALL_START';
export const CONTACTS_GETALL_SUCCESS = 'CONTACTS_GETALL_SUCCESS';
export const CONTACTS_GETALL_RESPONSE = 'CONTACTS_GETALL_RESPONSE';
export const CONTACTS_GETALL_FAILURE = 'CONTACTS_GETALL_FAILURE';

export const CONTACTS_SAVE = 'CONTACTS_SAVE';
export const CONTACTS_SAVE_START = 'CONTACTS_SAVE_START';
export const CONTACTS_SAVE_SUCCESS = 'CONTACTS_SAVE_SUCCESS';
export const CONTACTS_SAVE_RESPONSE = 'CONTACTS_SAVE_RESPONSE';
export const CONTACTS_SAVE_FAILURE = 'CONTACTS_SAVE_FAILURE';

export const CONTACTS_GETBYID = 'CONTACTS_GETBYID';
export const CONTACTS_GETBYID_START = 'CONTACTS_GETBYID_START';
export const CONTACTS_GETBYID_SUCCESS = 'CONTACTS_GETBYID_SUCCESS';
export const CONTACTS_GETBYID_RESPONSE = 'CONTACTS_GETBYID_RESPONSE';
export const CONTACTS_GETBYID_FAILURE = 'CONTACTS_GETBYID_FAILURE';

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

export function save(domain, token, contact) {
  return {
    type: CONTACTS_SAVE,
    domain,
    token,
    contact,
  };
}
