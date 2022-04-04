import React from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

import {
  HomeIcon,
  AccountIcon,
  AccountsIcon,
  BellIcon,
  MoreIcon
} from "components/Icon";
import HomeScreen from "screens/HomeScreen";
import MoreScreen from "screens/MoreScreen";
import PINScreen from "screens/PINScreen";
import CreateScreen from "screens/Posts/CreateScreen";
import ImportContactsScreen from "screens/Posts/ImportContactsScreen";
import ListScreen from "screens/Posts/ListScreen";
import DetailsScreen from "screens/Posts/DetailsScreen";
//import AttendanceScreen from 'screens/AttendanceScreen';
//import QuestionnaireScreen from 'screens/Posts/QuestionnaireScreen';
import CommentsActivityScreen from "screens/CommentsActivityScreen";
import NotificationsScreen from "screens/NotificationsScreen";
import SettingsScreen from "screens/SettingsScreen";

import useI18N from "hooks/use-i18n";
import useNotifications from "hooks/use-notifications";
import useTheme from "hooks/use-theme";

import {
  AppConstants,
  ScreenConstants,
  TabScreenConstants,
  TypeConstants,
} from "constants";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
  console.log("$$$$$          MAIN TAB NAVIGATOR             $$$$$");
  console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");

  const { isDarkMode, theme } = useTheme();
  const { i18n, isRTL, locale } = useI18N();
  const { hasNotifications } = useNotifications();

  const screenOptions = {
    headerStyle: {
      backgroundColor: theme.background.primary,
      shadowColor: "transparent",
    },
    headerTintColor: theme.text.primary,
    headerBackTitleVisible: false,
    // use modals by default
    //gestureEnabled: true,
    //...TransitionPresets.ModalTransition,
  };

  const PostStack = ({ route }) => {
    return (
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name={ScreenConstants.LIST}
          component={ListScreen}
          //options={{ headerShown: false }}
          initialParams={
            route?.params
              ? {
                  ...route.params,
                }
              : null
          }
        />
        <Stack.Screen
          name={ScreenConstants.DETAILS}
          component={DetailsScreen}
          //options={{ presentation: 'card' }}
          initialParams={
            route?.params
              ? {
                  ...route.params,
                }
              : null
          }
        />
        <Stack.Screen
          name={ScreenConstants.CREATE}
          component={CreateScreen}
          options={{
            ...TransitionPresets.ModalTransition,
          }}
          initialParams={
            route?.params
              ? {
                  ...route.params,
                }
              : null
          }
        />
        <Stack.Screen
          name={ScreenConstants.IMPORT}
          component={ImportContactsScreen}
          options={{
            // TODO:better title term
            title: i18n.t("global.importContact", { locale }),
          }}
          initialParams={{
            type: TypeConstants.CONTACT,
          }}
        />
        <Stack.Screen
          name={ScreenConstants.COMMENTS_ACTIVITY}
          component={CommentsActivityScreen}
          options={{
            title: i18n.t("global.commentsActivity", { locale }),
            ...TransitionPresets.ModalTransition,
          }}
          initialParams={
            route?.params
              ? {
                  ...route.params,
                }
              : null
          }
        />
      </Stack.Navigator>
    );
  };

  const HomeStack = () => {
    return (
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name={TabScreenConstants.HOME}
          component={HomeScreen}
        />
        <Stack.Screen
          name={TabScreenConstants.CONTACTS}
          component={PostStack}
          initialParams={{
            type: TypeConstants.CONTACT,
          }}
        />
        <Stack.Screen
          name={TabScreenConstants.GROUPS}
          component={PostStack}
          initialParams={{
            type: TypeConstants.GROUP,
          }}
        />
        <Stack.Screen
          name={ScreenConstants.NOTIFICATIONS}
          component={NotificationsScreen}
          //options={{ presentation: 'transparentModal' }}
          options={{
            title: i18n.t("global.notifications", { locale }),
          }}
          initialParams={{
            type: TypeConstants.NOTIFICATION,
          }}
        />
        <Stack.Screen
          name={ScreenConstants.SETTINGS}
          component={SettingsScreen}
          //options={{
          //mode: "modal",
          //headerMode: "none",
          //cardStyle: {
          //  backgroundColor:"transparent",
          //  opacity: 0.99
          //}
          //}}
          options={{
            title: i18n.t("global.settings", { locale }),
          }}
          initialParams={{
            type: TypeConstants.SETTINGS,
          }}
        />
        <Stack.Screen
          name={ScreenConstants.PIN}
          options={{
            title: null,
            headerBackTitle: i18n.t("global.settings", { locale }),
          }}
        >
          {(props) => <PINScreen {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    );
  };

  const NotificationsStack = ({ route }) => {
    return (
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name={TabScreenConstants.NOTIFICATIONS}
          component={NotificationsScreen}
          options={{
            title: i18n.t("global.notifications", { locale }),
          }}
          initialParams={{
            type: TypeConstants.NOTIFICATION,
          }}
        />
      </Stack.Navigator>
    );
  };

  const MoreStack = ({ route }) => {
    return (
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name={TabScreenConstants.MORE}
          component={MoreScreen}
          options={{
            title: i18n.t("global.more", { locale }),
          }}
        />
        <Stack.Screen
          name={ScreenConstants.LIST}
          component={ListScreen}
          initialParams={
            route?.params
              ? {
                  ...route.params,
                }
              : null
          }
        />
        <Stack.Screen
          name={ScreenConstants.DETAILS}
          component={DetailsScreen}
          initialParams={
            route?.params
              ? {
                  ...route.params,
                }
              : null
          }
        />
        <Stack.Screen
          name={ScreenConstants.CREATE}
          component={CreateScreen}
          options={{
            ...TransitionPresets.ModalTransition,
          }}
          initialParams={
            route?.params
              ? {
                  ...route.params,
                }
              : null
          }
        />
      </Stack.Navigator>
    );
  };

  const indicatorStyle = (focused) => {
    if (focused) return {
      top: -10,
      height: 3,
      backgroundColor: isDarkMode
          ? theme.highlight
          : theme.brand.primary,
    };
    return null;
  }

  return (
    <Tab.Navigator
      initialRouteName={TabScreenConstants.HOME}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: isDarkMode
          ? theme.highlight
          : theme.brand.primary,
        tabBarStyle: {
          // NOTE: no longer necessary bc handled automatically when 'I18nManager.isRTL' is set
          //transform: isRTL ? [{scaleX: -1}] : null,
          backgroundColor: theme.background.primary,
          borderTopColor: theme.divider,
          display: [
            ScreenConstants.PIN,
            ScreenConstants.SETTINGS,
            ScreenConstants.COMMENTS_ACTIVITY,
          ].includes(getFocusedRouteNameFromRoute(route))
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
      <Tab.Screen
        name={TabScreenConstants.HOME}
        component={HomeStack}
        options={{
          tabBarShowLabel: false,
          //tabBarLabel: i18n.t("global.home", { locale }),
          tabBarIcon: ({ focused, color }) => (
            <View>
              <View style={indicatorStyle(focused)} />
              <HomeIcon style={{ color }} />
            </View>
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: TabScreenConstants.HOME,
                },
              ],
            });
          },
        })}
      />
      <Tab.Screen
        name={TabScreenConstants.CONTACTS}
        component={PostStack}
        initialParams={{
          type: TypeConstants.CONTACT,
        }}
        options={{
          //unmountOnBlur: true,
          tabBarShowLabel: false,
          //tabBarLabel: i18n.t("global.contacts", { locale }),
          tabBarIcon: ({ focused, color }) => (
            <View>
              <View style={indicatorStyle(focused)} />
              <AccountIcon style={{ color }} />
            </View>
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: TabScreenConstants.CONTACTS,
                  params: {
                    screen: ScreenConstants.LIST,
                    type: TypeConstants.CONTACT,
                  },
                },
              ],
            });
          },
        })}
      />
      <Tab.Screen
        name={TabScreenConstants.GROUPS}
        component={PostStack}
        initialParams={{
          type: TypeConstants.GROUP,
        }}
        options={{
          tabBarShowLabel: false,
          //tabBarLabel: i18n.t("global.groups", { locale }),
          tabBarIcon: ({ focused, color }) => (
            <View>
              <View style={indicatorStyle(focused)} />
              <AccountsIcon style={{ color }} />
            </View>
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: TabScreenConstants.GROUPS,
                  params: {
                    screen: ScreenConstants.LIST,
                    type: TypeConstants.GROUP,
                  },
                },
              ],
            });
          },
        })}
      />
      <Tab.Screen
        name={TabScreenConstants.NOTIFICATIONS}
        component={NotificationsStack}
        options={{
          tabBarShowLabel: false,
          //tabBarLabel: i18n.t("global.notifications", { locale }),
          tabBarIcon: ({ focused, color }) => (
            <View>
              <View style={indicatorStyle(focused)} />
              <BellIcon style={{ color }} />
            </View>
          ),
          tabBarBadge: hasNotifications ? "" : null,
          tabBarBadgeStyle: {
            marginTop: 5,
            marginStart: 7,
            minWidth: 10,
            maxHeight: 10,
            borderRadius: 5,
          },
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: TabScreenConstants.NOTIFICATIONS,
                },
              ],
            });
          },
        })}
      />
      <Tab.Screen
        name={TabScreenConstants.MORE}
        component={MoreStack}
        options={{
          tabBarShowLabel: false,
          //tabBarLabel: i18n.t("global.more", { locale }),
          tabBarIcon: ({ focused, color }) => (
            <View>
              <View style={indicatorStyle(focused)} />
              <MoreIcon style={{ color }} />
            </View>
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: TabScreenConstants.MORE,
                },
              ],
            });
          },
        })}
      />
    </Tab.Navigator>
  );
};
export default TabNavigator;
