import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import MainTabNavigator from './MainTabNavigator';
import LoginScreen from '../screens/LoginScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import QuestionnaireScreen from '../screens/QuestionnaireScreen';
import AttendanceScreen from '../screens/Group/AttendanceScreen';

const AuthStack = createStackNavigator({ Login: LoginScreen });
const QuestionnaireStack = createStackNavigator({ Question: QuestionnaireScreen });
const AttendanceStack = createStackNavigator({ Attendance: AttendanceScreen });

export default createAppContainer(
  createSwitchNavigator(
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    {
      AuthLoading: AuthLoadingScreen,
      Auth: AuthStack,
      Main: MainTabNavigator,
      Questionnaire: QuestionnaireStack,
      Attendance: AttendanceStack,
    },
    {
      initialRouteName: 'AuthLoading',
    },
  ),
);
