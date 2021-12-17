import { Linking } from "react-native";

const usePlugins = () => {

  // Mobile App Plugin
  // TODO:
  const mobileAppPluginEnabled = false; //true;
  const mobileAppPluginLink = () => Linking.openURL("https://disciple.tools/plugins/mobile-app/");

  // TODO: 2FA Plugin

  return {
    mobileAppPluginEnabled,
    mobileAppPluginLink,
  };
};
export default usePlugins;