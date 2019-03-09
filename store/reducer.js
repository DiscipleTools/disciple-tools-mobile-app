import { combineReducers } from 'redux';
import * as actions from './actions/user.actions';

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
    items: [],
  },
};

/* function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action);
    }
    return state;
  };
} */

function user(state = initialState.user, action) {
  switch (action.type) {
    case actions.USER_LOGIN_START:
      return Object.assign({}, state, {
        isLoading: true,
        error: null,
      });
    case actions.USER_LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isLoading: false,
        domain: action.domain,
        token: action.user.token,
        username: action.user.user_nicename,
        displayName: action.user.user_display_name,
        email: action.user.user_email,
      });
    case actions.USER_LOGIN_FAILURE:
      return Object.assign({}, state, {
        isLoading: false,
        error: action.error,
      });
    case actions.USER_LOGOUT:
      return Object.assign({}, state, {
        token: null,
      });
    default:
      return state;
  }
}

/* function requestContacts(state, action) {
  return Object.assign({}, state, {
    isFetching: true,
  });
}
function setContacts(state, action) {
  return Object.assign({}, state, {
    isFetching: false,
    items: action.contacts,
  });
}
const contactsReducer = createReducer([], {
  [REQUEST_CONTACTS]: requestContacts,
  [RECEIVE_CONTACTS]: setContacts,
}); */

const reducers = combineReducers({
  // contacts: contactsReducer,
  user,
});

export default reducers;
