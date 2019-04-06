import { combineReducers } from 'redux';

import requestReducer from './reducers/request.reducer';
import userReducer from './reducers/user.reducer';
import contactsReducer from './reducers/contacts.reducer';
import contactReducer from './reducers/contact.reducer';

const reducers = combineReducers({
  requestReducer,
  contactReducer,
  contactsReducer,
  userReducer,
});

export default reducers;
