import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator, HeaderBackButton } from "@react-navigation/stack";
import { getFocusedRouteNameFromRoute, useNavigation } from "@react-navigation/native";

//import HomeScreen from 'screens/HomeScreen';
import PINScreen from "screens/PINScreen";
import CreateScreen from "screens/Posts/CreateScreen";
import ListScreen from "screens/Posts/ListScreen";
import DetailsScreen from "screens/Posts/DetailsScreen";
//import AttendanceScreen from 'screens/AttendanceScreen';
//import QuestionnaireScreen from 'screens/Posts/QuestionnaireScreen';
import NotificationsScreen from "screens/NotificationsScreen";
import SettingsScreen from "screens/SettingsScreen";

import TabBarIcon from "components/TabBarIcon";

import useI18N from "hooks/use-i18n";
//import useNotifications from 'hooks/use-notifications';
import usePIN from "hooks/use-pin";
import useTheme from "hooks/use-theme";

import { ScreenConstants, TypeConstants } from "constants";

const TabScreenConstants = Object.freeze({
  HOME: "HOME",
  CONTACTS: "CONTACTS",
  GROUPS: "GROUPS",
  NOTIFICATIONS: "NOTIFICATIONS",
  SETTINGS: "SETTINGS",
  //MORE: "MORE",
});

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
  console.log("$$$$$          MAIN TAB NAVIGATOR             $$$$$");
  console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");

  const { isDarkMode, theme } = useTheme();
  const { i18n, locale } = useI18N();
  const { PINConstants } = usePIN();
  /*
  const { notifications } = useNotifications();
  if (!notifications) return null;
  const unreadNotifications = notifications?.filter((notification) => {
    if (notification.is_new === '1') return notification;
  });
  const notificationsCount = unreadNotifications?.length > 0 ? unreadNotifications.length : null;
  */
  const notificationsCount = null;

  const screenOptions = {
    //safeAreaInsets: { top: 0 },
    headerStyle: {
      //backgroundColor: isDarkMode ? theme.background.primary : theme.brand.primary,
      backgroundColor: theme.background.primary,
      shadowColor: 'transparent',
    },
    //headerTintColor: isDarkMode ? theme.text.primary : theme.offLight,
    headerTintColor: theme.text.primary,
    headerBackTitleVisible: false
  };

  const ContactsStack = () => {
    return (
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name={ScreenConstants.LIST}
          component={ListScreen}
          options={{
            title: i18n.t("contactsScreen.contacts", { locale }),
          }}
          initialParams={{
            type: TypeConstants.CONTACT,
          }}
        />
        <Stack.Screen
          name={ScreenConstants.DETAILS}
          component={DetailsScreen}
          options={{
            title: "",
          }}
          initialParams={{
            type: TypeConstants.CONTACT,
          }}
        />
        <Stack.Screen
          name={ScreenConstants.CREATE}
          component={CreateScreen}
          options={{
            // TODO:better title term
            title: i18n.t("contactDetailScreen.addNewContact", { locale }),
          }}
          initialParams={{
            type: TypeConstants.CONTACT,
          }}
        />
      </Stack.Navigator>
    );
  };

  const GroupsStack = () => {
    return (
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name={ScreenConstants.LIST}
          component={ListScreen}
          options={{
            title: i18n.t("global.groups", { locale }),
          }}
          initialParams={{
            type: TypeConstants.GROUP,
          }}
        />
        <Stack.Screen
          name={ScreenConstants.DETAILS}
          component={DetailsScreen}
        />
        <Stack.Screen
          name={ScreenConstants.CREATE}
          component={CreateScreen}
          options={{
            // TODO:better title term
            title: i18n.t("groupDetailScreen.addNewGroup", { locale }),
          }}
          initialParams={{
            type: TypeConstants.GROUP,
          }}
        />
      </Stack.Navigator>
    );
  };

  /*
  const HomeStack = () => {
    return (
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name={ScreenConstants.HOME}
          component={HomeScreen}
          options={{
            // TODO: translate
            title: 'Home',
          }}
        />
      </Stack.Navigator>
    );
  };

  // TODO: Dynamically generate Post Screens based on availablility
  // For anything non-Contact/Group, pass in Route param to identify the POST_TYPE
  const MoreStack = () => {
    return (
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name={ScreenConstants.DETAILS}
          component={DetailsScreen}
          options={{
            title: '',
          }}
        />
      </Stack.Navigator>
    );
  };
  */

  const NotificationsStack = () => {
    return (
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name={ScreenConstants.NOTIFICATIONS}
          component={NotificationsScreen}
          options={{
            title: i18n.t("notificationsScreen.notifications", { locale }),
          }}
          initialParams={{
            type: TypeConstants.NOTIFICATION,
          }}
        />
      </Stack.Navigator>
    );
  };

  const SettingsStack = () => {
    const navigation = useNavigation();
    const overrideScreenOptions = { ...screenOptions};
    overrideScreenOptions["headerBackTitle"] = i18n.t("settingsScreen.settings", { locale });
    overrideScreenOptions["title"] = "";
    overrideScreenOptions["headerStyle"] = {
      ...screenOptions.headerStyle,
      shadowColor: "transparent",
    };
    return (
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name={ScreenConstants.SETTINGS}
          component={SettingsScreen}
          options={{
            title: i18n.t("settingsScreen.settings", { locale }),
          }}
        />
        <Stack.Screen
          name={ScreenConstants.PIN}
          options={{
            title: null,
            headerBackTitle: i18n.t("settingsScreen.settings", { locale }),
          }}
        >
          {(props) => <PINScreen {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    );
  };

  const PINStack = () => {
    const navigation = useNavigation();
    const overrideScreenOptions = { ...screenOptions};
    overrideScreenOptions["headerBackTitle"] = i18n.t("settingsScreen.settings", { locale });
    overrideScreenOptions["title"] = "";
    overrideScreenOptions["headerStyle"] = {
      ...screenOptions.headerStyle,
      shadowColor: "transparent",
    };
    return (
      <Stack.Navigator screenOptions={overrideScreenOptions}>
        <Stack.Screen
          name={ScreenConstants.PIN}
          options={{
            headerLeft: (props) => (
              <HeaderBackButton
                {...props}
                onPress={() => {
                  navigation.navigate("Settings");
                }}
              />
            ),
          }}
        >
          {(props) => <PINScreen {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    );
  };

  const Navigator = () => (
    <Tab.Navigator
      initialRouteName={TabScreenConstants.CONTACTS}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: isDarkMode ? theme.highlight : theme.text.primary,
        tabBarStyle: {
          //transform: isRTL ? [{scaleX: -1}] : null,
          backgroundColor: theme.background.primary,
          borderTopColor: theme.divider,
          display:
            [ScreenConstants.PIN].includes(getFocusedRouteNameFromRoute(route))
              ? "none"
              : "flex",
        },
        tabBarButton: [ScreenConstants.PIN].includes(route?.name)
          ? () => {
              return null;
            }
          : undefined,
      })}
    >
      {/*
      <Tab.Screen
        name={ScreenConstants.HOME}
        component={HomeStack}
        options={{
          // TODO: translate
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused, color, size }) => (
            <TabBarIcon type="MaterialCommunityIcons" name="home-analytics" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name={ScreenConstants.MORE}
        component={MoreStack}
        options={{
          // TODO: translate
          tabBarLabel: 'More',
          tabBarIcon: ({ focused, color, size }) => (
            <TabBarIcon type="Feather" name="more-horizontal" focused={focused} />
          ),
        }}
      />
      */}
      <Tab.Screen
        name={TabScreenConstants.CONTACTS}
        component={ContactsStack}
        options={{
          tabBarLabel: i18n.t("contactsScreen.contacts", { locale }),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon type="FontAwesome" name="user" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name={TabScreenConstants.GROUPS}
        component={GroupsStack}
        options={{
          tabBarLabel: i18n.t("global.groups", { locale }),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon type="FontAwesome" name="users" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name={TabScreenConstants.NOTIFICATIONS}
        component={NotificationsStack}
        options={{
          tabBarLabel: i18n.t("notificationsScreen.notifications", { locale }),
          tabBarIcon: ({ focused, color, size }) => (
            <TabBarIcon type="FontAwesome" name="bell" focused={focused} />
          ),
          tabBarBadge: notificationsCount,
        }}
      />
      <Tab.Screen
        name={TabScreenConstants.SETTINGS}
        component={SettingsStack}
        options={{
          tabBarLabel: i18n.t("settingsScreen.settings", { locale }),
          //tabBarLabel: ({ focused, color, size }) => (
          //  <Text style={{ color, fontSize: size }}>{i18n.t('settingsScreen.settings', { locale })}</Text>
          //),
          tabBarIcon: ({ focused, color, size }) => (
            <TabBarIcon type="FontAwesome" name="cog" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );

  return <Navigator />;
};
export default MainTabNavigator;
