// adapted from: 
//   -- https://www.youtube.com/watch?v=Pg7LgW3TL7A
//   -- https://redux-saga.js.org/docs/advanced/Channels.html 

import { channel } from 'redux-saga';
import { take, takeLatest, fork, call, put, race, cancelled, delay, actionChannel, select } from 'redux-saga/effects';

const REQUEST_TIMEOUT_MILLIS = 4000;

function* processRequest(req) { //reqChannel) {
  // race 'fetch' against a timeout
  const { timeout, res } = yield race({
    res: call(fetch, req.payload.url, req.payload.data),
    timeout: delay(REQUEST_TIMEOUT_MILLIS)
  });
  if (res) {
    // TODO: replace with channel (to preserve order)?
    if (req.payload.action) {
      yield put({ type: req.payload.action, payload: res })
    }
    yield put({ type: 'RESPONSE', payload: { req, res } })
  }
  if (timeout) {
    yield put({ type: 'OFFLINE' });
  }
}

export default function* requestSaga() {
  // buffer all incoming requests
  const reqChannel = yield actionChannel('REQUEST') //call(channel);
  const offlineChannel = yield actionChannel('OFFLINE') 

  // enqueue when offline, fork when online
  while (true) {
    const { offline, payload } = yield race({
      offline: take(offlineChannel), //takeLatest('OFFLINE'),
      payload: take(reqChannel)
    })
    //console.log("*** RACE RESULTS ***", offline === undefined ? "ONLINE. FORK REQUEST!" : "OFFLINE. QUEUE REQUEST")
    if (offline) {
      // block until we come back online
      yield take('ONLINE')
    } else {
      /* 
      NOTE: compare actionChannel request with requests in requestReducer state.
      if the request is present in the requestReducer state, then fork it,
      otherwise skip it (bc it's an offline edit)
      */
      const reqState = yield select(state => state.requestReducer)
      //reqState.forEach(function(req) { // yield does not work inside forEach (JavaScript is becoming ridiculous)
      for (let req of reqState) {
        if (req === payload) {
          // process the request
          yield fork(processRequest, payload)
        } 
      }
    }
  }
}
