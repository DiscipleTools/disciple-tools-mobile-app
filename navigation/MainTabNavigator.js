import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createStackNavigator,
  HeaderBackButton,
} from "@react-navigation/stack";
import { getFocusedRouteNameFromRoute, useNavigation } from "@react-navigation/native";

//import HomeScreen from 'screens/HomeScreen';
import PINScreen from "screens/PINScreen";
import ImportContactsScreen from "screens/Posts/ImportContactsScreen";
import CreateScreen from "screens/Posts/CreateScreen";
import ListScreen from "screens/Posts/ListScreen";
import DetailsScreen from "screens/Posts/DetailsScreen";
import CommentsActivityScreen from "screens/Posts/CommentsActivityScreen";
//import AttendanceScreen from 'screens/AttendanceScreen';
//import QuestionnaireScreen from 'screens/Posts/QuestionnaireScreen';
import NotificationsScreen from "screens/NotificationsScreen";
import SettingsScreen from "screens/SettingsScreen";

import TabBarIcon from "components/TabBarIcon";
import Colors from "constants/Colors";

import useI18N from "hooks/useI18N.js";
//import useNotifications from 'hooks/useNotifications.js';
import usePIN from "hooks/usePIN.js";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
  console.log("$$$$$          MAIN TAB NAVIGATOR             $$$$$");
  console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");

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

  const screenOptionStyle = {
    headerStyle: {
      backgroundColor: Colors.tintColor,
      shadowColor: 'transparent',
    },
    headerTintColor: Colors.headerTintColor,
    headerBackTitleVisible: false
  };

  const ContactsStack = () => {
    return (
      <Stack.Navigator screenOptions={screenOptionStyle}>
        <Stack.Screen
          name="Contacts"
          component={ListScreen}
          options={{
            title: i18n.t("contactsScreen.contacts", { locale }),
          }}
          initialParams={{
            type: "contacts",
          }}
        />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={{
            title: "",
          }}
          initialParams={{
            type: "contacts",
          }}
        />
        <Stack.Screen
          name="CommentsActivity"
          component={CommentsActivityScreen}
          options={{
            title: i18n.t("global.commentsActivity", { locale }),
          }}
          initialParams={{
            type: "contacts",
          }}
        />
        <Stack.Screen
          name="CreateContact"
          component={CreateScreen}
          options={{
            // TODO:better title term
            title: i18n.t("contactDetailScreen.addNewContact", { locale }),
          }}
          initialParams={{
            type: "createContact",
          }}
        />
        <Stack.Screen
          name="ImportContacts"
          component={ImportContactsScreen}
          options={{
            // TODO:better title term
            title: i18n.t("contactDetailScreen.importContact", { locale }),
          }}
          initialParams={{
            type: "import",
          }}
        />
      </Stack.Navigator>
    );
  };

  const GroupsStack = () => {
    return (
      <Stack.Navigator screenOptions={screenOptionStyle}>
        <Stack.Screen
          name="Groups"
          component={ListScreen}
          options={{
            title: i18n.t("global.groups", { locale }),
          }}
          initialParams={{
            type: "groups", // TODO: Constants
          }}
        />
        <Stack.Screen
          name="CommentsActivity"
          component={CommentsActivityScreen}
          options={{
            title: i18n.t("global.commentsActivity", { locale }),
          }}
          initialParams={{
            type: "groups",
          }}
        />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          //options={({ route }) => ({
          //  title: route.params.groupName
          //})}
        />
      </Stack.Navigator>
    );
  };

  /*
  const HomeStack = () => {
    return (
      <Stack.Navigator screenOptions={screenOptionStyle}>
        <Stack.Screen
          name="Home"
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
      <Stack.Navigator screenOptions={screenOptionStyle}>
        <Stack.Screen
          name="More"
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
      <Stack.Navigator screenOptions={screenOptionStyle}>
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{
            title: i18n.t("notificationsScreen.notifications", { locale }),
          }}
          initialParams={{
            type: "notifications",
          }}
        />
      </Stack.Navigator>
    );
  };

  const SettingsStack = () => {
    const navigation = useNavigation();
    const overrideScreenOptionStyle = { ...screenOptionStyle };
    overrideScreenOptionStyle["headerBackTitle"] = i18n.t("settingsScreen.settings", { locale });
    overrideScreenOptionStyle["title"] = "";
    overrideScreenOptionStyle["headerStyle"] = {
      ...screenOptionStyle.headerStyle,
      shadowColor: "transparent",
    };
    return (
      <Stack.Navigator screenOptions={screenOptionStyle}>
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: i18n.t("settingsScreen.settings", { locale }),
          }}
        />
        <Stack.Screen
          name={PINConstants.SCREEN}
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
    const overrideScreenOptionStyle = { ...screenOptionStyle };
    overrideScreenOptionStyle["headerBackTitle"] = i18n.t("settingsScreen.settings", { locale });
    overrideScreenOptionStyle["title"] = "";
    overrideScreenOptionStyle["headerStyle"] = {
      ...screenOptionStyle.headerStyle,
      shadowColor: "transparent",
    };
    return (
      <Stack.Navigator screenOptions={overrideScreenOptionStyle}>
        <Stack.Screen
          name="PIN"
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

  return (
    <Tab.Navigator
      initialRouteName={"Contacts"}
      //initialRouteName={'Settings'}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#365D86",
        tabBarStyle: {
          display:
            ["CommentsActivity","PIN"].includes(getFocusedRouteNameFromRoute(route))
              ? "none"
              : "flex",
        },
        tabBarButton: ["PIN"].includes(route?.name)
          ? () => {
              return null;
            }
          : undefined,
      })}
    >
      {/*
      <Tab.Screen
        name="Home"
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
        name="More"
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
        name="Contacts"
        component={ContactsStack}
        options={{
          tabBarLabel: i18n.t("contactsScreen.contacts", { locale }),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon type="FontAwesome" name="user" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Groups"
        component={GroupsStack}
        options={{
          tabBarLabel: i18n.t("global.groups", { locale }),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon type="FontAwesome" name="users" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
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
        name="Settings"
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
      <Tab.Screen
        name="PIN"
        component={PINStack}
        options={{
          tabBarVisible: false,
        }}
      />
    </Tab.Navigator>
  );
};
export default MainTabNavigator;
