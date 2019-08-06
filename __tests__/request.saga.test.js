import { expectSaga } from 'redux-saga-test-plan';

import { combineReducers } from 'redux';

import requestSaga from '../store/sagas/request.sagas';
import requestReducer from '../store/reducers/request.reducer';
import networkConnectivityReducer from '../store/reducers/networkConnectivity.reducer';

expectSaga.DEFAULT_TIMEOUT = 4000;
const reducers = combineReducers({
  networkConnectivityReducer,
  requestReducer,
});

const user = {
  domain: 'localhost:8000',
  token: '??',
  username: 'zdmc',
  password: 'changeme',
};

const testLoginPayload = {
  url: `http://${user.domain}/wp-json/jwt-auth/v1/token`,
  data: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      username: `${user.username}`,
      password: `${user.password}`,
    },
  },
};

const testLogin = {
  type: 'REQUEST',
  payload: testLoginPayload,
};

describe('Request Saga', () => {
  /*
  it('offline post', () => {
    initialState = {
      networkConnectivityReducer: { isConnected: false },
      requestReducer: []
    }
    return expectSaga(requestSaga)
      // simulate offline
      //.dispatch({ type: 'OFFLINE' })
      .dispatch(testLogin) //login(user.domain, user.username, user.password))
      .withReducer(reducers, initialState)
      // request should remain in queue, since no response
      .hasFinalState({
        networkConnectivityReducer: { isConnected: false },
        requestReducer: [testLogin]
      })
      .run();
  });
  */
  it('online post', () => {
    /* const initialState = {
      networkConnectivityReducer: { isConnected: true },
      requestReducer: [],
    };
    return expectSaga(requestSaga)
      .dispatch(testLogin) // login(user.domain, user.username, user.password))
      .withReducer(reducers, initialState)
      // queue should be empty of requests, since we are online and recvd a response
      .hasFinalState(initialState)
      .run(); */
  });
});
