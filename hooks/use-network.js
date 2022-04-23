import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useNetInfo } from "@react-native-community/netinfo";

import { setNetworkIsConnected } from "store/actions/network.actions";

const useNetwork = () => {
  const dispatch = useDispatch();
  const _isConnected = useSelector(
    (state) => state.networkReducer.isConnected
  );
  const netInfo = useNetInfo();

  const toggleNetwork = () => dispatch(setNetworkIsConnected(!_isConnected));

  const isConnected = netInfo?.isInternetReachable && _isConnected !== false;

  return useMemo (() => ({
    isConnected,
    toggleNetwork,
  }), [netInfo?.isInternetReachable, _isConnected]);
  return {
  };
};
export default useNetwork;
