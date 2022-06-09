import { useEffect, useRef } from "react";

import * as Notifications from "expo-notifications";

import useAPI from "./use-api";
import useDevice from "hooks/use-device";
//import useType from "hooks/use-type";

//import { ScreenConstants } from "constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const usePushNotifications = ({ navigation }) => {
  const { deviceUID, isDevice, isAndroid, isIOS } = useDevice();
  //const { getTabScreenFromType } = useType();
  const { updateUser } = useAPI();
  const notificationListener = useRef();
  const responseListener = useRef();

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
      const res = await updateUser({
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
        console.log("************ RECVD NOTIFICATION ************");
        console.log(notification);
      });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("************ RESPONDED TO NOTIFICATION ************");
        const body = response?.notification?.request?.content?.body;
        console.log(`NOTIFICATION BODY: ${body}`);
        /*
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
*/
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
};
export default usePushNotifications;
