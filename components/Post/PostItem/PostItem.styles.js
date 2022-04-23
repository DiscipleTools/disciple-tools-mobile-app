import Constants from "constants";

export const localStyles = ({ theme, isRTL }) => ({
  container: {
    flex: 1,
    backgroundColor: theme.surface.primary,
    borderBottomColor: theme.background.primary,
    borderBottomWidth: 1,
    height: Constants.LIST_ITEM_HEIGHT,
  },
  subcontainer: {
    flex: 12
  },
  subsubcontainer: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "flex-start",
    marginEnd: "auto",
    flexWrap: "wrap",
  },
  detailsContainer: {
    flex: 10.5,
    flexWrap: "wrap",
    alignItems: "flex-start",
    marginEnd: "auto",
  },
  title: {
    fontWeight: "bold",
  },
  lastModifiedDateText: {
    flex: 1.5,
    color: theme.placeholder,
    fontStyle: "italic",
  },
  meatballIcon: {
    padding: 10,
    justifyContent: "center",
  }
});