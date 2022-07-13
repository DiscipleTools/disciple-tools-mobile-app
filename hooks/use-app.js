import { useCallback, useEffect } from "react";
import Constants from "expo-constants";
import * as Clipboard from "expo-clipboard";
import * as MailComposer from "expo-mail-composer";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";

import useAppState from "hooks/use-app-state";
import useCache from "hooks/use-cache";
import useDevice from "hooks/use-device";
import useToast from "hooks/use-toast";

import { CACHE_INTERVAL, NotificationPermissionConstants } from "constants";

const useApp = () => {
  /////////////////////////////////////////////////////////////////////////////
  // ON-LAUNCH AND LISTENER METHODS
  /////////////////////////////////////////////////////////////////////////////

  // Dispay splash screen (keep visible until iniital screens ready to render)
  const displaySplashScreen = useCallback(async () => {
    try {
      await SplashScreen.preventAutoHideAsync();
    } catch (e) {
      console.warn(e);
    }
  }, []);
  useEffect(() => {
    displaySplashScreen();
    return;
  }, []);

  // Request permission for Push Notifications
  const { isDevice } = useDevice();
  const requestNotificationPermissions = async () => {
    if (isDevice) {
      const { status } = await Notifications.getPermissionsAsync();
      if (status === NotificationPermissionConstants.UNDETERMINED) {
        await Notifications.requestPermissionsAsync();
      }
      return;
    }
  };
  useEffect(() => {
    requestNotificationPermissions();
    return;
  }, []);

  // Rehydrate in-memory cache on App launch
  const { onAppBackgroundCallback, onAppForegroundCallback } = useCache();
  useEffect(() => {
    onAppForegroundCallback();
    return;
  }, []);

  // Handle App State changes
  useAppState({ onAppForegroundCallback, onAppBackgroundCallback });

  // Periodically sync in-memory cache with persistent storage
  useEffect(() => {
    const id = setInterval(onAppBackgroundCallback, CACHE_INTERVAL);
    return () => clearInterval(id);
  }, []);

  /////////////////////////////////////////////////////////////////////////////
  // GENERAL PURPOSE APP METHODS
  /////////////////////////////////////////////////////////////////////////////

  // Draft an email
  const toast = useToast();
  const version = Constants.manifest.version;
  const draftNewSupportEmail = useCallback(({ to, subject, body } = {}) => {
    MailComposer.composeAsync({
      recipients: to ?? ["appsupport@disciple.tools"],
      subject: subject ?? `DT App Support: v${version}`,
      body: body ?? "",
    }).catch((error) => {
      toast(error.toString(), true);
    });
  }, []);

  // Copy text to clipboard
  const setClipboard = useCallback(
    (message) => Clipboard.setStringAsync(message),
    []
  );

  return {
    version,
    draftNewSupportEmail,
    setClipboard,
  };
};
export default useApp;
