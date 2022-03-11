import { StyleSheet } from "react-native";

import useDevice from "hooks/use-device";
import useI18N from "hooks/use-i18n";
import useTheme from "hooks/use-theme";

const globalStyles = ({ theme, isRTL, isIOS }) => ({
  // Palette
  primary: {
    color: theme.primary,
  },
  secondary: {
    color: theme.secondary,
  },
  // Layout
  background: {
    backgroundColor: theme.background.primary,
  },
  surface: {
    backgroundColor: theme.surface.primary,
  },
  header: {
    backgroundColor: theme.background.primary,
    color: theme.text.primary,
  },
  // Typography
  text: {
    color: theme.text.primary,
    fontFamily: "System",
    /* 
      * Android
      * https://material.io/design/typography/the-type-system.html 
      * ref: Body 1 or Body 2
      * 
      * IOS
      * https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/typography/
      * ref: Small, Body
      */
    fontSize: 15,
  },
  link: {
    color: theme.text.link,
    textDecorationLine: "underline",
  },
  title: {
    color: theme.text.primary,
    fontSize: 20,
    fontWeight: "bold",
    marginEnd: "auto",
  },
  subtitle: {
    color: theme.text.primary,
    fontSize: 15,
    fontWeight: "500",
    marginEnd: "auto",
  },
  caption: {
    color: theme.text.secondary,
    fontSize: 12,
    fontStyle: "italic",
    paddingTop: 5
  },
  icon: {
    color: theme.text.primary,
    fontSize: 24,
    paddingHorizontal: 3
  },
  rowIcon: {
    color: theme.text.primary,
    fontSize: 24,
    marginStart: isRTL ? 10 : 0,
    marginEnd: isRTL ? 0 : 10,
  },
  selectedIcon: {
    fontSize: 24,
    //marginStart: "auto",
    color: theme.text.link,
  },
  // Components 
  rowContainer: {
    flexDirection: isRTL ? "row-reverse" : "row",
  },
  columnContainer: {
    flexDirection: "column",
  },
  screenContainer: {
    backgroundColor: theme.surface.primary,
    height: "100%",
  },
  fieldContainer: {
    flexDirection: isRTL ? "row-reverse" : "row",
    marginHorizontal: 7,
  },
  // TODO: move to standalone Button component
  buttonColor: {
    backgroundColor: theme.brand.primary,
  },
  buttonText: {
    color: theme.offLight,
  },
  buttonShadow: {
    borderColor: theme.highlight,
    borderWidth: 1,
    borderRadius: 50
  },
  body: {
    paddingHorizontal: 10,
    marginEnd: "auto",
  },
  placeholder: {
    color: theme.placeholder,
  },
  divider: {
    backgroundColor: theme.divider,
  },
  activityIndicator: {
    color: theme.text.primary,
  },
  refreshControl: {
    color: theme.placeholder,
  }
});

const useStyles = (localStyles) => {
  const { theme } = useTheme();
  const { isRTL } = useI18N();
  const { isIOS } = useDevice();
  let localStylesSheet = null;
  if (localStyles) localStylesSheet = StyleSheet.create(localStyles({ theme, globalStyles, isRTL, isIOS }));
  const globalStylesSheet = StyleSheet.create(globalStyles({ theme, isRTL, isIOS }));
  return {
    styles: localStylesSheet,
    globalStyles: globalStylesSheet,
  };
};
export default useStyles;
