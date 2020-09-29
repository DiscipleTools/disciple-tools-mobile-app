import React from 'react';
// import { Platform } from 'react-native';
import PropTypes from 'prop-types';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import TabBarIcon from '../components/TabBarIcon';
import { View } from 'native-base';

// import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from '../screens/SettingsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import Storybook from '../storybook';
import ContactStack from '../screens/Contact/index';
import GroupStack from '../screens/Group/index';
import NotificationBadge from '../components/NotificationBadge';

import Colors from '../constants/Colors';
import i18n from '../languages';
/*
const HomeStack = createStackNavigator({ Home: HomeScreen });
function HomeIcon({ focused }) {
  return (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-home" : "md-home"}
    />
  );
}
HomeIcon.propTypes = {
  focused: PropTypes.bool.isRequired
};
HomeStack.navigationOptions = {
  tabBarLabel: "Home",
  tabBarIcon: HomeIcon,
  tabBarOptions: { activeTintColor: Colors.tabIconSelected }
};
HomeStack.propTypes = {
  focused: PropTypes.bool
};
*/
const NotificationsStack = createStackNavigator({
  NotificationList: {
    screen: NotificationsScreen,
    navigationOptions: () => ({
      title: i18n.t('notificationsScreen.notifications'),
    }),
  },
  Storybook,
});
function NotificationsIcon({ focused }) {
  return (
    <View style={{ flex: 1 }}>
      <NotificationBadge></NotificationBadge>
      <TabBarIcon type="FontAwesome" name="bell" focused={focused} />
    </View>
  );
}
NotificationsIcon.propTypes = {
  focused: PropTypes.bool.isRequired,
};
NotificationsStack.navigationOptions = () => ({
  title: i18n.t('notificationsScreen.notifications'),
  tabBarIcon: NotificationsIcon,
  tabBarOptions: { activeTintColor: Colors.tabIconSelected },
});

const SettingsStack = createStackNavigator({
  Settings: {
    screen: SettingsScreen,
    navigationOptions: () => ({
      title: i18n.t('settingsScreen.settings'),
    }),
  },
  Storybook,
});
function SettingsIcon({ focused }) {
  return <TabBarIcon type="FontAwesome" name="cog" focused={focused} />;
}
SettingsIcon.propTypes = {
  focused: PropTypes.bool.isRequired,
};
SettingsStack.navigationOptions = () => ({
  title: i18n.t('settingsScreen.settings'),
  tabBarIcon: SettingsIcon,
  tabBarOptions: { activeTintColor: Colors.tabIconSelected },
});

export default createBottomTabNavigator({
  // HomeStack,
  ContactStack,
  GroupStack,
  NotificationsStack,
  SettingsStack,
});
