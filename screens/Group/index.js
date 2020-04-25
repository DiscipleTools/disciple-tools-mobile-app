import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import PropTypes from 'prop-types';

import Colors from '../../constants/Colors';

import TabBarIcon from '../../components/TabBarIcon';
import GroupsScreen from './GroupsScreen';
import GroupDetailScreen from './GroupDetailScreen';

import i18n from '../../languages';

function GroupsIcon({ focused }) {
  return <TabBarIcon type="FontAwesome" name="users" focused={focused} />;
}
GroupsIcon.propTypes = {
  focused: PropTypes.bool.isRequired,
};

const groupStack = createStackNavigator({
  GroupList: {
    screen: GroupsScreen,
    navigationOptions: () => ({
      title: i18n.t('global.groups'),
    }),
  },
  GroupDetail: {
    screen: GroupDetailScreen,
  },
});
groupStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  const currentView = navigation.state.routes[navigation.state.index];
  const currentViewName = currentView.routeName;
  if (currentViewName === 'GroupDetail') {
    tabBarVisible = !(currentView.params && currentView.params.hideTabBar);
  }
  return {
    title: i18n.t('global.groups'),
    tabBarIcon: GroupsIcon,
    tabBarVisible,
    tabBarOptions: { activeTintColor: Colors.tabIconSelected },
  };
};

export default groupStack;
