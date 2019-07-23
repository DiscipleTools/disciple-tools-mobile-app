import React from 'react';
import { Platform } from 'react-native';
import PropTypes from 'prop-types';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import ContactsScreen from '../screens/ContactsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import Storybook from '../storybook';

import Colors from '../constants/Colors';

const HomeStack = createStackNavigator({ Home: HomeScreen });
function HomeIcon({ focused }) {
  return (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-home' : 'md-home'}
    />
  );
}
HomeIcon.propTypes = {
  focused: PropTypes.bool.isRequired,
};
HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: HomeIcon,
  tabBarOptions: { activeTintColor: Colors.tabIconSelected },
};
HomeStack.propTypes = {
  focused: PropTypes.bool,
};

const ContactsStack = createStackNavigator({
  Contacts: ContactsScreen,
});
function ContactsIcon({ focused }) {
  return (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-contacts' : 'md-contacts'}
    />
  );
}
ContactsIcon.propTypes = {
  focused: PropTypes.bool.isRequired,
};
ContactsStack.navigationOptions = {
  tabBarLabel: 'Contacts',
  tabBarIcon: ContactsIcon,
  tabBarOptions: { activeTintColor: Colors.tabIconSelected },
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
  Storybook,
});
function SettingsIcon({ focused }) {
  return (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  );
}
SettingsIcon.propTypes = {
  focused: PropTypes.bool.isRequired,
};
SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: SettingsIcon,
  tabBarOptions: { activeTintColor: Colors.tabIconSelected },
};

export default createBottomTabNavigator({
  HomeStack,
  ContactsStack,
  SettingsStack,
});
