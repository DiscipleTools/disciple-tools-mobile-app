import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  inputContainer: {
    alignSelf: "stretch",
    marginVertical: 5,
    padding: 5,
    alignItems: "flex-start",
    height: 75,
  },
  inputLabel: {
    margin: 5,
  },
  inputLabelText: {
    color: "#555555",
  },
  inputRow: {
    alignSelf: "stretch",
    flexDirection: "row",
  },
  inputRowIcon: {
    fontSize: 25,
    marginHorizontal: 5,
  },
  inputRowTextInput: {
    padding: 5,
    flexGrow: 1,
  },
});
