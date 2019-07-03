import React from "react";
import { createStackNavigator } from "react-navigation";
import PropTypes from "prop-types";
import { Platform } from "react-native";

import Colors from "../../constants/Colors";

import TabBarIcon from "../../components/TabBarIcon";
import GroupsScreen from "./GroupsScreen";
import GroupDetailScreen from "./GroupDetailScreen";

function GroupsIcon({ focused }) {
  return (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-people" : "md-people"}
    />
  );
}
GroupsIcon.propTypes = {
  focused: PropTypes.bool.isRequired
};

const groupStack = createStackNavigator({
  GroupList: {
    screen: GroupsScreen
  },
  GroupDetail: {
    screen: GroupDetailScreen
  }
});
groupStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true,
    currentView = navigation.state.routes[navigation.state.index],
    currentViewName = currentView.routeName;
  if (currentViewName === "GroupDetail") {
    tabBarVisible = !(currentView.params && currentView.params.hideTabBar);
  }
  return {
    title: "Groups",
    tabBarIcon: GroupsIcon,
    tabBarVisible,
    tabBarOptions: { activeTintColor: Colors.tabIconSelected }
  };
};

export default groupStack;
