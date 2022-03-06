import * as actions from "store/actions/network.actions";

const initialState = {
  isConnected: null,
};

const networkReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.NETWORK_SET_IS_CONNECTED:
      return { ...state, isConnected: action?.isConnected };
    default:
      return state;
  }
};
export default networkReducer;