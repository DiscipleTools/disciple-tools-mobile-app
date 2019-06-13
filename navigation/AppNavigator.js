import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import LoginScreen from '../screens/LoginScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import ContactDetailScreen from '../screens/ContactDetailScreen';
import GroupDetailScreen from '../screens/GroupDetailScreen';

const AuthStack = createStackNavigator({ Login: LoginScreen });
const ContactDetailStack = createStackNavigator({
  Main: MainTabNavigator,
  ContactDetail: ContactDetailScreen,
});
const GroupDetailStack = createStackNavigator({
  Main: MainTabNavigator,
  GroupDetail: GroupDetailScreen,
});

export default createAppContainer(createSwitchNavigator(
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  {
    AuthLoading: AuthLoadingScreen,
    Auth: AuthStack,
    Main: MainTabNavigator,
    ContactDetail: ContactDetailStack,
    GroupDetail: GroupDetailStack,
  },
  {
    initialRouteName: 'AuthLoading',
  },
));
