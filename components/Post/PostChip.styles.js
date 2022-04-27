export const localStyles = ({ theme, isRTL, isIOS }) => ({
  container: {
    paddingHorizontal: 5
  },
  clearIconContainer: (selected) => ({
    backgroundColor: theme.background.primary,
    borderColor: selected ? theme.highlight : theme.disabled,
    borderRadius: 10,
    borderWidth: 1,
    marginStart: 5,
  }),
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