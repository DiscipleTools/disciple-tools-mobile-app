import * as actions from '../actions/request.actions';

export default function requestReducer(state = [], action) {
  let updatedState = state.slice(0); // clone array before modifying it
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
      if (action.payload.data.method === 'POST' && action.payload.url.toString().endsWith('/create')) {
        const actionName = JSON.parse(action.payload.data.body).title;
        updatedState.forEach((req) => {
          if (req.payload.data.method === 'POST' && req.payload.url.toString().endsWith('/create')) {
            const reqName = JSON.parse(req.payload.data.body).title;
            if (actionName === reqName) {
              updatedState = updatedState.filter(existing => existing !== req);
            }
          }
        });
      }
      // filter out redundant GET requests
      if (action.payload.data.method === 'GET') {
        updatedState = updatedState.filter(existing => existing.payload.url !== action.payload.url);
      }
      return [...updatedState, action];
    case actions.RESPONSE:
      // loop through every item in local storage and filter out the successful request
      return updatedState.filter(existing => existing.req === action.payload.req);
    default:
      return updatedState;
  }
}
