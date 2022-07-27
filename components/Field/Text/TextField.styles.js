// TODO: move Style-related Constants to Theme
import Constants, { ThemeConstants } from "constants";

// TODO: move to globalStyles bc this is verbatim same as NumberField
export const localStyles = ({ theme, isRTL, isIOS }) => ({
  container: {
    minHeight: Constants.FIELD_HEIGHT,
    //minHeight: theme.FIELD_HEIGHT,
    justifyContent: "center",
  },
  input: {
    color: theme.text.primary,
    paddingHorizontal: 10,
    marginEnd: "auto",
    width: "100%",
  },
  controlIcons: {
    justifyContent: "space-between",
  },
  switch: {
    color:
      theme.mode === ThemeConstants.DARK
        ? theme.highlight
        : theme.brand.primary,
  },
});
