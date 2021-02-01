export const ONLINE = 'ONLINE';
export const OFFLINE = 'OFFLINE';
export const NETWORK_STATUS = 'NETWORK_STATUS';

export function setNetworkConnectivity(isConnected) {
  if (isConnected) {
    return { type: ONLINE };
  }
  return { type: OFFLINE };
}

export function toggleNetworkConnectivity(isConnected) {
  return setNetworkConnectivity(!isConnected);
}

export function networkStatus(status) {
  return {
    type: NETWORK_STATUS,
    value: status,
  };
}
