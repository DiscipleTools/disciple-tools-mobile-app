import { Platform } from "react-native";

import * as Device from 'expo-device';

// TODO: also use this for Expo Push Notification device info
const useDevice = () => {
  const isIOS = Platform.OS === "ios";
  const isAndroid = Platform.OS === "android";
  return {
    isDevice: Device.isDevice,
    isAndroid,
    isIOS,
  };
};
export default useDevice;
