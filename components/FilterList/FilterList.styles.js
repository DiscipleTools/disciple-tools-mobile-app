export const localStyles = ({ theme, isRTL, isIOS }) => ({
  container: {
    backgroundColor: theme.surface.primary,
    height: "100%",
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
  placeholderContainer: {
    backgroundColor: theme.surface.primary,
    height: "100%",
  },
  placeholderText: {
    color: theme.placeholder,
    padding: 20,
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