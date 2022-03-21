//import React from "react";
import { Appearance, useColorScheme } from "react-native";
import { useDispatch, useSelector } from "react-redux";

//import useDevice from "hooks/use-device";

import { setTheme as _setTheme } from "store/actions/user.actions";

import { ThemeConstants, defaultThemeLight, defaultThemeDark } from "constants";

const useTheme = () => {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  const persistedTheme = useSelector(state => state.userReducer.theme);
  //const { isIOS } = useDevice();

  let mode = persistedTheme?.mode || colorScheme;
  if (!mode || (mode !== ThemeConstants.DARK && mode !== ThemeConstants.LIGHT)) mode = ThemeConstants.LIGHT; // by default 

  //const theme = persistedTheme || mode === ThemeConstants.LIGHT ? defaultThemeLight : defaultThemeDark;
  const theme = mode === ThemeConstants.LIGHT ? defaultThemeLight : defaultThemeDark;
  
  //if (persistedTheme?.mode !== theme?.mode) setTheme(theme);

  // NOTE: listen for device changes 
  Appearance.addChangeListener(scheme => {
    console.log(`*** Appearance.addChangeListener: ${JSON.stringify(scheme)}`);
    //if (scheme?.colorScheme !== mode) dispatch(_setTheme(scheme?.colorScheme));
  });

  // TODO: name these colors in Colors.js
  const getSelectorColor = (status) => {
    let newColor;
    if (status === "new" || status === "unassigned" || status === "inactive") {
      newColor = "#d9534f";
    } else if (
      status === "unassignable" ||
      status === "assigned" ||
      status === "paused"
    ) {
      newColor = "#f0ad4e";
    } else if (status === "active") {
      newColor = "#5cb85c";
    } else if (status === "from_facebook") {
      newColor = "#366184";
    } else if (status === "closed") {
      newColor = "#000";
    }
    return newColor;
  };

  const setTheme = (theme) => dispatch(_setTheme(theme));

  const toggleMode = () => setTheme(isDarkMode ? defaultThemeLight : defaultThemeDark);

  const isDarkMode = mode === ThemeConstants.DARK;

  return {
    isDarkMode,
    toggleMode,
    theme,
    setTheme,
    getSelectorColor,
  };
};
export default useTheme;
