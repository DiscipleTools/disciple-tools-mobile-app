import { useEffect } from "react";

import NetInfo from "@react-native-community/netinfo";

import {
  setNetworkStatus,
  setNetworkConnectivity,
} from "store/actions/network.actions";


const useNetwork = () => {

  // Network Connectivity Listeners
  useEffect(() => {
    NetInfo.fetch().then((state) => {
      handleConnectivityChange(state.isConnected);
    });
    /*
    unsubscribe = NetInfo.addEventListener((state) =>
      utils.onlyExecuteLastCall(state.isConnected, handleConnectivityChange, 1000),
    );
    */
    return () => {
      //unsubscribe();
    };
  }, []);

  const handleConnectivityChange = (isConnected) => {
    if (isConnected) {
      // check if the phone has internet
      fetch("https://8.8.8.8")
        .then(() => {
          store.dispatch(setNetworkConnectivity(true));
          store.dispatch(setNetworkStatus(true));
        })
        .catch(() => {
          store.dispatch(setNetworkConnectivity(false));
          store.dispatch(setNetworkStatus(false));
        });
    } else {
      store.dispatch(setNetworkConnectivity(false));
      store.dispatch(setNetworkStatus(false));
    }
  };

};
export default useNetwork;