export const NETWORK_SET_CONNECTIVITY = 'NETWORK_SET_CONNECTIVITY';
export const NETWORK_SET_STATUS = 'NETWORK_SET_STATUS';
export const NETWORK_TOGGLE = 'NETWORK_TOGGLE';

export const setNetworkConnectivity = (isConnected) => {
  return {
    type: NETWORK_SET_CONNECTIVITY,
    isConnected
  };
};

export const setNetworkStatus = (networkStatus) => {
  return {
    type: NETWORK_SET_STATUS,
    networkStatus
  };
};

export const toggleNetworkConnectivity = () => {
  return {
    type: NETWORK_TOGGLE
  };
};
