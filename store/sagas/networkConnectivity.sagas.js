import {
  actionChannel, take, select, put,
} from 'redux-saga/effects';

export default function* networkConnectivitySaga() {
  const onlineChannel = yield actionChannel('ONLINE');

  while (true) {
    yield take(onlineChannel);
    let queue = yield select(state => state.requestReducer.queue);
    for (const action of queue) {
      let actionMapped = {
        ...action,
      };

      if (action.data.method === 'POST' && action.action.includes('SAVE')) {
        // queued request entity creation
        actionMapped = {
          ...actionMapped,
          isConnected: true,
        };
        yield put({
          type: 'REQUEST',
          payload: actionMapped,
        });
        let response = yield take(actionMapped.action);
        response = response.payload;

        if (Object.prototype.hasOwnProperty.call(response, 'status')) {
          let jsonData = response.data;
          if (response.oldID) {
            jsonData = {
              ...jsonData,
              oldID: response.oldID,
            };
          }
          if (response.status === 200) {
            if (jsonData.oldID) {
              const entityListName = action.action.substr(0, action.action.indexOf('_')).toLowerCase();
              // Map comments requests of entity, update oldID to ID in URL
              queue = queue.map((request) => {
                if (request.url.includes(`${entityListName}/${jsonData.oldID}/comments`)) {
                  request.url = request.url.replace(jsonData.oldID, jsonData.ID);
                }
                return request;
              });
            }
            if (!actionMapped.url.includes('/comments')) {
              const entityName = action.action.substr(0, action.action.indexOf('_') - 1).toLowerCase();
              yield put({
                type: actionMapped.action.replace('RESPONSE', 'SUCCESS'),
                [entityName]: jsonData,
              });
            }
          } else {
            yield put({
              type: actionMapped.action.replace('RESPONSE', 'FAILURE'),
              error: {
                code: jsonData.code,
                message: jsonData.message,
              },
            });
          }
        }
      }
    }
  }
}
