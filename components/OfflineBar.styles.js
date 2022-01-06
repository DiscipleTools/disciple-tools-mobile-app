import { StyleSheet } from "react-native";
import Colors from 'constants/Colors';

export const styles = StyleSheet.create({
  offlineBar: {
    height: 20,
    backgroundColor: Colors.offlineBar,
  },
  offlineBarText: {
    fontSize: 14,
    color: Colors.headerTintColor,
    textAlignVertical: "center",
    textAlign: "center",
  },
});
