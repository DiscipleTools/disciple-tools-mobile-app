import { ThemeConstants } from "constants";

export const localStyles = ({ theme, isRTL, isIOS }) => ({
  titleBar: {
    backgroundColor: theme.background.primary,
    height: "auto",
  },
  tabBarContainer: {
    backgroundColor: theme.background.primary,
  },
  tabBarLabelActive: {
    color: theme.text.primary,
  },
  tabBarLabelInactive: {
    color: theme.placeholder,
  },
  tabBarTab: {
    minWidth: 75,
    width: "auto",
  },
  tabBarIndicator: {
    backgroundColor:
      ThemeConstants.DARK === theme.mode
        ? theme.highlight
        : theme.brand.primary,
    height: 3,
  },
  headerIcon: {
    marginHorizontal: 10,
  },
});
