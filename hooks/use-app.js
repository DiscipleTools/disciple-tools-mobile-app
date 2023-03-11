import { useCallback, useEffect } from "react";
import Constants from "expo-constants";
import * as Clipboard from "expo-clipboard";
import * as MailComposer from "expo-mail-composer";
import * as Notifications from "expo-notifications";

//import useAppState from "hooks/use-app-state";
//import useCache from "hooks/use-cache";
//import useDevice from "hooks/use-device";
import useToast from "hooks/use-toast";

//import { persistCache } from "helpers";

//import { CacheConstants, NotificationPermissionConstants } from "constants";

const useApp = () => {
  //const { isDevice } = useDevice();

  /////////////////////////////////////////////////////////////////////////////
  // ON-LAUNCH ACTIONS, INTERVALS, AND LISTENERS
  /////////////////////////////////////////////////////////////////////////////

  // Request permission for Push Notifications
  /*
  useEffect(() => {
    if (isDevice) {
      (async () => {
        const { status } = await Notifications.getPermissionsAsync();
        if (status === NotificationPermissionConstants.UNDETERMINED) {
          await Notifications.requestPermissionsAsync();
        };
        return;
      })();
    };
    return;
  }, []);
  */

  // Persist SWR in-memory cache to device storage on an interval
  /*
  useEffect(() => {
    const interval = setInterval(() => {
      //console.log(`Persist cache (runs every ${CacheConstants.INTERVAL} ms) -`, new Date());
      (async () => {
        await persistCache();
      })();
    }, CacheConstants.INTERVAL);
    return () => clearInterval(interval);
  }, []);
  */

  // Handle App State change(s)
  //useAppState();

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
