import { ThemeConstants } from "constants";

export const localStyles = ({ theme, isRTL, isIOS }) => ({
  activityView: {
    marginVertical: 5,
    // alignItems: "flex-start",
    paddingHorizontal: 10,
  },
  // TODO: move to use-styles?
  activityLink: {
    color:
      ThemeConstants.DARK === theme.mode
        ? theme.text.primary
        : theme.brand.primary,
    fontWeight: "bold",
    textDecorationLine: "underline",
    marginVertical: 2,
  },
  activityText: {
    color: "grey",
    fontStyle: "italic",
    paddingVertical: 2,
  },
  commentText: (isActivity) => ({
    flexDirection: "row",
    color: isActivity ? theme.text.secondary : theme.text.primary,
    fontStyle: isActivity ? "italic" : null,
    padding: 5,
  }),
  parseText: {
    color:
      ThemeConstants.DARK === theme.mode
        ? theme.highlight
        : theme.brand.primary,
    textDecorationLine: "underline",
  }
});
