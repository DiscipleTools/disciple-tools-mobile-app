import { combineReducers } from 'redux';
import * as userActions from './actions/user.actions';
import * as contactsActions from './actions/contacts.actions';

const initialState = {
  user: {
    baseUrl: null,
    name: null,
    displayName: null,
    email: null,
    token: null,
    error: null,
  },
  contacts: {
    isLoading: false,
    error: null,
    items: [],
  },
};

function user(state = initialState.user, action) {
  switch (action.type) {
    case userActions.USER_LOGIN_START:
      return Object.assign({}, state, {
        isLoading: true,
        error: null,
      });
    case userActions.USER_LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isLoading: false,
        domain: action.domain,
        token: action.user.token,
        username: action.user.user_nicename,
        displayName: action.user.user_display_name,
        email: action.user.user_email,
      });
    case userActions.USER_LOGIN_FAILURE:
      return Object.assign({}, state, {
        isLoading: false,
        error: action.error,
      });
    case userActions.USER_LOGOUT:
      return Object.assign({}, state, {
        token: null,
      });
    default:
      return state;
  }
}

function contacts(state = initialState.contacts, action) {
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

const reducers = combineReducers({
  contacts,
  user,
});

export default reducers;
