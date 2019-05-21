/*
 * Action Types
 */
export const CONTACTS_GETALL = 'CONTACTS_GETALL';
export const CONTACTS_GETALL_START = 'CONTACTS_GETALL_START';
export const CONTACTS_GETALL_SUCCESS = 'CONTACTS_GETALL_SUCCESS';
export const CONTACTS_GETALL_RESPONSE = 'CONTACTS_GETALL_RESPONSE';
export const CONTACTS_GETALL_FAILURE = 'CONTACTS_GETALL_FAILURE';

export const CONTACTS_SAVECONTACT = 'CONTACTS_SAVECONTACT';
export const CONTACTS_SAVECONTACT_START = 'CONTACTS_SAVECONTACT_START';
export const CONTACTS_SAVECONTACT_SUCCESS = 'CONTACTS_SAVECONTACT_SUCCESS';
export const CONTACTS_SAVECONTACT_RESPONSE = 'CONTACTS_SAVECONTACT_RESPONSE';
export const CONTACTS_SAVECONTACT_FAILURE = 'CONTACTS_SAVECONTACT_FAILURE';

export const CONTACTS_DELETECONTACT = 'CONTACTS_DELETECONTACT';

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

export function saveContact(user, contact) {
  return {
    type: CONTACTS_SAVECONTACT,
    user,
    contact,
  };
}

export function deleteContact(user, contact) {
  return {
    type: CONTACTS_DELETECONTACT,
    user,
    contact,
  };
}
