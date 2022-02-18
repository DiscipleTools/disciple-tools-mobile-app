export const localStyles = ({ theme, isRTL, isIOS }) => ({
  container: {
    paddingStart: 5,
    paddingEnd: 5,
  },
  clearIconContainer: {
    backgroundColor: theme.background.primary,
    borderColor: theme.highlight,
    borderRadius: 10,
    borderWidth: 1,
    marginStart: 5,
  },
  clearIcon: {
    color: theme.text.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    minWidth: "100%",
    marginTop: "auto",
    marginBottom: "auto",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});