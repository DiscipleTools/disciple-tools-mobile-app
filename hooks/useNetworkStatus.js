import { useDispatch, useSelector } from "react-redux";
// TODO: rename
import { toggleNetworkConnectivity as _toggleNetwork } from "store/actions/network.actions";

import useI18N from "hooks/useI18N";
import useToast from "hooks/useToast";

const useNetworkStatus = () => {
  const dispatch = useDispatch();

  const { i18n } = useI18N();
  const toast = useToast();

  // TODO: useNetInfo() causes flickering re-render
  //const netInfo = useNetInfo();
  //const isConnected = netInfo.isConnected.toString() === 'true';
  const isConnected = true;
  // user specified offline in settings
  const isConnectedUser = useSelector(
    (state) => state.networkReducer.isConnected
  );

  const toggleNetwork = () => {
    dispatch(_toggleNetwork());
    toast(
      isConnected
        ? i18n.t("settingsScreen.networkUnavailable")
        : i18n.t("settingsScreen.networkAvailable"),
      isConnected
    );
  };

  // TODO: return 'online' and 'offline' for better readability
  return {
    isConnected: isConnected && isConnectedUser,
    toggleNetwork,
  };
};
export default useNetworkStatus;
