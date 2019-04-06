import * as contactsActions from '../actions/contacts.actions';

const initialState = {
  isLoading: false,
  error: null,
  items: [],
}

export default function contactsReducer(state = initialState, action) {
  switch (action.type) {
    case contactsActions.CONTACTS_GETALL_START:
      return Object.assign({}, state, {
        isLoading: true,
        error: null,
      });
    case contactsActions.CONTACTS_GETALL_SUCCESS:
      return Object.assign({}, state, {
        isLoading: false,
        items: action.contacts,
      });
    case contactsActions.CONTACTS_GETALL_FAILURE:
      return Object.assign({}, state, {
        isLoading: false,
        error: action.error,
      });
    default:
      return state;
  }
}
