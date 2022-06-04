import { Dimensions } from "react-native";
import { ThemeConstants } from "constants";

const windowWidth = Dimensions.get("window").width;

export const localStyles = ({ theme, isRTL, isIOS }) => ({
  container: {
    padding: 10,
  },
  switch: {
    color:
      theme.mode === ThemeConstants.DARK
        ? theme.highlight
        : theme.brand.primary,
  },
  slider: {
    width: windowWidth * 0.88,
    height: 40,
    alignSelf: "center",
  },
  sliderThumbColor: theme.brand.primary,
  sliderMinColor: theme.brand.primary,
  sliderMaxColor: theme.highlight,
});
