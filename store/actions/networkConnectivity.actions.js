export function setNetworkConnectivity(isConnected) {
  if (isConnected) {
    return { type: 'ONLINE' };
  }
  return { type: 'OFFLINE' };
}

export function toggleNetworkConnectivity(isConnected) {
  return setNetworkConnectivity(!isConnected);
}
