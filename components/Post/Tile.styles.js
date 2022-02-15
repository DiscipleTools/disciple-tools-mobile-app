import { ThemeConstants } from "constants";

export const localStyles = ({ theme, isRTL, isIOS }) => ({
  button: {
    backgroundColor: theme.brand.primary,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 25,
    marginStart: "auto",
    marginEnd: "auto",
    width: "90%"
  }
});