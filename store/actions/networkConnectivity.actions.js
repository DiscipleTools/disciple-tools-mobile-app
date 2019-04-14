export function setNetworkConnectivity(isConnected) {
  if (isConnected) {
    console.log("*** BACK ONLINE! ***")
    return { type: 'ONLINE' }
  }
  console.log("*** GOING OFFLINE... ***")
  return { type: 'OFFLINE' }
}

export function toggleNetworkConnectivity(isConnected) {
  return setNetworkConnectivity(!isConnected)
}
