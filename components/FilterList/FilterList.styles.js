import { StyleSheet } from "react-native";
import Colors from "constants/Colors";

export const styles = StyleSheet.create({
  listItemSeparator: {
    height: 1,
    width: "100%",
    backgroundColor: "#dddddd",
  },
  background: {
    backgroundColor: Colors.mainBackgroundColor,
    height: "100%",
  },
  placeholder: {
    padding: 20,
    fontWeight: "bold",
  },
  tags: {
    flexGrow: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    borderColor: "#ccc",
    borderTopWidth: 1
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
