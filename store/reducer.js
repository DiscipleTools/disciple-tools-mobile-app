import { combineReducers } from 'redux';

import networkConnectivityReducer from './reducers/networkConnectivity.reducer';
import requestReducer from './reducers/request.reducer';
import userReducer from './reducers/user.reducer';
import contactsReducer from './reducers/contacts.reducer';

const reducers = combineReducers({
  networkConnectivityReducer,
  requestReducer,
  userReducer,
  contactsReducer,
});

export default reducers;
