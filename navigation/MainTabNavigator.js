import React from 'react';
// import { Platform } from 'react-native';
import PropTypes from 'prop-types';
import {
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation';
import TabBarIcon from '../components/TabBarIcon';

// import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from '../screens/SettingsScreen';
import Storybook from '../storybook';
import ContactStack from '../screens/Contact/index';
import GroupStack from '../screens/Group/index';

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
const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
  Storybook,
});
function SettingsIcon({ focused }) {
  return <TabBarIcon type="FontAwesome" name="cog" focused={focused} />;
}
SettingsIcon.propTypes = {
  focused: PropTypes.bool.isRequired,
};
SettingsStack.navigationOptions = {
  tabBarLabel: i18n.t('settingsScreen.settings'),
  tabBarIcon: SettingsIcon,
  tabBarOptions: { activeTintColor: Colors.tabIconSelected },
};

export default createBottomTabNavigator({
  // HomeStack,
  ContactStack,
  GroupStack,
  SettingsStack,
});
