import * as actions from '../actions/contacts.actions';

const initialState = {
  type: null,
  error: null,
  contacts: [],
};

export default function contactsReducer(state = initialState, action) {
  const newState = {
    ...state,
    type: action.type,
    error: null,
  };
  console.log('action.type', action.type);
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
        group: action.group,
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
        group: action.group,
      };
    case actions.CONTACTS_GETBYID_FAILURE:
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
