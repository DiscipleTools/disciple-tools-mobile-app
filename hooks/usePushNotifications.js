import React, { useEffect, useRef, useState } from "react";

import * as Notifications from "expo-notifications";

const usePushNotifications = () => {

  const [notifications, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  // Push Notification Listeners
  useEffect(() => {
    // Show incoming notifications when the app is in foreground
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
    // Notification is received while the app is running
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });
    // User interacted with notification
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        // TODO: Navigate to the appropriate screen on Notification click
        console.log(response);
      });
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);
};
export default usePushNotifications;