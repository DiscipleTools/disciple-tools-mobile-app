import { ThemeConstants } from "constants";

export const localStyles = ({ theme, isRTL, isIOS }) => ({
  activityView: {
    marginVertical: 5,
    alignItems: "flex-start",
    paddingHorizontal: 10
  },
  activityLink: {
    color: ThemeConstants.DARK === theme.mode ? theme.text.primary : theme.brand.primary,
    fontWeight: "bold",
    textDecorationLine: "underline",
    marginVertical: 2,
  },
  activityText: {
    color: "grey",
    fontStyle: "italic",
  }
});