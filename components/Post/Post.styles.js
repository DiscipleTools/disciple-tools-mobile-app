import { ThemeConstants } from "constants"; 

export const localStyles = ({ theme, isRTL, isIOS }) => ({
  screenContainer: {
    backgroundColor: theme.background.primary,
    // TODO: why 110%? 
    height: "110%",
  },
  titleBarContainer: {
    backgroundColor: theme.background.primary,
    padding: 5,
  },
  titleBarText: {
    color: theme.text.primary,
    fontSize: 16,
    fontWeight: "bold",
    marginStart: "auto",
    marginEnd: "auto"
  },
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