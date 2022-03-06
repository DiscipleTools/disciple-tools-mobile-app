export const NETWORK_SET_IS_CONNECTED = "NETWORK_SET_IS_CONNECTED";

export const setNetworkIsConnected = (isConnected) => {
  return {
    type: NETWORK_SET_IS_CONNECTED,
    isConnected,
  };
};