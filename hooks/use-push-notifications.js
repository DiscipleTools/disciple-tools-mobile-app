import { useCallback, useEffect, useRef } from "react";
//import { useNavigation } from "@react-navigation/native";

import * as Notifications from "expo-notifications";

import useAPI from "hooks/use-api";
import useDevice from "hooks/use-device";
import useNetwork from "hooks/use-network";
//import useType from "hooks/use-type";

import { NotificationPermissionConstants } from "constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const usePushNotifications = () => {
  const { deviceUID, isDevice, isAndroid, isIOS } = useDevice();
  const { isConnected } = useNetwork();
  const { updateUser } = useAPI();
  //const { getTabScreenFromType } = useType();
  //const navigation = useNavigation();
  const notificationListener = useRef();
  const responseListener = useRef();

  const registerForPushNotificationsAsync = useCallback(async () => {
    let token;
    if (isDevice) {
      const { status } = await Notifications.getPermissionsAsync();
      if (status === NotificationPermissionConstants.GRANTED) {
        token = (await Notifications.getExpoPushTokenAsync()).data;
        if (token) {
          /*
           * NOTE: API returns 500 if token is already registered (so we can
           * ignore the response, and just try to update on every app launch)
           */
          await updateUser({
            add_push_token: {
              device_id: deviceUID,
              token,
            },
          });
        }
      }
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
  }, []);

  useEffect(() => {
    if (isConnected) {
      registerForPushNotificationsAsync();
      // This listener is fired whenever a notification is received while the app is foregrounded
      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          console.log("************ RECVD NOTIFICATION ************");
          //console.log(notification);
          //console.log(notification?.request?.content?.data);
        });

      // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log("************ RESPONDED TO NOTIFICATION ************");
          //const body = response?.notification?.request?.content?.body;
          //console.log(`NOTIFICATION BODY: ${body}`);
          /*
        if (navigation) {
          //const data = response?.notification?.request?.content?.data;
          // TODO: parse HTML for the following: id, type
          const id = "";
          //const name = "";
          const type = "";
          const tabScreen = getTabScreenFromType(type);
          navigation.jumpTo(tabScreen, {
            screen: ScreenConstants.DETAILS,
            id,
            type,
          });
        };
        */
        });
      return () => {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }
    return;
  }, [isConnected]);
};
export default usePushNotifications;
