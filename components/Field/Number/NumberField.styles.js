import Constants from "constants";

export const localStyles = ({ theme, isRTL, isIOS }) => ({
  container: {
    minHeight: Constants.FIELD_HEIGHT,
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
});
