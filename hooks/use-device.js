import { Platform } from "react-native";

// TODO: also use this for Expo Push Notification device info
const useDevice = () => {
  const isIOS = Platform.OS === "ios";
  const isAndroid = Platform.OS === "android";
  return {
    isAndroid,
    isIOS,
  };
};
export default useDevice;
