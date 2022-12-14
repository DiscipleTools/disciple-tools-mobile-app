import { ThemeConstants } from "constants";

export const localStyles = ({ theme, isRTL, isIOS }) => ({
  listItemContainer: {
    alignItems: "center",
    //backgroundColor: theme.surface.primary,
    borderColor: theme.background.primary,
    borderTopWidth: 1,
    marginVertical: 10,
    paddingTop: 30,
    width: '100%'
  },
  buttonIcon: {
    color:
      theme.mode === ThemeConstants.DARK
        ? theme.text.primary
        : theme.offLight,
  },
  buttonDescriptionContainer: {
    marginVertical: 10,
    marginStart: 40,
    width: '80%'
  },
  buttonDescriptionText: {
    color: theme.placeholder,
    fontSize: 13,
  }
});