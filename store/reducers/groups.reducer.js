import * as actions from '../actions/groups.actions';

const initialState = {
  type: null,
  error: null,
  groups: [],
  group: null,
  usersContacts: [],
  comments: [],
  comment: null,
  geonames: [],
  peopleGroups: [],
  activities: [],
};

export default function groupsReducer(state = initialState, action) {
  const newState = {
    ...state,
    type: action.type,
    error: null,
  };
  switch (action.type) {
    case actions.GROUPS_GETALL_START:
      return {
        ...newState,
      };
    case actions.GROUPS_GETALL_SUCCESS:
      return {
        ...newState,
        groups: action.groups,
      };
    case actions.GROUPS_GETALL_FAILURE:
      return {
        ...newState,
        error: action.error,
      };
    case actions.GROUPS_SAVE_START:
      return {
        ...newState,
      };
    case actions.GROUPS_SAVE_SUCCESS:
      return {
        ...newState,
        group: action.group,
      };
    case actions.GROUPS_SAVE_FAILURE:
      return {
        ...newState,
        error: action.error,
      };
    case actions.GROUPS_GETBYID_START:
      return {
        ...newState,
      };
    case actions.GROUPS_GETBYID_SUCCESS:
      return {
        ...newState,
        group: action.group,
      };
    case actions.GROUPS_GETBYID_FAILURE:
      return {
        ...newState,
        error: action.error,
      };
    case actions.GROUPS_GET_USERS_CONTACTS_START:
      return {
        ...newState,
      };
    case actions.GROUPS_GET_USERS_CONTACTS_SUCCESS:
      return {
        ...newState,
        usersContacts: action.usersContacts,
      };
    case actions.GROUPS_GET_USERS_CONTACTS_FAILURE:
      return {
        ...newState,
        error: action.error,
      };
    case actions.GROUPS_GET_COMMENTS_START:
      return {
        ...newState,
      };
    case actions.GROUPS_GET_COMMENTS_SUCCESS:
      return {
        ...newState,
        comments: action.comments,
      };
    case actions.GROUPS_GET_COMMENTS_FAILURE:
      return {
        ...newState,
        error: action.error,
      };
    case actions.GROUPS_SAVE_COMMENT_START:
      return {
        ...newState,
      };
    case actions.GROUPS_SAVE_COMMENT_SUCCESS:
      return {
        ...newState,
        comment: action.comment,
      };
    case actions.GROUPS_SAVE_COMMENT_FAILURE:
      return {
        ...newState,
        error: action.error,
      };
    case actions.GROUPS_GET_LOCATIONS_START:
      return {
        ...newState,
      };
    case actions.GROUPS_GET_LOCATIONS_SUCCESS:
      return {
        ...newState,
        geonames: action.geonames,
      };
    case actions.GROUPS_GET_LOCATIONS_FAILURE:
      return {
        ...newState,
        error: action.error,
      };
    case actions.GROUPS_GET_PEOPLE_GROUPS_START:
      return {
        ...newState,
      };
    case actions.GROUPS_GET_PEOPLE_GROUPS_SUCCESS:
      return {
        ...newState,
        peopleGroups: action.peopleGroups,
      };
    case actions.GROUPS_GET_PEOPLE_GROUPS_FAILURE:
      return {
        ...newState,
        error: action.error,
      };
    case actions.GROUPS_GET_ACTIVITIES_START:
      return {
        ...newState,
      };
    case actions.GROUPS_GET_ACTIVITIES_SUCCESS:
      return {
        ...newState,
        activities: action.activities,
      };
    case actions.GROUPS_GET_ACTIVITIES_FAILURE:
      return {
        ...newState,
        error: action.error,
      };
    default:
      return Object.assign({}, state, {
        error: null,
        type: null,
      });
  }
}
