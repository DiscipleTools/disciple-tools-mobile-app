import * as actions from '../actions/networkConnectivity.actions';

const initialState = {
  isConnected: undefined,
  networkStatus: false,
};

export default function networkConnectivityReducer(state = initialState, action) {
  let newState = {
    ...state,
  };
  switch (action.type) {
    case actions.ONLINE:
      return { ...newState, isConnected: true };
    case actions.OFFLINE:
      return { ...newState, isConnected: false };
    case actions.NETWORK_STATUS:
      return { ...newState, networkStatus: action.value };
    default:
      return newState;
  }
}
