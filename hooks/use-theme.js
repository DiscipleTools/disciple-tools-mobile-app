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

  // TODO: pull from API
  const getSelectorColor = (status) => {
    let newColor;
    if (status === "unassigned" || status === "scheduled") {
      newColor = "#F43636";
    } else if (status === "unassignable" || status === "assigned") {
      newColor = "#FF9800";
    } else if (
      status === "active" ||
      status === "in_progress" ||
      status === "complete"
    ) {
      newColor = "#4CAF50";
    } else if (status === "new" || status === "proposed") {
      newColor = "#00afff";
    } else if (status === "paused") {
      newColor = "#ff44cc";
    } else if (status === "from_facebook") {
      newColor = "#1778F2";
    } else if (status === "closed" || status === "inactive") {
      newColor = "#808080";
    }
    return newColor;
  };

  const _setTheme = (theme) => dispatch(setTheme(theme));

  const toggleMode = () =>
    setTheme(isDarkMode ? defaultThemeLight : defaultThemeDark);

  const isDarkMode = mode === ThemeConstants.DARK;

  return {
    isDarkMode,
    toggleMode,
    theme,
    setTheme: _setTheme,
    getSelectorColor,
  };
};
export default useTheme;
