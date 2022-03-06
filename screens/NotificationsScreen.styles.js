import Constants from "constants";

export const localStyles = ({ theme, isRTL, isIOS }) => ({
  container: (isNew) => ({
    backgroundColor: isNew ? theme.surface.secondary : theme.surface.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.background.primary,
    paddingTop: 10,
    paddingHorizontal: 5,
    height: Constants.LIST_ITEM_HEIGHT,
  }),
  startIcon: {
    // NOTE: this does not work, forces details to details to align start
    //marginEnd: "auto",
  },
  endIcon: {
    marginStart: "auto",
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