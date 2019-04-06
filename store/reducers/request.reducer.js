export default function requestReducer(state = [], action) {
  switch (action.type) {
    case 'REQUEST':
      // ensure that we are not putting the same request onto backlog
      state = state.filter(existing => JSON.stringify(existing) === JSON.stringify(action))
      // add all state and the request to local storage
      state = [...state, action]
      console.log("*** REQUEST STATE ***")
      console.log(state)
      return state
      //return [...state, action]
    case 'RESPONSE':
      //console.log(action.payload)
      // loop through every item in local storage and filter out the successful request
      console.log("*** RESPONSE STATE ***")
      console.log(state)
      state = state.filter(existing => JSON.stringify(existing) === JSON.stringify(action))
      return state
    default:
      return state
  }
}
