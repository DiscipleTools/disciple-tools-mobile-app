import * as actions from '../actions/contacts.actions';

const initialState = {
  type: null,
  error: null,
  contacts: [],
  contact: null,
  comments: [],
  comment: null,
  activities: [],
};

export default function contactsReducer(state = initialState, action) {
  const newState = {
    ...state,
    type: action.type,
    error: null,
  };

  switch (action.type) {
    case actions.CONTACTS_GETALL_START:
      return {
        ...newState,
      };
    case actions.CONTACTS_GETALL_SUCCESS:
      return {
        ...newState,
        contacts: action.contacts,
      };
    case actions.CONTACTS_GETALL_FAILURE:
      return {
        ...newState,
        error: action.error,
      };
    case actions.CONTACTS_SAVE_START:
      return {
        ...newState,
      };
    case actions.CONTACTS_SAVE_SUCCESS:
      return {
        ...newState,
        contact: action.contact,
      };
    case actions.CONTACTS_SAVE_FAILURE:
      return {
        ...newState,
        error: action.error,
      };
    case actions.CONTACTS_GETBYID_START:
      return {
        ...newState,
      };
    case actions.CONTACTS_GETBYID_SUCCESS:
      return {
        ...newState,
        contact: action.contact,
      };
    case actions.CONTACTS_GETBYID_FAILURE:
      return {
        ...newState,
        error: action.error,
      };
    case actions.CONTACTS_GET_COMMENTS_START:
      return {
        ...newState,
      };
    case actions.CONTACTS_GET_COMMENTS_SUCCESS:
      return {
        ...newState,
        comments: action.comments,
      };
    case actions.CONTACTS_GET_COMMENTS_FAILURE:
      return {
        ...newState,
        error: action.error,
      };
    case actions.CONTACTS_SAVE_COMMENT_START:
      return {
        ...newState,
      };
    case actions.CONTACTS_SAVE_COMMENT_SUCCESS:
      return {
        ...newState,
        comment: action.comment,
      };
    case actions.CONTACTS_SAVE_COMMENT_FAILURE:
      return {
        ...newState,
        error: action.error,
      };
    case actions.CONTACTS_GET_ACTIVITIES_START:
      return {
        ...newState,
      };
    case actions.CONTACTS_GET_ACTIVITIES_SUCCESS:
      return {
        ...newState,
        activities: action.activities,
      };
    case actions.CONTACTS_GET_ACTIVITIES_FAILURE:
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
