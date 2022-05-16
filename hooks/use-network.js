import { useDispatch, useSelector } from "react-redux";

import { useNetInfo } from "@react-native-community/netinfo";

import { setNetworkIsConnected } from "store/actions/network.actions";

const useNetwork = () => {

  const dispatch = useDispatch();
  const isConnectedUserSetting = useSelector(state => state.networkReducer.isConnected);
  const netInfo = useNetInfo();

  const isInitializing = (
    netInfo?.details === null &&
    netInfo?.isInternetReachable === null &&
    netInfo?.isConnected === null &&
    netInfo?.type === "unknown"
  );

  // 'isConnected' is a combination of device connectivity and user setting
  const isConnected = (
    netInfo?.isConnected &&
    netInfo?.isInternetReachable &&
    isConnectedUserSetting !== false
  );

  const toggleNetwork = (_isConnected) => dispatch(setNetworkIsConnected(_isConnected));

  // return 'isInitializing' and 'isConnected' both because the consideration
  // of 'isConnected' is different per <OfflineBar /> vs. 'use-request-queue'
  // ie, do *not* display <OfflineBar /> 'isInitializing' is true
  return {
    isInitializing,
    isConnected,
    toggleNetwork
  };
};
export default useNetwork;