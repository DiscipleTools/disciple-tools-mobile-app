/**
 * Action Types
 */
export const GROUPS_GETALL = 'GROUPS_GETALL';
export const GROUPS_GETALL_START = 'GROUPS_GETALL_START';
export const GROUPS_GETALL_SUCCESS = 'GROUPS_GETALL_SUCCESS';
export const GROUPS_GETALL_RESPONSE = 'GROUPS_GETALL_RESPONSE';
export const GROUPS_GETALL_FAILURE = 'GROUPS_GETALL_FAILURE';

export const GROUPS_SAVE = 'GROUPS_SAVE';
export const GROUPS_SAVE_START = 'GROUPS_SAVE_START';
export const GROUPS_SAVE_SUCCESS = 'GROUPS_SAVE_SUCCESS';
export const GROUPS_SAVE_RESPONSE = 'GROUPS_SAVE_RESPONSE';
export const GROUPS_SAVE_FAILURE = 'GROUPS_SAVE_FAILURE';

export const GROUPS_GETBYID = 'GROUPS_GETBYID';
export const GROUPS_GETBYID_START = 'GROUPS_GETBYID_START';
export const GROUPS_GETBYID_SUCCESS = 'GROUPS_GETBYID_SUCCESS';
export const GROUPS_GETBYID_RESPONSE = 'GROUPS_GETBYID_RESPONSE';
export const GROUPS_GETBYID_FAILURE = 'GROUPS_GETBYID_FAILURE';
export const GROUPS_GETBYID_END = 'GROUPS_GETBYID_END';

export const GROUPS_GET_USERS_CONTACTS = 'GROUPS_GET_USERS_CONTACTS';
export const GROUPS_GET_USERS_CONTACTS_START = 'GROUPS_GET_USERS_CONTACTS_START';
export const GROUPS_GET_USERS_CONTACTS_SUCCESS = 'GROUPS_GET_USERS_CONTACTS_SUCCESS';
export const GROUPS_GET_USERS_CONTACTS_RESPONSE = 'GROUPS_GET_USERS_CONTACTS_RESPONSE';
export const GROUPS_GET_USERS_CONTACTS_FAILURE = 'GROUPS_GET_USERS_CONTACTS_FAILURE';

export const GROUPS_GET_COMMENTS = 'GROUPS_GET_COMMENTS';
export const GROUPS_GET_COMMENTS_START = 'GROUPS_GET_COMMENTS_START';
export const GROUPS_GET_COMMENTS_SUCCESS = 'GROUPS_GET_COMMENTS_SUCCESS';
export const GROUPS_GET_COMMENTS_RESPONSE = 'GROUPS_GET_COMMENTS_RESPONSE';
export const GROUPS_GET_COMMENTS_FAILURE = 'GROUPS_GET_COMMENTS_FAILURE';

export const GROUPS_SAVE_COMMENT = 'GROUPS_SAVE_COMMENT';
export const GROUPS_SAVE_COMMENT_START = 'GROUPS_SAVE_COMMENT_START';
export const GROUPS_SAVE_COMMENT_SUCCESS = 'GROUPS_SAVE_COMMENT_SUCCESS';
export const GROUPS_SAVE_COMMENT_RESPONSE = 'GROUPS_SAVE_COMMENT_RESPONSE';
export const GROUPS_SAVE_COMMENT_FAILURE = 'GROUPS_SAVE_COMMENT_FAILURE';

export const GROUPS_GET_LOCATIONS = 'GROUPS_GET_LOCATIONS';
export const GROUPS_GET_LOCATIONS_START = 'GROUPS_GET_LOCATIONS_START';
export const GROUPS_GET_LOCATIONS_SUCCESS = 'GROUPS_GET_LOCATIONS_SUCCESS';
export const GROUPS_GET_LOCATIONS_RESPONSE = 'GROUPS_GET_LOCATIONS_RESPONSE';
export const GROUPS_GET_LOCATIONS_FAILURE = 'GROUPS_GET_LOCATIONS_FAILURE';

export const GROUPS_GET_PEOPLE_GROUPS = 'GROUPS_GET_PEOPLE_GROUPS';
export const GROUPS_GET_PEOPLE_GROUPS_START = 'GROUPS_GET_PEOPLE_GROUPS_START';
export const GROUPS_GET_PEOPLE_GROUPS_SUCCESS = 'GROUPS_GET_PEOPLE_GROUPS_SUCCESS';
export const GROUPS_GET_PEOPLE_GROUPS_RESPONSE = 'GROUPS_GET_PEOPLE_GROUPS_RESPONSE';
export const GROUPS_GET_PEOPLE_GROUPS_FAILURE = 'GROUPS_GET_PEOPLE_GROUPS_FAILURE';

export const GROUPS_GET_ACTIVITIES = 'GROUPS_GET_ACTIVITIES';
export const GROUPS_GET_ACTIVITIES_START = 'GROUPS_GET_ACTIVITIES_START';
export const GROUPS_GET_ACTIVITIES_SUCCESS = 'GROUPS_GET_ACTIVITIES_SUCCESS';
export const GROUPS_GET_ACTIVITIES_RESPONSE = 'GROUPS_GET_ACTIVITIES_RESPONSE';
export const GROUPS_GET_ACTIVITIES_FAILURE = 'GROUPS_GET_ACTIVITIES_FAILURE';

export const GROUPS_SEARCH = 'GROUPS_SEARCH';
export const GROUPS_SEARCH_START = 'GROUPS_SEARCH_START';
export const GROUPS_SEARCH_SUCCESS = 'GROUPS_SEARCH_SUCCESS';
export const GROUPS_SEARCH_RESPONSE = 'GROUPS_SEARCH_RESPONSE';
export const GROUPS_SEARCH_FAILURE = 'GROUPS_SEARCH_FAILURE';

export const GROUPS_GET_SETTINGS = 'GROUPS_GET_SETTINGS';
export const GROUPS_GET_SETTINGS_START = 'GROUPS_GET_SETTINGS_START';
export const GROUPS_GET_SETTINGS_SUCCESS = 'GROUPS_GET_SETTINGS_SUCCESS';
export const GROUPS_GET_SETTINGS_RESPONSE = 'GROUPS_GET_SETTINGS_RESPONSE';
export const GROUPS_GET_SETTINGS_FAILURE = 'GROUPS_GET_SETTINGS_FAILURE';

/**
 * Action Creators
 */
export function getAll(domain, token) {
  return {
    type: GROUPS_GETALL,
    domain,
    token,
  };
}

export function saveGroup(domain, token, groupData) {
  return {
    type: GROUPS_SAVE,
    domain,
    token,
    groupData,
  };
}

export function getById(domain, token, groupId) {
  return {
    type: GROUPS_GETBYID,
    domain,
    token,
    groupId,
  };
}

export function getByIdEnd() {
  return {
    type: GROUPS_GETBYID_END,
  };
}

export function getUsersAndContacts(domain, token) {
  return {
    type: GROUPS_GET_USERS_CONTACTS,
    domain,
    token,
  };
}

export function getCommentsByGroup(domain, token, groupId, offset, limit) {
  return {
    type: GROUPS_GET_COMMENTS,
    domain,
    token,
    groupId,
    offset,
    limit,
  };
}

export function saveComment(domain, token, groupId, commentData) {
  return {
    type: GROUPS_SAVE_COMMENT,
    domain,
    token,
    groupId,
    commentData,
  };
}

export function getLocations(domain, token) {
  return {
    type: GROUPS_GET_LOCATIONS,
    domain,
    token,
  };
}

export function getPeopleGroups(domain, token) {
  return {
    type: GROUPS_GET_PEOPLE_GROUPS,
    domain,
    token,
  };
}

export function getActivitiesByGroup(domain, token, groupId, offset, limit) {
  return {
    type: GROUPS_GET_ACTIVITIES,
    domain,
    token,
    groupId,
    offset,
    limit,
  };
}

export function searchGroups(domain, token) {
  return {
    type: GROUPS_SEARCH,
    domain,
    token,
  };
}

export function getGroupSettings(domain, token) {
  return {
    type: GROUPS_GET_SETTINGS,
    domain,
    token,
  };
}
