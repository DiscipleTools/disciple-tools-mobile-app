import { actionChannel, take, select, put } from 'redux-saga/effects';

export default function* networkConnectivitySaga() {
  const onlineChannel = yield actionChannel('ONLINE');

  while (true) {
    yield take(onlineChannel);

    let queue = yield select((state) => state.requestReducer.queue);

    for (let action of queue) {
      let mappedRequest = {
        ...action,
      };
      // Only process POST and SAVE requests
      if (action.data.method === 'POST' || action.data.method === 'DELETE') {
        if (action.action.includes('SAVE') || action.action.includes('DELETE')) {
          mappedRequest = {
            ...mappedRequest,
            isConnected: true,
          };

          yield put({
            type: 'REQUEST',
            payload: mappedRequest,
          });

          let response = yield take(mappedRequest.action);
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
                const entityListName = action.action
                  .substr(0, action.action.indexOf('_'))
                  .toLowerCase();
                // Map comments requests of entity
                queue.forEach(function (requestTwo, index) {
                  let mappedRequestTwo = {
                    ...requestTwo,
                  };
                  // update oldID to ID in URL
                  if (requestTwo.url.includes(`${entityListName}/${jsonData.oldID}/comments`)) {
                    mappedRequestTwo = {
                      ...mappedRequestTwo,
                      url: requestTwo.url.replace(jsonData.oldID, jsonData.ID),
                    };
                  }
                  // search only in POST requests
                  if (requestTwo.data.method === 'POST') {
                    let requestBody = { ...JSON.parse(requestTwo.data.body) };

                    Object.keys(requestBody).forEach((key) => {
                      const value = requestBody[key];
                      // Update temporal ID in multi-value fields with back-end ID
                      if (
                        Object.prototype.hasOwnProperty.call(value, 'values') &&
                        value.values.length > 0
                      ) {
                        let mappedValue = value.values;

                        mappedValue = mappedValue.map((object) => {
                          let copyObject = { ...object };

                          if (copyObject.value === jsonData.oldID) {
                            copyObject = {
                              value: jsonData.ID.toString(),
                            };
                          }

                          return copyObject;
                        });

                        requestBody = {
                          ...requestBody,
                          [key]: {
                            values: mappedValue,
                          },
                        };
                      }
                    });

                    mappedRequestTwo = {
                      ...mappedRequestTwo,
                      data: {
                        ...mappedRequestTwo.data,
                        body: JSON.stringify(requestBody),
                      },
                    };
                  }

                  queue[index] = {
                    ...mappedRequestTwo,
                  };
                });
              }

              if (!mappedRequest.url.includes('/comments')) {
                const entityName = action.action
                  .substr(0, action.action.indexOf('_') - 1)
                  .toLowerCase();

                yield put({
                  type: mappedRequest.action.replace('RESPONSE', 'SUCCESS'),
                  [entityName]: jsonData,
                });
              }
            } else {
              yield put({
                type: mappedRequest.action.replace('RESPONSE', 'FAILURE'),
                error: {
                  code: jsonData.code,
                  message: jsonData.message,
                },
              });
            }
          }
        } else if (action.action.includes('UPDATE_USER_INFO')) {
          yield put({
            type: 'REQUEST',
            payload: mappedRequest,
          });

          let response = yield take(mappedRequest.action);
          response = response.payload;

          if (response.status === 200) {
            yield put({
              type: mappedRequest.action.replace('RESPONSE', 'SUCCESS'),
              ...JSON.parse(mappedRequest.data.body),
            });
          } else {
            let jsonData = response.data;

            yield put({
              type: mappedRequest.action.replace('RESPONSE', 'FAILURE'),
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
