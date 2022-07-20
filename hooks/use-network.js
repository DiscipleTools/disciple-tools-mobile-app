import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import NetInfo, { useNetInfo } from "@react-native-community/netinfo";

import useCache from "hooks/use-cache";

import { setNetworkIsConnected } from "store/actions/network.actions";

const useNetwork = () => {
  const { onAppBackgroundCallback } = useCache();
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

  const isConnectedNow = useCallback(async () => {
    const _netInfo = await NetInfo.fetch();
    return _netInfo?.isInternetReachable && isConnectedUserSetting !== false;
  }, [isConnectedUserSetting]);

  // write cache to local store upon network disconnect
  useEffect(() => {
    if (!isConnected && !isInitializing) {
      onAppBackgroundCallback();
    }
  }, [isConnected]);

  const toggleNetwork = useCallback((_isConnected) => {
    dispatch(setNetworkIsConnected(_isConnected));
  }, []);

  return {
    isInitializing,
    isConnected,
    isConnectedNow,
    toggleNetwork,
  };
};
export default useNetwork;
