import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import NetInfo, { useNetInfo } from "@react-native-community/netinfo";

import { NetworkConstants } from "constants";

import { setNetworkIsConnected } from "store/actions/network.actions";

import useI18N from "hooks/use-i18n";
import useToast from "hooks/use-toast";

const useNetwork = () => {

  const dispatch = useDispatch();
  const isConnectedUserSpecified = useSelector(state => state.networkReducer.isConnected);
  const netInfo = useNetInfo();

  /*
   * NOTE: consider device online IFF NetInfo 'isConnected',
   * AND the user has NOT manually specified as offline
   */
  const isConnected = netInfo?.isConnected && isConnectedUserSpecified !== false; 

  const { i18n } = useI18N();
  const toast = useToast();

  // TODO: move to App
  /*
  useEffect(() => {
    NetInfo.fetch().then(state => handleConnectivityChange(state.isConnected));
    const unsubscribe = NetInfo.addEventListener(state => handleConnectivityChange(state.isConnected));
    return () => {
      unsubscribe();
    };
  }, []);
  */

  /*
   * Handle network connectivity changes, and fetch a common public URL
   * (eg, https://8.8.8.8) to double-check Internet connectivity
   */
  const handleConnectivityChange = async(isConnected) => {
    if (isConnected) {
      try {
        toast(i18n.t("settingsScreen.networkAvailable"));
        await fetch(NetworkConstants.NETWORK_TEST_URL);
        dispatch(setNetworkIsConnected(true));
      } catch(error) {
        //console.error(error);
        toast(i18n.t("settingsScreen.networkUnavailable"), true);
        dispatch(setNetworkIsConnected(false));
      }
    } else {
      toast(i18n.t("settingsScreen.networkUnavailable"), true);
      dispatch(setNetworkIsConnected(false));
    }
  };

  /*
   * Manually toggle network connectivity
   */
  const toggleNetwork = () => handleConnectivityChange(!isConnected);

  return {
    isConnected: isConnected !== false,
    toggleNetwork,
  };
};
export default useNetwork;