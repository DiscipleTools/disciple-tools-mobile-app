import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useNetInfo } from "@react-native-community/netinfo";

import { setNetworkIsConnected } from "store/actions/network.actions";

import { persistCache } from "helpers";

const useNetwork = () => {
  const dispatch = useDispatch();
  const isConnectedUserSetting = useSelector(
    (state) => state.networkReducer.isConnected
  );
  const netInfo = useNetInfo();

  const isInitializing =
    (netInfo?.details === null &&
      netInfo?.isConnected === null &&
      netInfo?.isInternetReachable === null &&
      netInfo?.type === "unknown") ||
    (netInfo?.isConnected === true && netInfo?.isInternetReachable === null);

  // 'isConnected' is a combination of device connectivity and user setting
  const isConnected =
    netInfo?.isInternetReachable && isConnectedUserSetting !== false;

  /*
  // write cache to storage on network disconnect
  useEffect(() => {
    if (!isConnected && !isInitializing) {
      (async () => {
        await persistCache();
      })();
    };
  }, [isConnected, isInitializing]);
  */

  const toggleNetwork = useCallback((_isConnected) => {
    dispatch(setNetworkIsConnected(_isConnected));
  }, []);

  return {
    isInitializing,
    isConnected,
    toggleNetwork,
  };
};
export default useNetwork;
