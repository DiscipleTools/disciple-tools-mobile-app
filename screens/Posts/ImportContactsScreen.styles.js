import Constants from "constants";

export const localStyles = ({ theme, isRTL, isIOS }) => ({
  title: {
    fontWeight: "bold",
  },
  postDetails: {
    alignItems: isRTL ? "flex-end" : "flex-start",
    marginEnd: "auto",
  },
  postItem: {
    backgroundColor: theme.surface.primary,
    borderBottomColor: theme.background.primary,
    borderBottomWidth: 1,
    paddingTop: 10,
    paddingHorizontal: 10,
    height: Constants.LIST_ITEM_HEIGHT,
  },
});