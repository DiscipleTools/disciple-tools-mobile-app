import Constants from "constants";

// TODO: refactor to use global styles
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
    paddingHorizontal: 10,
  },
  input: (showSave) => ({
    color: theme.text.primary,
    // TODO: refactor out percentage widths
    width: showSave ? "85%" : "100%",
  }),
  controlIcons: {
    paddingVertical: 10,
    justifyContent: "space-between",
  },
  actionIcons: {
    flex: 1,
    justifyContent: "center",
  },
});