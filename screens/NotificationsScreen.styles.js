import Constants from "constants";

export const localStyles = ({ theme, isRTL, isIOS }) => ({
  container: {
    backgroundColor: theme.surface.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.background.primary,
    flexDirection: isRTL ? "row-reverse" : "row",
    height: Constants.LIST_ITEM_HEIGHT,
    padding: 10,
  },
  notificationDetails: {
    flexWrap: "wrap",
    marginEnd: "auto",
  },
  link: {
    color: theme.text.link
  },
  dontHaveNotificationsText: {
    fontSize: 14,
    color: "black",
    fontWeight: "bold",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});