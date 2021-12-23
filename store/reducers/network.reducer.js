import * as actions from "store/actions/network.actions";

const initialState = {
  isConnected: null,
  networkStatus: null,
};

const networkReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.NETWORK_SET_CONNECTIVITY:
      return { ...state, isConnected: action?.isConnected };
    case actions.NETWORK_SET_STATUS:
      return { ...state, networkStatus: action?.networkStatus };
    case actions.NETWORK_TOGGLE:
      return { ...state, isConnected: !state.isConnected };
    default:
      return state;
  }
};
export default networkReducer;