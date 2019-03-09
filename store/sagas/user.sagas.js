import { put, takeLatest, all } from 'redux-saga/effects';
import * as actions from '../actions/user.actions';

export function* login({ domain, username, password }) {
  yield put({ type: actions.USER_LOGIN_START });

  // fetch JWT token
  let response;
  try {
    response = yield fetch(`https://${domain}/wp-json/jwt-auth/v1/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });
  } catch (error) {
    // console.log(error);
    yield put({
      type: actions.USER_LOGIN_FAILURE,
      error,
    });
  }

  const jsonData = yield response.json();
  if (jsonData && jsonData.code && jsonData.data && jsonData.data.status
    && jsonData.data.status === 403) {
    yield put({
      type: actions.USER_LOGIN_FAILURE,
      error: {
        code: jsonData.code,
        message: jsonData.message,
      },
    });
  } else {
    yield put({
      type: actions.USER_LOGIN_SUCCESS,
      domain,
      user: jsonData,
    });
  }
}

export default function* userSaga() {
  yield all([
    takeLatest(actions.USER_LOGIN, login),
  ]);
}
