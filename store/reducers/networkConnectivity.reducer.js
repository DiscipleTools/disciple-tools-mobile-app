const initialState = {
  isConnected: undefined,
};

export default function networkConnectivityReducer(state = initialState, action) {
  switch (action.type) {
    case 'ONLINE':
      return { ...state, isConnected: true };
    case 'OFFLINE':
      return { ...state, isConnected: false };
    default:
      return state;
  }
}
