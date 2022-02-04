export const localStyles = ({ theme, isRTL, isIOS }) => ({
  container: {
    backgroundColor: theme.surface.primary,
  },
  input: {
    color: theme.text.primary,
    marginEnd: "auto",
    paddingHorizontal: 10,
    width: "100%",
  },
  controlIcons: {
    justifyContent: "space-between"
  }
});