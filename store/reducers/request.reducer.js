import * as actions from '../actions/request.actions';

export default function requestReducer(state = [], action) {
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
      if (action.payload.data.method === "POST" && action.payload.url.toString().endsWith("/create")) {
        action_name = JSON.parse(action.payload.data.body).title
        state.forEach(function(req) {
          if (req.payload.data.method === "POST" && req.payload.url.toString().endsWith("/create")) {
            req_name = JSON.parse(req.payload.data.body).title
            if (action_name === req_name) {
              state = state.filter(existing => existing != req)
            }
          }
        })
      }
      // filter out redundant GET requests
      if (action.payload.data.method === "GET") {
        state = state.filter(existing => existing.payload.url != action.payload.url)
      }
      return [...state, action]
    case actions.RESPONSE:
      // loop through every item in local storage and filter out the successful request
      return state.filter(existing => existing.req === action.payload.req)
    default:
      return state
  }
}
