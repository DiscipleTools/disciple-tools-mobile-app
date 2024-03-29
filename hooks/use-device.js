import { Platform } from "react-native";

import * as Device from "expo-device";

const useDevice = () => {
  const isIOS = Platform.OS === "ios";
  const isAndroid = Platform.OS === "android";
  // Construct a (somewhat) unique identifier for this particular device
  const deviceUID =
    (Device.brand || "") +
    ":" +
    (Device.modelName || "") +
    ":" +
    (Device.deviceYearClass || "") +
    ":" +
    (Device.osName || "");
  const isDevice = Device?.isDevice;
  return {
    deviceUID,
    isDevice,
    isAndroid,
    isIOS,
  };
};
export default useDevice;
