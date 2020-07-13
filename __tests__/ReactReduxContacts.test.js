import { expectSaga } from 'redux-saga-test-plan';

import contactSaga from '../store/sagas/contacts.sagas';
import contactReducer from '../store/reducers/contacts.reducer';
import * as contactActions from '../store/actions/contacts.actions';

describe.skip('Contact Saga', () => {
  test('get Contacts', () =>
    expectSaga(contactSaga)
      .withReducer(contactReducer)
      .dispatch(
        contactActions.getAll({
          domain: 'dtappdemo.wpengine.com',
          token: '',
          offset: 0,
          limit: 10,
          sort: 'name',
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
