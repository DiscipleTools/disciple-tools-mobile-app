import { ThemeConstants } from "constants"; 

export const localStyles = ({ theme, isRTL, isIOS }) => ({
  screenContainer: {
    backgroundColor: theme.background.primary,
    // TODO: why 110%? 
    height: "110%",
  },
  tabbar: {
    backgroundColor: theme.mode === ThemeConstants.DARK ? theme.surface.primary : theme.surface.input,
  },
  tab: {
    width: "auto",
  },
  indicator: {
    backgroundColor: theme.mode === ThemeConstants.DARK ? theme.highlight : theme.brand.primary,
  },
  label: {
    //fontWeight: '400',
  },
});