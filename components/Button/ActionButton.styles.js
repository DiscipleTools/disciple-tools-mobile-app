import { ThemeConstants } from "constants";

export const localStyles = ({ theme, isRTL, isIOS }) => ({
  actionButtonContainer: {
    backgroundColor: theme.brand.tertiary,
    borderColor: theme.highlight,
  },
  buttonContainer: {
    borderWidth: 1,
    width: 200,
    marginHorizontal: "auto",
  },
  buttonText: {
    color:
      theme.mode === ThemeConstants.DARK
        ? theme.text.primary
        : theme.offLight,
    fontWeight: "bold",
    marginEnd: 'auto', 
  },
});