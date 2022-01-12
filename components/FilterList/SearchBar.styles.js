import { StyleSheet } from "react-native";
import Colors from "constants/Colors";

export const styles = StyleSheet.create({
  searchSection: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomColor: Colors.gray,
    borderBottomWidth: 1,
    minHeight: 60,
  },
  searchIcon: {
    padding: 10,
    fontSize: 20,
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: "#fff",
    color: "#424242",
  },
  searchBarContainer: {
    borderBottomWidth: 1,
    backgroundColor: Colors.tabBar,
    borderBottomColor: "#FFF",
    marginTop: 10,
  },
  searchBarScrollView: {
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 9,
    minHeight: 60,
  },
  searchBarItem: {
    borderColor: "#DDDDDD",
    borderRadius: 3,
    borderWidth: 10,
  },
  searchBarIcons: {
    fontSize: 20,
    color: "gray",
    padding: 10,
  },
  searchBarInput: {
    color: "gray",
    height: 41,
    fontSize: 18,
  },
  chip: {
    borderColor: "#c2e0ff",
    borderWidth: 1,
    backgroundColor: "#ecf5fc",
    borderRadius: 2,
    padding: 4,
    marginRight: 4,
    marginBottom: 4,
  },
});
