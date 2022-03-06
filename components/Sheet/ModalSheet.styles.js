export const localStyles = ({ theme, isRTL, isIOS }) => ({
  container: {
    backgroundColor: theme.background.primary,
    // shadow
    shadowColor: theme.text.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 2,
    // layout
    minHeight: 200,
    marginHorizontal: 20,
  },
  contentContainer: {
    flex: 1,
    padding: 10,
    paddingTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});