import React from 'react';
import { createStackNavigator } from 'react-navigation';
import PropTypes from 'prop-types';

import Colors from '../../constants/Colors';

import TabBarIcon from '../../components/TabBarIcon';
import ContactsScreen from './ContactsScreen';
import ContactDetailScreen from './ContactDetailScreen';

import i18n from '../../languages';

function ContactsIcon({ focused }) {
  return <TabBarIcon type="FontAwesome" name="user" focused={focused} />;
}
ContactsIcon.propTypes = {
  focused: PropTypes.bool.isRequired,
};

const contactStack = createStackNavigator({
  ContactList: {
    screen: ContactsScreen,
    navigationOptions: () => ({
      title: i18n.t('contactsScreen.contacts'),
    }),
  },
  ContactDetail: {
    screen: ContactDetailScreen,
  },
});
contactStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  const currentView = navigation.state.routes[navigation.state.index];
  const currentViewName = currentView.routeName;
  if (currentViewName === 'ContactDetail') {
    tabBarVisible = !(currentView.params && currentView.params.hideTabBar);
  }
  return {
    title: i18n.t('contactsScreen.contacts'),
    tabBarIcon: ContactsIcon,
    tabBarVisible,
    tabBarOptions: { activeTintColor: Colors.tabIconSelected },
  };
};

export default contactStack;
