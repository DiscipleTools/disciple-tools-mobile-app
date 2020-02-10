import { expectSaga } from 'redux-saga-test-plan';

import userSaga from '../store/sagas/user.sagas';
import userReducer from '../store/reducers/user.reducer';
import * as actions from '../store/actions/user.actions';

//expectSaga.DEFAULT_TIMEOUT = 25000;
//jest.setTimeout(15000);

describe('User Saga', () => {
  it('set UserData', (done) =>
    expectSaga(userSaga)
      .withReducer(userReducer)
      .dispatch(
        actions.login({
          domain: '',
          username: '',
          password: '',
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
        done();
      }));
});
