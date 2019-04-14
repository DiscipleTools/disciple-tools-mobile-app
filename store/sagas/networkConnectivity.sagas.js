import { take, race } from 'redux-saga/effects';

export default function* networkConnectivitySaga() {
  while (true) {
    yield race([
      take('ONLINE'),
      take('OFFLINE'),
    ]);
  }
}
