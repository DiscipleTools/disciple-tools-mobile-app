import Constants from "constants";

export const localStyles = ({ theme, isRTL }) => ({
  postItem: {
    backgroundColor: theme.surface.primary,
    borderBottomColor: theme.background.primary,
    borderBottomWidth: 1,
    padding: 10,
    height: Constants.LIST_ITEM_HEIGHT,
  },
  postDetails: {
    alignItems: isRTL ? "flex-end" : "flex-start",
    marginEnd: "auto",
  },
  title: {
    fontWeight: "bold",
  },
  subtitle: {
    paddingTop: 5,
  },
  statusDot: {
    borderRadius: Constants.STATUS_CIRCLE_SIZE / 2,
    height: Constants.STATUS_CIRCLE_SIZE,
    width: Constants.STATUS_CIRCLE_SIZE,
    marginTop: "auto",
    marginBottom: "auto",
  },
});