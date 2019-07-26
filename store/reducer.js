import { combineReducers } from 'redux';

import networkConnectivityReducer from './reducers/networkConnectivity.reducer';
import requestReducer from './reducers/request.reducer';
import userReducer from './reducers/user.reducer';
import contactsReducer from './reducers/contacts.reducer';
import groupsReducer from './reducers/groups.reducer';
import usersReducer from './reducers/users.reducer';

const reducers = combineReducers({
  networkConnectivityReducer,
  requestReducer,
  userReducer,
  contactsReducer,
  groupsReducer,
  usersReducer,
});

export default reducers;
