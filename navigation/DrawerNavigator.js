import React from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";

import TabNavigator from "./TabNavigator";
import NotificationsScreen from "screens/NotificationsScreen";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const NotificationsStack = () => {
    const screenOptions = null;
    return (
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{
            //title: i18n.t("notificationsScreen.notifications", { locale }),
          }}
          initialParams={{
            //type: TypeConstants.NOTIFICATION,
          }}
        />
      </Stack.Navigator>
    );
  };
      //<Drawer.Screen name="Contact" component={ContactStackNavigator} />
  return (
    <Drawer.Navigator
      initalRouteName="Home"
    >
      <Drawer.Screen name="Home" component={TabNavigator} />
      <Drawer.Screen name="Notifications" component={NotificationsStack} />
    </Drawer.Navigator>
  );
};
export default DrawerNavigator;