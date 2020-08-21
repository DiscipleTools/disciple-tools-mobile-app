import { expectSaga } from 'redux-saga-test-plan';

import networkConnectivitySaga from '../store/sagas/networkConnectivity.sagas';
import networkConnectivityReducer from '../store/reducers/networkConnectivity.reducer';

// jest.setTimeout(30000);
// expectSaga.DEFAULT_TIMEOUT = 4000; // set it to 4 secs (just under jest default of 5000ms)

describe.skip('Network Saga', () => {
  it('toggle online, offline', () =>
    expectSaga(networkConnectivitySaga)
      .withReducer(networkConnectivityReducer)
      .dispatch({ type: 'ONLINE' })
      .dispatch({ type: 'OFFLINE' })
      .hasFinalState({ isConnected: false })
      .run());
});
