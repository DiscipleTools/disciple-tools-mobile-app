//import React from "react";
import { Appearance, useColorScheme } from "react-native";
import { useDispatch, useSelector } from "react-redux";

//import useDevice from "hooks/use-device";

import { setTheme } from "store/actions/user.actions";

import { ThemeConstants, defaultThemeLight, defaultThemeDark } from "constants";

const useTheme = () => {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  const persistedTheme = useSelector((state) => state.userReducer.theme);
  //const { isIOS } = useDevice();

  let mode = persistedTheme?.mode || colorScheme;
  if (!mode || (mode !== ThemeConstants.DARK && mode !== ThemeConstants.LIGHT))
    mode = ThemeConstants.LIGHT; // by default

  //const theme = persistedTheme || mode === ThemeConstants.LIGHT ? defaultThemeLight : defaultThemeDark;
  const theme =
    mode === ThemeConstants.LIGHT ? defaultThemeLight : defaultThemeDark;

  //if (persistedTheme?.mode !== theme?.mode) setTheme(theme);

  // NOTE: listen for device changes
  Appearance.addChangeListener((scheme) => {
    console.log(`*** Appearance.addChangeListener: ${JSON.stringify(scheme)}`);
    //if (scheme?.colorScheme !== mode) dispatch(setTheme(scheme?.colorScheme));
  });

  const _setTheme = (theme) => dispatch(setTheme(theme));

  const toggleMode = () =>
    _setTheme(isDarkMode ? defaultThemeLight : defaultThemeDark);

  const isDarkMode = mode === ThemeConstants.DARK;

  return {
    isDarkMode,
    toggleMode,
    theme,
    setTheme: _setTheme,
  };
};
export default useTheme;
