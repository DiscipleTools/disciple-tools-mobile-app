import { all, fork } from 'redux-saga/effects';

import networkConnectivitySaga from './sagas/networkConnectivity.sagas';
import requestSaga from './sagas/request.sagas';
import userSaga from './sagas/user.sagas';
/* eslint-disable */
import contactsSaga from './sagas/contacts.sagas';
/* eslint-enable */
import groupsSaga from './sagas/groups.sagas';
import usersSaga from './sagas/users.sagas';

// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield fork(networkConnectivitySaga);
  yield all([
    requestSaga(),
    userSaga(),
    contactsSaga(),
    groupsSaga(),
    usersSaga(),
  ]);
}
