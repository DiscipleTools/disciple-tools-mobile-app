import React from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

import { HomeIcon, AccountIcon, AccountsIcon, MoreIcon } from "components/Icon";
import HomeScreen from "screens/HomeScreen";
import MoreScreen from "screens/MoreScreen";
import PINScreen from "screens/PINScreen";
import CreateScreen from "screens/Posts/CreateScreen";
import ImportContactsScreen from "screens/Posts/ImportContactsScreen";
import ListScreen from "screens/Posts/ListScreen";
import DetailsScreen from "screens/Posts/DetailsScreen";
//import AttendanceScreen from 'screens/AttendanceScreen';
//import QuestionnaireScreen from 'screens/Posts/QuestionnaireScreen';
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
            // TODO:better title term
            title: i18n.t("global.addNewContact", { locale }),
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
      </Stack.Navigator>
    );
  };

  const HomeStack = () => {
    return (
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name={TabScreenConstants.HOME}
          component={HomeScreen}
          options={{
            title: AppConstants.NAME,
          }}
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
      </Stack.Navigator>
    );
  };

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
            ScreenConstants.NOTIFICATIONS,
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
          tabBarLabel: i18n.t("global.home", { locale }),
          tabBarIcon: ({ focused, color }) => (
            <View>
              <HomeIcon style={{ color }} />
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
      />
      <Tab.Screen
        name={TabScreenConstants.CONTACTS}
        component={PostStack}
        initialParams={{
          type: TypeConstants.CONTACT,
        }}
        options={{
          //unmountOnBlur: true,
          tabBarLabel: i18n.t("global.contacts", { locale }),
          tabBarIcon: ({ focused, color }) => (
            <View>
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
          tabBarLabel: i18n.t("global.groups", { locale }),
          tabBarIcon: ({ focused, color }) => (
            <View>
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
        name={TabScreenConstants.MORE}
        component={MoreStack}
        options={{
          tabBarLabel: i18n.t("global.more", { locale }),
          tabBarIcon: ({ focused, color }) => (
            <View>
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
                  params: {
                    screen: TabScreenConstants.MORE,
                  },
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
