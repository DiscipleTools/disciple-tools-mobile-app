import { StyleSheet } from "react-native";
import Colors from "constants/Colors";

export const styles = StyleSheet.create({
  tabStyle: {
    backgroundColor: "#FFFFFF",
  },
  tabHeading: {
    //color: Colors.tintColor,
    color: "#000",
  },
  tabBarUnderline: {
    backgroundColor: Colors.tintColor,
  },
  headerIcon: {
    color: Colors.headerTintColor,
    paddingLeft: 10,
    paddingRight: 10 
  },
  headerRow: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    paddingTop: 5,
    paddingLeft: 5,
    paddingRight: 5,
  },
  headerStyle: {
    backgroundColor: Colors.tintColor,
    shadowColor: 'transparent',
  },
  headerTintColor: {
    color: Colors.headerTintColor,
  }
});