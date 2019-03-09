import { all } from 'redux-saga/effects';
import userSaga from './sagas/user.sagas';
import contactsSaga from './sagas/contacts.sagas';

// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([
    userSaga(),
    contactsSaga(),
  ]);
}
