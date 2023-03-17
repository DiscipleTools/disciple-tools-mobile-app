export const localStyles = ({ theme, isRTL, isIOS }) => ({
  startIcon: {
    color: theme.text.primary,
    fontSize: 16,
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
  optionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
  },
  mapButton: {
    backgroundColor: "red",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: theme.highlight,
    height: "85%",
    marginEnd: 3,
  },
  mapIcon: {
    color: theme.offLight,
    marginTop: 10,
  },
});
