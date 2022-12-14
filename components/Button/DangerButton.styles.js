import { ThemeConstants } from "constants";

export const localStyles = ({ theme, isRTL, isIOS }) => ({
  dangerButtonContainer: {
    backgroundColor: "rgba(255, 0, 0, 0.6)",
    borderColor: "rgba(255, 0, 0, 1)",
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