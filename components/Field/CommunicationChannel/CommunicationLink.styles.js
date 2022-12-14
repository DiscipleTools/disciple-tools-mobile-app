import Constants from "constants";

export const localStyles = ({ theme, isRTL, isIOS }) => ({
  container: {
    minHeight: Constants.FIELD_HEIGHT,
    justifyContent: "center",
    backgroundColor: theme.background.primary,
    borderWidth: 1,
    borderRadius: 5,
    borderStyle: "solid",
    borderColor: theme.divider,
    justifyContent: "center",
    minHeight: Constants.FIELD_HEIGHT,
    marginBottom: 5,
    marginEnd: "auto",
    flex: 11,
    width: "100%",
  },
  linkingText: {
    color: theme.text.link,
    textDecorationLine: "underline",
    paddingHorizontal: 10,
  },
  unlinkingText: {
    color: theme.text.primary,
    paddingHorizontal: 10,
  }
});
