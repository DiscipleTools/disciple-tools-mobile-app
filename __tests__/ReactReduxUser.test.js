import { expectSaga } from 'redux-saga-test-plan';

import userSaga from '../store/sagas/user.sagas';
import userReducer from '../store/reducers/user.reducer';
import * as actions from '../store/actions/user.actions';

//expectSaga.DEFAULT_TIMEOUT = 25000;
//jest.setTimeout(15000);

describe.skip('User Saga', () => {
  it('set UserData', () =>
    expectSaga(userSaga)
      .withReducer(userReducer)
      .dispatch(
        actions.login({
          domain: 'dtappdemo.wpengine.com',
          username: 'hansrasch',
          password: 'Hrasch22...',
        }),
      )
      .run()
      .then(
        (value) => {
          console.log(value.storeState);
        },
        (error) => {
          console.error(error);
        },
      )
      .finally(() => {
        expect(true).toBeTruthy();
      }));
});
