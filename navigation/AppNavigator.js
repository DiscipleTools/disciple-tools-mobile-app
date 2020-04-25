import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import MainTabNavigator from './MainTabNavigator';
import LoginScreen from '../screens/LoginScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';

const AuthStack = createStackNavigator({ Login: LoginScreen });

export default createAppContainer(
  createSwitchNavigator(
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    {
      AuthLoading: AuthLoadingScreen,
      Auth: AuthStack,
      Main: MainTabNavigator,
    },
    {
      initialRouteName: 'AuthLoading',
    },
  ),
);
