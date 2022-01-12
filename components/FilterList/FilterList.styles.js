import { StyleSheet } from "react-native";
import Colors from "constants/Colors";

export const styles = StyleSheet.create({
  listItemSeparator: {
    height: 1,
    width: "100%",
    backgroundColor: Colors.grayLight,
  },
  background: {
    backgroundColor: Colors.mainBackgroundColor,
    borderTopColor: Colors.grayLight,
    borderTopWidth: 1,
    height: "100%",
  },
  placeholder: {
    padding: 20,
    fontWeight: "bold",
  },
  tags: {
    flexGrow: 1,
    flexDirection: "row",
    backgroundColor: Colors.mainBackgroundColor,
    width: "100%",
  },
  chip: {
    borderColor: "#c2e0ff",
    borderWidth: 1,
    backgroundColor: "#ecf5fc",
    borderRadius: 2,
    padding: 7,
    marginTop: 5,
    marginLeft: 5,
    marginBottom: 5,
  },
  countChip: {
    borderColor: Colors.mainBackgroundColor,
    backgroundColor: Colors.mainBackgroundColor,
    fontWeight: "bold",
  }
});
