export const localStyles = ({ theme, isRTL, isIOS }) => ({
  container: {
    backgroundColor: theme.background.primary,
  },
  inputContainer: {
    //backgroundColor: theme.surface.primary,
    backgroundColor: theme.surface.input,
    borderWidth: 1,
    borderColor: theme.divider,
    borderRadius: 10,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 5,
    marginHorizontal: 5,
    minHeight: 50,
  },
  input: {
    color: theme.text.primary,
    paddingTop: 10,
    paddingBottom: 10,
    marginEnd: "auto",
    textAlign: isRTL ? "right" : "left",
    width: "100%",
  },
  icon: {
    color: theme.text.primary,
    fontSize: 24,
    paddingHorizontal: 10,
  },
});