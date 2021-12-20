import { StyleSheet } from "react-native";
import Colors from "constants/Colors";

// TODO
export const styles = StyleSheet.create({
  container: {
    paddingLeft: 19,
    paddingRight: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: Colors.mainBackgroundColor,
  },
  image: {
    height: 24,
    width: 24,
    marginTop: 7, //'auto',
    //marginBottom: 'auto',
  },
  content: {
    backgroundColor: Colors.contentBackgroundColor,
    borderRadius: 5,
    flex: 1,
    marginLeft: 16,
    padding: 10,
  },
  name: {
    color: Colors.tintColor,
    fontSize: 13,
    fontWeight: "bold",
  },
  time: {
    color: Colors.tintColor,
    fontSize: 10,
  },
});
