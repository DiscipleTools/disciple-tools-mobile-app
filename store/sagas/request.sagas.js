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
    //console.log("2.3 request", request);
    //console.log("2.4 response", response);
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
  const offlineChannel = yield actionChannel('OFFLINE');
  while (true) {
    const { offline, request } = yield race({
      offline: take(offlineChannel),
      request: take(requestChannel),
    });
    if (request) {
      //console.log('2.1 request', request);
      // ONLINE request
      // Get current queue, compare it whit last request (if exist, fork it)
      const queue = yield select(state => state.requestReducer.queue);
      //console.log('2.2 queue', queue);
      for (const action of queue) {
        if (action === request.payload) {
          // process the request
          yield fork(processRequest, request.payload);
        }
      }
    } else if (offline) {
      // Get last request
      const { payload } = yield select(state => state.requestReducer.currentAction);
      //console.log('2.1 payload', payload);
      // OFFLINE request
      if (payload && payload.data.method === 'POST' && payload.action.includes('SAVE')) {
        // Offline entity creation (send "last request" as response)
        /* eslint-disable */
        //console.log('2.2 send custom response', { type: payload.action, payload: JSON.parse(payload.data.body) });
        yield put({ type: payload.action, payload: JSON.parse(payload.data.body) });

        //Add new entity to collection

        /* eslint-enable */
      }
    }
  }
}
