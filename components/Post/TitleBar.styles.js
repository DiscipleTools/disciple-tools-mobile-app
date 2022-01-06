import { StyleSheet } from "react-native";
import Colors from "constants/Colors";

export const styles = StyleSheet.create({
  titleBar: {
    backgroundColor: Colors.primary,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    alignItems: "center",
  },
  title: {
    color: Colors.headerTintColor,
    fontSize: 16,
    fontWeight: "bold",
  },
});