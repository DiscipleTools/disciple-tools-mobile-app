import Constants from "constants";

export const localStyles = ({ theme, isRTL, isIOS }) => ({
  container: {
    backgroundColor: theme.surface.primary,
    height: "110%",
  },
  gutter: {
    marginBottom: Constants.LIST_ITEM_HEIGHT,
  },
  skelton: {
    backgroundColor: theme.background.primary,
    height: "100%",
  },
});