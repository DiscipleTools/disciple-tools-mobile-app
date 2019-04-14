import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import LoginScreen from '../screens/LoginScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import NewEditContactScreen from '../screens/NewEditContactScreen';
import ContactDetailsScreen from '../screens/ContactDetailsScreen';
import ContactsScreen from '../screens/ContactsScreen';

const AuthStack = createStackNavigator({ Login: LoginScreen });
const NewEditContactStack = createStackNavigator({
  Main: MainTabNavigator,
  NewEditContact: NewEditContactScreen,
});
const ContactDetailsStack = createStackNavigator({
  Main: MainTabNavigator,
  ContactDetails: ContactDetailsScreen,
});

export default createAppContainer(createSwitchNavigator(
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  {
    AuthLoading: AuthLoadingScreen,
    Auth: AuthStack,
    Main: MainTabNavigator,
    NewEditContact: NewEditContactStack,
    ContactDetails: ContactDetailsStack,
  },
  {
    initialRouteName: 'AuthLoading',
  },
));
