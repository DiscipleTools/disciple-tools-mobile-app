export const localStyles = ({ theme, isRTL, isIOS }) => ({
  displayContainer: {
    alignItems: "center",
    paddingVertical: 5,
  },
  filtersScrollContainer: {
    backgroundColor: theme.background.primary,
    borderBottomColor: theme.divider,
    borderBottomWidth: 1,
    minHeight: 50,
  },
  filtersContentContainer: {
    flexGrow: 1,
    flexDirection: isRTL ? "row-reverse" : "row",
    backgroundColor: theme.background.primary,
    height: "100%",
    paddingTop: 5,
    // NOTE: width: "100%" prevents horizontal scroll on Android
    //width: "100%",
  },
  count: {
    //borderColor: theme.text.primary,
    //borderWidth: 2,
    color: theme.text.primary,
    // TODO: use Theme
    fontSize: 24,
    fontWeight: "bold",
    marginTop: "auto",
    marginBottom: "auto",
    marginHorizontal: 10,
  },
  filterSelections: {
    color: theme.placeholder,
    fontStyle: "italic",
    // TODO: use Theme
    fontSize: 12,
  }
});