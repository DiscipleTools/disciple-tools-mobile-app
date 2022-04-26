import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useNetInfo } from "@react-native-community/netinfo";

import { setNetworkIsConnected } from "store/actions/network.actions";

const useNetwork = () => {
  const dispatch = useDispatch();
  const isConnectedUserSetting = useSelector(state => state.networkReducer.isConnected);
  const netInfo = useNetInfo();

  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const netInfoInitializing = (
      netInfo?.details === null &&
      netInfo?.isInternetReachable === null &&
      netInfo?.isConnected === null &&
      netInfo?.type === "unknown"
    );
    const _isConnected = netInfo?.isInternetReachable && isConnectedUserSetting !== false;
    if (isConnected !== _isConnected && !netInfoInitializing) setIsConnected(_isConnected);
  }, [netInfo?.isInternetReachable, isConnectedUserSetting]);

  const toggleNetwork = () => dispatch(setNetworkIsConnected(!isConnected));

  return useMemo (() => ({
    isConnected,
    toggleNetwork,
  }), [isConnected]);
};
export default useNetwork;
