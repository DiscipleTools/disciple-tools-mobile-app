export const localStyles = ({ theme, isRTL, isIOS }) => ({
  container: {
    backgroundColor: theme.background.primary,
  },
  inputContainer: {
    backgroundColor: theme.surface.input,
    borderWidth: 1,
    borderColor: theme.divider,
    borderRadius: 10,
    alignItems: "center",
    paddingHorizontal: 5,
    marginHorizontal: 5,
    minHeight: 50,
  },
  input: {
    color: theme.text.primary,
    paddingTop: 10,
    paddingBottom: 10,
    marginEnd: "auto",
    // TODO: do not hardcode this
    paddingEnd: 85,
    textAlign: isRTL ? "right" : "left",
    width: "100%",
  },
});