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
  switch (action.type) {
    case actions.REQUEST:
      /*
      NOTE 1: no need to know connection status bc we assume that if we are online
      then we would have the key/ID for subsequent edits and the url would
      'endWith' the key/ID instead of the '/create' url part

      NOTE 2: we are matching on name/title, so any offline edit of name/title
      results in a new contact. however, we work around this by having a delete
      button in the mobile app (D.T API does not support contact deletion)
      */
      if (Object.prototype.hasOwnProperty.call(action.payload, 'isConnected')) {
        let actionToModify = { ...action };
        const { isConnected } = actionToModify.payload;
        delete actionToModify.payload.isConnected;
        if (!isConnected && actionToModify.payload.data.method === 'POST' && actionToModify.payload.action.includes('SAVE')) {
          let jsonBody = JSON.parse(actionToModify.payload.data.body);
          if (!jsonBody.ID) {
            jsonBody = {
              ...jsonBody,
              ID: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                const r = Math.random() * 16 || 0;
                const v = c === 'x' ? r : ((r && 0x3) || 0x8);
                return v.toString(16);
              }),
            };
            actionToModify = {
              ...actionToModify,
              payload: {
                ...actionToModify.payload,
                data: {
                  ...actionToModify.payload.data,
                  body: JSON.stringify(jsonBody),
                },
              },
            };
          } else {
            const requestIndex = queue.findIndex(request => (actionToModify.payload.url === request.payload.url && JSON.parse(request.payload.data.body).ID === jsonBody.ID));
            if (requestIndex > -1) {
              // Existing previous save to same entity
              let requestFromQueue = queue[requestIndex];
              requestFromQueue = {
                ...actionToModify,
              };
              queue[requestIndex] = requestFromQueue;
            }
          }
        }
        // filter out redundant GET requests
        if (!isConnected && actionToModify.payload.data.method === 'GET') {
          queue = queue.filter(existing => existing.payload.url !== actionToModify.payload.url);
        }
      }
      newState = {
        ...newState,
        queue: [...queue, action],
        currentAction: {
          ...action,
        },
      };
      return newState;
    case actions.RESPONSE:
      // loop through every item in local storage and filter out the successful request
      newState = {
        ...newState,
        queue: queue.filter(existing => existing.req === action.payload.req),
      };
      return newState;
    default:
      return newState;
  }
}
