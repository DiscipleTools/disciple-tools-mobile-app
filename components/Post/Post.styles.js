import { ThemeConstants } from "constants"; 

export const localStyles = ({ theme, isRTL, isIOS }) => ({
  tabHeading: {
    color: theme.text.primary,
  },
  tabHeadingStyle: {
    backgroundColor: theme.mode === ThemeConstants.DARK ? theme.surface.primary : theme.surface.input,
  },
  tabBarUnderline: {
    backgroundColor: theme.mode === ThemeConstants.DARK ? theme.highlight : theme.brand.primary,
  },
  headerTitle: {
    color: theme.text.primary,
    fontWeight: 'bold',
    width: isIOS ? 140 : 180,
  },
});