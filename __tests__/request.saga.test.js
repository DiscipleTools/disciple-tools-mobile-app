import { expectSaga, testSaga } from 'redux-saga-test-plan';

import { combineReducers } from 'redux';
import { channel } from 'redux-saga';
import { call } from 'redux-saga/effects'; // set it to 4 secs (just under jest default of 5000ms)

import requestSaga from '../store/sagas/request.sagas';
import requestReducer from '../store/reducers/request.reducer';
import networkConnectivityReducer from '../store/reducers/networkConnectivity.reducer';

expectSaga.DEFAULT_TIMEOUT = 4000;
const reducers = combineReducers({
  networkConnectivityReducer,
  requestReducer,
});

user = {
  domain: 'localhost:8000',
  token: '??',
  username: 'zdmc',
  password: 'changeme',
};

contact = {
  name: 'Luigi',
};

testLoginPayload = {
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

testLogin = {
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
    initialState = {
      networkConnectivityReducer: { isConnected: true },
      requestReducer: [],
    };
    return expectSaga(requestSaga)
      .dispatch(testLogin) // login(user.domain, user.username, user.password))
      .withReducer(reducers, initialState)
      // queue should be empty of requests, since we are online and recvd a response
      .hasFinalState(initialState)
      .run();
  });
});
