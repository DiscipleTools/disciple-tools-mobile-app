export const localStyles = ({ theme, isRTL, isIOS }) => ({
  container: (border, center) => ({
    alignItems: "center",
    borderBottomWidth: border ? 1 : null,
    borderBottomColor: border ? theme.surface.primary : null,
    paddingBottom: 10,
  }),
  title: (center) => ({
    color: theme.text.primary,
    fontSize: 16,
    fontWeight: "bold",
    marginStart: center ? "auto" : null,
  }),
});
