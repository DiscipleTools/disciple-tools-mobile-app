import { put, take, takeLatest, all, select } from 'redux-saga/effects';

import * as actions from '../actions/notifications.actions';

export function* getNotificationsByUser({ domain, token, offset, limit }) {
  yield put({ type: actions.NOTIFICATIONS_BY_USER_START });
  const isConnected = yield select((state) => state.networkConnectivityReducer.isConnected);
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt/v1/notifications/get_notifications`,
      data: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          all: false,
          limit,
          page: offset,
        }),
      },
      action: actions.NOTIFICATIONS_BY_USER_RESPONSE,
    },
  });
  try {
    let response = yield take(actions.NOTIFICATIONS_BY_USER_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (isConnected) {
      if (response.status === 200) {
        yield put({
          type: actions.NOTIFICATIONS_BY_USER_SUCCESS,
          notifications: jsonData,
        });
      } else {
        yield put({
          type: actions.NOTIFICATIONS_BY_USER_FAILURE,
          error: {
            code: jsonData.code,
            message: jsonData.message,
          },
        });
      }
    }
  } catch (error) {
    yield put({
      type: actions.NOTIFICATIONS_BY_USER_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export default function* notificationsSaga() {
  yield all([takeLatest(actions.NOTIFICATIONS_BY_USER, getNotificationsByUser)]);
}
