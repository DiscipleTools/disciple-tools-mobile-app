import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createSwitchNavigator,  createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import ContactsScreen from '../screens/ContactsScreen';
import SettingsScreen from '../screens/SettingsScreen';

import Colors from '../constants/Colors';

const HomeStack = createStackNavigator({ Home: HomeScreen, });
HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios' ? 'ios-home' : 'md-home'
      }
    />
  ),
  tabBarOptions: { activeTintColor:Colors.tabIconSelected },
};

const ContactsStack = createStackNavigator({
  Links: ContactsScreen,
});

ContactsStack.navigationOptions = {
  tabBarLabel: 'Contacts',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-contact' : 'md-perm-contact-cal'}
    />
  ),
  tabBarOptions: { activeTintColor:Colors.tabIconSelected },
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
  tabBarOptions: { activeTintColor:Colors.tabIconSelected },
};


export default createBottomTabNavigator({
  HomeStack,
  ContactsStack,
  SettingsStack,
});
