export const localStyles = ({ theme, isRTL, isIOS }) => ({
  container: {
    backgroundColor: theme.surface.primary,
    height: "100%",
  },
  gutter: {
    // TODO: use LIST_ITEM_HEIGHT constant
    marginBottom: 50,
  }
});