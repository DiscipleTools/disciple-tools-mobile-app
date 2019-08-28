// adapted from:
//   -- https://www.youtube.com/watch?v=Pg7LgW3TL7A
//   -- https://redux-saga.js.org/docs/advanced/Channels.html

import {
  take, fork, call, put, race, delay, actionChannel, select,
} from 'redux-saga/effects';

const REQUEST_TIMEOUT_MILLIS = 4000;

function* processRequest(req) { // reqChannel) {
  // race 'fetch' against a timeout
  const { timeout, res } = yield race({
    res: call(fetch, req.payload.url, req.payload.data),
    timeout: delay(REQUEST_TIMEOUT_MILLIS),
  });
  if (res) {
    // TODO: replace with channel (to preserve order)?
    if (req.payload.action) {
      yield put({ type: req.payload.action, payload: res });
    }
    yield put({ type: 'RESPONSE', payload: { req, res } });
  }
  if (timeout) {
    yield put({ type: 'OFFLINE' });
  }
}

export default function* requestSaga() {
  // buffer all incoming requests
  const requestChannel = yield actionChannel('REQUEST'); // call(channel);
  const offlineChannel = yield actionChannel('OFFLINE');
  // enqueue when offline, fork when online
  while (true) {
    const { offline, request } = yield race({
      offline: take(offlineChannel),
      request: take(requestChannel),
    });
    if (offline) {
      const { payload } = yield take(requestChannel);
      if (payload && payload.data.method === 'POST' && payload.action.includes('SAVE')) {
        // If entity creation
        /* eslint-disable */
        const { payload } = yield select(state => state.requestReducer.currentAction);
        // get mapped payload
        yield put({ type: payload.action, payload: JSON.parse(payload.data.body) });
        /* eslint-enable */
      }
      // block until we come back online
      yield take('OFFLINE');
    } else {
      /*
      NOTE: compare actionChannel request with requests in requestReducer state.
      if the request is present in the requestReducer state, then fork it,
      otherwise skip it (bc it's an offline edit)
      */
      const queue = yield select(state => state.requestReducer.queue);
      for (const action of queue) {
        if (action === request) {
          // process the request
          yield fork(processRequest, request);
        }
      }
    }
  }
}
