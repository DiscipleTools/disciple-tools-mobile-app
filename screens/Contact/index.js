import React from "react";
import { createStackNavigator } from "react-navigation";
import PropTypes from "prop-types";
import { Platform } from "react-native";

import Colors from "../../constants/Colors";

import TabBarIcon from "../../components/TabBarIcon";
import ContactsScreen from "./ContactsScreen";
import ContactDetailScreen from "./ContactDetailScreen";

function ContactsIcon({ focused }) {
  return (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-contacts" : "md-contacts"}
    />
  );
}
ContactsIcon.propTypes = {
  focused: PropTypes.bool.isRequired
};

const contactStack = createStackNavigator({
  ContactList: {
    screen: ContactsScreen
  },
  ContactDetail: {
    screen: ContactDetailScreen
  }
});
contactStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true,
    currentView = navigation.state.routes[navigation.state.index],
    currentViewName = currentView.routeName;
  if (currentViewName === "ContactDetail") {
    tabBarVisible = !(currentView.params && currentView.params.hideTabBar);
  }
  return {
    title: "Contacts",
    tabBarIcon: ContactsIcon,
    tabBarVisible,
    tabBarOptions: { activeTintColor: Colors.tabIconSelected }
  };
};

export default contactStack;
