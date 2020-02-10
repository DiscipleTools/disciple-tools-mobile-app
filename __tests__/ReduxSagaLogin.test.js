import { expectSaga } from 'redux-saga-test-plan';
import requestSaga from '../store/sagas/request.sagas';
import networkConnectivityReducer from '../store/reducers/networkConnectivity.reducer';
import requestReducer from '../store/reducers/request.reducer';
import { combineReducers } from 'redux';

describe('Redux Saga - Login', () => {
  it('Login - Online', (done) => {
    const user = {
      domain: 'dtappdemo.wpengine.com',
      token: null,
      username: 'hansrasch',
      password: 'Hrasch22...',
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

    const initialState = {
      networkConnectivityReducer: { isConnected: true },
      requestReducer: [],
    };

    const reducers = combineReducers({
      networkConnectivityReducer,
      requestReducer,
    });

    return expectSaga(requestSaga)
      .dispatch(testLogin)
      .withReducer(reducers, initialState)
      .hasFinalState(initialState)
      .run()
      .finally(() => {
        done();
      });
  });
});
