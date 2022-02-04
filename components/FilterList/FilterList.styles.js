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
    width: "100%",
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
    fontSize: 16,
    fontWeight: "bold",
    marginTop: "auto",
    marginBottom: "auto",
    marginLeft: 5,
  }
});