export const localStyles = ({ theme, isRTL, isIOS }) => ({
  container: {
    alignItems: "center",
    backgroundColor: theme.surface.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.background.primary,
    // TODO: use constant
    height: 50,
    padding: 10,
  },
  label: {
    color: theme.text.primary,
  },
  start: {
    paddingEnd: 10
  },
  end: {
    marginStart: "auto"
  }
});