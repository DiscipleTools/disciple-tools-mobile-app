import * as actions from '../actions/request.actions';

const initialState = {
  queue: [],
  currentAction: {},
};

export default function requestReducer(state = initialState, action) {
  let newState = {
    ...state,
    currentAction: {},
  };
  let queue = newState.queue.slice(0); // clone array before modifying it
  // console.log("action.type", action.type);
  let actionToModify = action.payload;
  switch (action.type) {
    case actions.REQUEST:
      // Queue all requests
      if (Object.prototype.hasOwnProperty.call(action.payload, 'isConnected')) {
        const { isConnected } = actionToModify;
        delete actionToModify.isConnected;
        if (!isConnected) {
          // If app its in OFFLINE mode, map request.
          if (actionToModify.data.method === 'POST' && actionToModify.action.includes('SAVE')) {
            let jsonBody = JSON.parse(actionToModify.data.body);
            if (jsonBody.ID) {
              const requestIndex = queue.findIndex(request => (actionToModify.url === request.payload.url && JSON.parse(request.payload.data.body).ID === jsonBody.ID));
              if (requestIndex > -1) {
                // Existing previous save to same entity (merge it)
                let requestFromQueue = queue[requestIndex];
                requestFromQueue = {
                  ...actionToModify,
                };
                queue[requestIndex] = requestFromQueue;
              }
            } else {
              /* eslint-disable */
              // new save request
              jsonBody = {
                ...jsonBody,
                ID: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                  const r = Math.random() * 16 | 0;
                  const v = c === 'x' ? r : ((r && 0x3) | 0x8);
                  return v.toString(16);
                }),
              };
              /* eslint-enable */
              actionToModify = {
                ...actionToModify,
                data: {
                  ...actionToModify.data,
                  body: JSON.stringify(jsonBody),
                },
              };
            }
          } else if (actionToModify.data.method === 'GET') {
            // filter out redundant GET requests
            queue = queue.filter(existing => existing.payload.url !== actionToModify.url);
          }
        }
      }
      newState = {
        ...newState,
        queue: [...queue, actionToModify],
        currentAction: actionToModify,
      };
      // console.log('1.1 adding to queue...', actionToModify);
      return newState;
    case actions.RESPONSE:
      // loop through every item in local storage and filter out the successful request
      // console.log('1.2 removing of queue...', action);
      newState = {
        ...newState,
        queue: queue.filter(request => request === action.payload),
      };
      return newState;
    default:
      return newState;
  }
}
