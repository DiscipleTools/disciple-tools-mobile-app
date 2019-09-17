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
export const CONTACTS_SAVE_END = 'CONTACTS_SAVE_END';

export const CONTACTS_GETBYID = 'CONTACTS_GETBYID';
export const CONTACTS_GETBYID_START = 'CONTACTS_GETBYID_START';
export const CONTACTS_GETBYID_SUCCESS = 'CONTACTS_GETBYID_SUCCESS';
export const CONTACTS_GETBYID_RESPONSE = 'CONTACTS_GETBYID_RESPONSE';
export const CONTACTS_GETBYID_FAILURE = 'CONTACTS_GETBYID_FAILURE';
export const CONTACTS_GETBYID_END = 'CONTACTS_GETBYID_END';

export const CONTACTS_GET_COMMENTS = 'CONTACTS_GET_COMMENTS';
export const CONTACTS_GET_COMMENTS_START = 'CONTACTS_GET_COMMENTS_START';
export const CONTACTS_GET_COMMENTS_SUCCESS = 'CONTACTS_GET_COMMENTS_SUCCESS';
export const CONTACTS_GET_COMMENTS_RESPONSE = 'CONTACTS_GET_COMMENTS_RESPONSE';
export const CONTACTS_GET_COMMENTS_FAILURE = 'CONTACTS_GET_COMMENTS_FAILURE';

export const CONTACTS_SAVE_COMMENT = 'CONTACTS_SAVE_COMMENT';
export const CONTACTS_SAVE_COMMENT_START = 'CONTACTS_SAVE_COMMENT_START';
export const CONTACTS_SAVE_COMMENT_SUCCESS = 'CONTACTS_SAVE_COMMENT_SUCCESS';
export const CONTACTS_SAVE_COMMENT_RESPONSE = 'CONTACTS_SAVE_COMMENT_RESPONSE';
export const CONTACTS_SAVE_COMMENT_FAILURE = 'CONTACTS_SAVE_COMMENT_FAILURE';

export const CONTACTS_GET_ACTIVITIES = 'CONTACTS_GET_ACTIVITIES';
export const CONTACTS_GET_ACTIVITIES_START = 'CONTACTS_GET_ACTIVITIES_START';
export const CONTACTS_GET_ACTIVITIES_SUCCESS = 'CONTACTS_GET_ACTIVITIES_SUCCESS';
export const CONTACTS_GET_ACTIVITIES_RESPONSE = 'CONTACTS_GET_ACTIVITIES_RESPONSE';
export const CONTACTS_GET_ACTIVITIES_FAILURE = 'CONTACTS_GET_ACTIVITIES_FAILURE';


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

export function save(domain, token, contactData) {
  return {
    type: CONTACTS_SAVE,
    domain,
    token,
    contactData,
  };
}

export function saveEnd() {
  return {
    type: CONTACTS_SAVE_END,
  };
}

export function getById(domain, token, contactId) {
  return {
    type: CONTACTS_GETBYID,
    domain,
    token,
    contactId,
  };
}

export function getByIdEnd() {
  return {
    type: CONTACTS_GETBYID_END,
  };
}

export function getCommentsByContact(domain, token, contactId, offset, limit) {
  return {
    type: CONTACTS_GET_COMMENTS,
    domain,
    token,
    contactId,
    offset,
    limit,
  };
}

export function saveComment(domain, token, contactId, commentData) {
  return {
    type: CONTACTS_SAVE_COMMENT,
    domain,
    token,
    contactId,
    commentData,
  };
}

export function getActivitiesByContact(domain, token, contactId, offset, limit) {
  return {
    type: CONTACTS_GET_ACTIVITIES,
    domain,
    token,
    contactId,
    offset,
    limit,
  };
}
