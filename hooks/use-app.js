import { useEffect } from "react";
import { LogBox } from "react-native";
import Constants from "expo-constants";
import * as Clipboard from "expo-clipboard";
import * as MailComposer from "expo-mail-composer";
import * as SplashScreen from "expo-splash-screen";

import useToast from "hooks/use-toast";

const useApp = () => {

  useEffect(() => {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
  }, [])
  // Ignore YellowBox warnings in DEV
  LogBox.ignoreAllLogs();

  // Keep the splash screen visible until ready to render navigation/AppNavigator
  useEffect(() => {
    (async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
      }
    })();
  }, []);

  const toast = useToast();
  const version = Constants.manifest.version;
  const draftNewSupportEmail = () => {
    MailComposer.composeAsync({
      recipients: ["appsupport@disciple.tools"],
      subject: `DT App Support: v${version}`,
      body: "",
    }).catch((error) => {
      toast(error.toString(), true);
    });
  };
  const setClipboard = (message) => Clipboard.setStringAsync(message);
  return {
    version,
    draftNewSupportEmail,
    setClipboard
  };
};
export default useApp;