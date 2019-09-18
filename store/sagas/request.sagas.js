// adapted from:
//   -- https://www.youtube.com/watch?v=Pg7LgW3TL7A
//   -- https://redux-saga.js.org/docs/advanced/Channels.html

import {
  take, fork, call, put, race, delay, actionChannel, select,
} from 'redux-saga/effects';

const REQUEST_TIMEOUT_MILLIS = 4000;

function* sendRequest(url, data) {
  const request = yield fetch(url, data)
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return response;
      }
      throw response;
    })
    .then(response => response.json())
    .then(response => ({
      status: 200,
      data: response,
    }))
    .catch((error) => {
      if (typeof error.json === 'function') {
        return error.json().then(errorJSON => ({
          status: errorJSON.data.status,
          data: {
            code: errorJSON.code,
            message: errorJSON.message,
          },
        }));
      }
      return {
        status: 400,
        data: {
          code: 400,
          message: error.toString(),
        },
      };
    });
  return request;
}

function* processRequest(request) {
  const { response, timeout } = yield race({
    response: call(sendRequest, request.url, request.data),
    timeout: delay(REQUEST_TIMEOUT_MILLIS),
  });
  if (response) {
    if (request.action) {
      yield put({ type: request.action, payload: response });
    }
    // Dispatch action 'RESPONSE' to remove request from queue
    yield put({ type: 'RESPONSE', payload: request });
  } else if (timeout) {
    yield put({ type: 'OFFLINE' });
  }
}

export default function* requestSaga() {
  // buffer all incoming requests
  const requestChannel = yield actionChannel('REQUEST');
  // const offlineChannel = yield actionChannel('OFFLINE');
  while (true) {
    const { /* offline, */ request } = yield race({
      // offline: take(offlineChannel),
      request: take(requestChannel),
    });
    const isConnected = yield select(state => state.networkConnectivityReducer.isConnected);
    const localGetById = {
      value: null,
      isLocal: false,
    };
    if (request.payload.data.method === 'GET' && request.payload.action.includes('GETBYID')) {
      let id = request.payload.url.split('/');
      id = id[id.length - 1];
      localGetById.value = id;
      /* eslint-disable */
      if (isNaN(id)) {
        /* eslint-enable */
        localGetById.isLocal = true;
      }
    }
    if (!isConnected || localGetById.isLocal) {
      // Get last request
      const payload = yield select(state => state.requestReducer.currentAction);
      // OFFLINE request
      if (payload) {
        if (payload.data.method === 'POST' && payload.action.includes('SAVE')) {
          // Offline entity creation (send "last request" as response)
          /* eslint-disable */
          yield put({ type: payload.action, payload: JSON.parse(payload.data.body) });
          /* eslint-enable */
        }
        if (payload.data.method === 'GET' && payload.action.includes('GETBYID')) {
          yield put({ type: payload.action, payload: { data: { ID: localGetById.value, isOffline: true }, status: 200 } });
        }
      }
    } else if (request) {
      // ONLINE request
      // Get current queue, compare it whit last request (if exist, fork it)
      const queue = yield select(state => state.requestReducer.queue);
      for (const action of queue) {
        if (action === request.payload) {
          // process the request
          yield fork(processRequest, request.payload);
        }
      }
    }
  }
}
