import { useMemo } from "react";
import { Platform } from "react-native";

import * as Device from "expo-device";

const useDevice = () => {
  const isIOS = Platform.OS === "ios";
  const isAndroid = Platform.OS === "android";
  // Construct a (somewhat) unique identifier for this particular device
  const deviceUID =
    (Device.manufacturer || "") +
    ":" +
    (Device.modelName || "") +
    ":" +
    (Device.deviceYearClass || "") +
    ":" +
    (Device.osName || "");
  const isDevice = Device?.isDevice;
  return useMemo(
    () => ({
      deviceUID,
      isDevice,
      isAndroid,
      isIOS,
    }),
    [deviceUID, isDevice, isIOS, isAndroid]
  );
};
export default useDevice;
