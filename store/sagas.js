import { all } from 'redux-saga/effects';

import networkConnectivitySaga from './sagas/networkConnectivity.sagas';
import requestSaga from './sagas/request.sagas';
import userSaga from './sagas/user.sagas';
import contactsSaga from './sagas/contacts.sagas';
import groupsSaga from './sagas/groups.sagas';
import usersSaga from './sagas/users.sagas';
import notificationsSaga from './sagas/notifications.sagas';
import questionnaireSaga from './sagas/questionnaire.sagas';

// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([
    networkConnectivitySaga(),
    requestSaga(),
    userSaga(),
    contactsSaga(),
    groupsSaga(),
    usersSaga(),
    notificationsSaga(),
    questionnaireSaga(),
  ]);
}
