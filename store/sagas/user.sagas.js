import { put, take, takeLatest, all, takeEvery } from 'redux-saga/effects';
import * as actions from '../actions/user.actions';

export function* login({ domain, username, password }) {
  yield put({ type: actions.USER_LOGIN_START });
  // fetch JWT token
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/jwt-auth/v1/token`,
      data: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      },
      action: actions.USER_LOGIN_RESPONSE,
    },
  });
  try {
    let response = yield take(actions.USER_LOGIN_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (response.status === 200) {
      yield put({ type: actions.USER_LOGIN_SUCCESS, domain, user: jsonData });
    } else {
      yield put({
        type: actions.USER_LOGIN_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.USER_LOGIN_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* getUserInfo({ domain, token }) {
  yield put({ type: actions.GET_MY_USER_INFO_START });
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt/v1/user/my`,
      data: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      action: actions.GET_MY_USER_INFO_RESPONSE,
    },
  });

  try {
    let response = yield take(actions.GET_MY_USER_INFO_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (response.status === 200) {
      yield put({
        type: actions.GET_MY_USER_INFO_SUCCESS,
        userInfo: jsonData,
      });
    } else {
      yield put({
        type: actions.GET_MY_USER_INFO_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.GET_MY_USER_INFO_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export default function* userSaga() {
  yield all([
    takeLatest(actions.USER_LOGIN, login),
    takeEvery(actions.GET_MY_USER_INFO, getUserInfo),
  ]);
}
