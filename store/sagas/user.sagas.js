import { put, take, takeLatest, all, takeEvery } from 'redux-saga/effects';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
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
      yield put({ type: actions.USER_LOGIN_SUCCESS, domain, user: { ...jsonData, password } });
      yield put({ type: actions.USER_GET_PUSH_TOKEN, domain, token: jsonData.token });
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

export function* getExpoPushToken({ domain, token }) {
  let expoPushToken = '';

  if (Constants.isDevice) {
    // Get permission
    const { status: existingStatus } = yield Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = yield Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }
    // Get push token from expo
    expoPushToken = yield Notifications.getExpoPushTokenAsync();
    // Construct a (somewhat) unique identifier for this particular device
    let uniqueId =
      (Device.manufacturer || '') +
      ':' +
      (Device.modelName || '') +
      ':' +
      (Device.deviceYearClass || '') +
      ':' +
      (Device.osName || '') +
      ':' +
      (Device.osVersion || '');
    yield put({ type: actions.USER_ADD_PUSH_TOKEN, domain, token, expoPushToken, uniqueId });
  } else {
    console.log('Must use physical device for Push Notifications');
  }
}

export function* addPushToken({ domain, token, expoPushToken, uniqueId }) {
  // send push token to DT
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt/v1/user/update`,
      data: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          add_push_token: {
            token: expoPushToken,
            device_id: uniqueId,
          },
        }),
      },
      action: actions.USER_ADD_PUSH_TOKEN_RESPONSE,
    },
  });

  try {
    let response = yield take(actions.USER_ADD_PUSH_TOKEN_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (response.status === 200) {
      yield put({ type: actions.USER_ADD_PUSH_TOKEN_SUCCESS, domain, user: jsonData });
    } else {
      yield put({
        type: actions.USER_ADD_PUSH_TOKEN_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.USER_ADD_PUSH_TOKEN_FAILURE,
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

export function* updateUserInfo({ domain, token, userInfo }) {
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt/v1/user/update`,
      data: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userInfo),
      },
      action: actions.UPDATE_USER_INFO_RESPONSE,
    },
  });

  try {
    let response = yield take(actions.UPDATE_USER_INFO_RESPONSE);
    response = response.payload;
    let jsonData = response.data;

    if (response.status === 200) {
      yield put({
        type: actions.UPDATE_USER_INFO_SUCCESS,
        ...userInfo,
      });
    } else {
      yield put({
        type: actions.UPDATE_USER_INFO_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.UPDATE_USER_INFO_FAILURE,
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
    takeLatest(actions.USER_GET_PUSH_TOKEN, getExpoPushToken),
    takeLatest(actions.USER_ADD_PUSH_TOKEN, addPushToken),
    takeLatest(actions.UPDATE_USER_INFO, updateUserInfo),
  ]);
}
