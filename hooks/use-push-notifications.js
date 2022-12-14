import { useEffect, useRef } from "react";

import * as Notifications from "expo-notifications";

import useAPI from "./use-api";
import useDevice from "hooks/use-device";
import useType from "hooks/use-type";
import { useNavigation, TabActions } from "@react-navigation/native";

import { ScreenConstants } from "constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const usePushNotifications = () => {
  const navigation = useNavigation();
  const { deviceUID, isDevice, isAndroid, isIOS } = useDevice();
  const { getTabScreenFromType } = useType();
  const { updateUser } = useAPI();
  const notificationListener = useRef();

  const registerForPushNotificationsAsync = async () => {
    let token;
    if (isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      await updateUser({
        add_push_token: {
          token,
          device_id: deviceUID,
        },
      });
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (isAndroid) {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  };

  const lastNotificationResponse = Notifications.useLastNotificationResponse();

  useEffect(() => {
    if (
      lastNotificationResponse &&
      lastNotificationResponse.notification.request.content.data &&
      lastNotificationResponse.actionIdentifier ===
        Notifications.DEFAULT_ACTION_IDENTIFIER
    ) {
      const data =
        lastNotificationResponse?.notification?.request?.content?.data;

      const id = data?.id ?? "";
      const type = data?.type ?? "";
      const tabScreen = getTabScreenFromType(type);

      const jumpToAction = TabActions.jumpTo(tabScreen, {
        screen: ScreenConstants.DETAILS,
        id,
        type,
      });
      navigation.dispatch(jumpToAction);
    }
  }, [lastNotificationResponse]);

  useEffect(() => {
    const run = async () => {
      registerForPushNotificationsAsync();
    };
    run();

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        // useNotifications and then force re-render when receiving a notification?
        //setNotification(notification);
        //console.log("************ RECVD NOTIFICATION ************");
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
    };
  }, []);
};
export default usePushNotifications;
