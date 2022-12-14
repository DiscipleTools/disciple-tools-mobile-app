import React, { useEffect } from "react";
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
  MoreIcon,
  UserIcon,
} from "components/Icon";

import PINScreen from "screens/PINScreen";
import HomeScreen from "screens/HomeScreen";
import AllActivityLogsScreen from "screens/AllActivityLogsScreen";
import ListScreen from "screens/Posts/ListScreen";
import CreateScreen from "screens/Posts/CreateScreen";
import ImportContactsScreen from "screens/Posts/ImportContactsScreen";
import DetailsScreen from "screens/Posts/DetailsScreen";
//import AttendanceScreen from 'screens/AttendanceScreen';
//import QuestionnaireScreen from 'screens/Posts/QuestionnaireScreen';
import CommentsActivityScreen from "screens/Posts/CommentsActivityScreen";
import MyUserScreen from "screens/MyUserScreen";
import StorageScreen from "screens/StorageScreen";
import NotificationsScreen from "screens/NotificationsScreen";
import MoreScreen from "screens/MoreScreen";

import useI18N from "hooks/use-i18n";
//import useMyUser from "hooks/use-my-user";
//import useNetwork from "hooks/use-network";
import useNotifications from "hooks/use-notifications";
import usePushNotifications from "hooks/use-push-notifications";
import useTheme from "hooks/use-theme";

import {
  AppConstants,
  ScreenConstants,
  TabScreenConstants,
  TypeConstants,
} from "constants";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = ({ navigation }) => {
  // subscribe to push notifications
  /*
   * NOTE: we include here rather than `use-app` in order to be under the Redux
   * Provider Context (this hook depends on other hooks which depend on Redux)
   */
  usePushNotifications();

  const { isDarkMode, theme } = useTheme();
  const { i18n, setLocale } = useI18N();
  const { hasNotifications } = useNotifications();
  //const { data: userData } = useMyUser();
  //const { isConnected } = useNetwork();

  /*
  // TODO: is this still necessary?
  useEffect(() => {
    if (!userData?.locale) return;
    if (isConnected) {
      if (userData.locale !== i18n?.locale) {
        setLocale(userData.locale);
      }
    }
    return;
  }, [userData?.locale]);
  */

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
          options={{
            title: "",
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
          //options={{
          //  ...TransitionPresets.ModalTransition,
          //}}
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
            title: i18n.t("global.importContact"),
          }}
          initialParams={{
            type: TypeConstants.CONTACT,
          }}
        />
        <Stack.Screen
          name={ScreenConstants.COMMENTS_ACTIVITY}
          component={CommentsActivityScreen}
          //options={{
          //  title: i18n.t("global.commentsActivity"),
          //  ...TransitionPresets.ModalTransition,
          //}}
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
        <Stack.Screen name={TabScreenConstants.HOME} component={HomeScreen} />
        <Stack.Screen
          name={ScreenConstants.ALL_ACTIVITY_LOGS}
          component={AllActivityLogsScreen}
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
      </Stack.Navigator>
    );
  };

  const MyUserStack = ({ route }) => {
    return (
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name={ScreenConstants.MY_USER}
          component={MyUserScreen}
          //options={{
          //mode: "modal",
          //cardStyle: {
          //  backgroundColor:"transparent",
          //  opacity: 0.99
          //}
          //}}
          options={{
            title: "",
          }}
          initialParams={{
            type: TypeConstants.MY_USER,
          }}
        />
        <Stack.Screen
          name={ScreenConstants.COMMENTS_ACTIVITY}
          component={CommentsActivityScreen}
          //options={{
          //  title: i18n.t("global.commentsActivity"),
          //  ...TransitionPresets.ModalTransition,
          //}}
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
          name={ScreenConstants.PIN}
          options={{
            title: null,
            //headerBackTitle: i18n.t("global.settings"),
          }}
        >
          {(props) => <PINScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen
          name={ScreenConstants.STORAGE}
          options={{
            title: i18n.t("global.storage")
          }}
        >
          {(props) => <StorageScreen {...props} />}
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
            title: i18n.t("global.notifications"),
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
            title: i18n.t("global.more"),
          }}
        />
        <Stack.Screen
          name={ScreenConstants.LIST}
          component={ListScreen}
          options={{
            title: "",
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
          //options={{
          //  ...TransitionPresets.ModalTransition,
          //}}
          initialParams={
            route?.params
              ? {
                  ...route.params,
                }
              : null
          }
        />
        <Stack.Screen
          name={ScreenConstants.COMMENTS_ACTIVITY}
          component={CommentsActivityScreen}
          //options={{
          //  title: i18n.t("global.commentsActivity"),
          //  ...TransitionPresets.ModalTransition,
          //}}
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
    if (focused)
      return {
        top: -10,
        height: 3,
        backgroundColor: isDarkMode ? theme.highlight : theme.brand.primary,
      };
    return null;
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
          //tabBarLabel: i18n.t("global.home"),
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
          //tabBarLabel: i18n.t("global.contacts"),
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
          //tabBarLabel: i18n.t("global.groups"),
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
        name={TabScreenConstants.MY_USER}
        component={MyUserStack}
        initialParams={{
          type: TypeConstants.MY_USER,
        }}
        options={{
          //unmountOnBlur: true,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color }) => (
            <View>
              <View style={indicatorStyle(focused)} />
              <UserIcon style={{ color }} />
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
                  name: TabScreenConstants.MY_USER,
                  params: {
                    screen: ScreenConstants.MY_USER,
                    type: TypeConstants.MY_USER,
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
          //tabBarLabel: i18n.t("global.notifications"),
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
          //tabBarLabel: i18n.t("global.more"),
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
const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.i18n?.locale === nextProps.i18n?.locale &&
    prevProps.theme?.mode === nextProps.theme?.mode &&
    prevProps.theme?.brand?.primary === nextProps.theme?.brand?.primary
  );
};
export default React.memo(TabNavigator, areEqual);
