export const localStyles = ({ theme, isRTL }) => ({
  container: {
    backgroundColor: theme.background.primary,
    color: theme.text.primary,
    //borderTopColor: theme.divider,
    //borderTopWidth: 1,
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "center",
    paddingBottom: 20,
    paddingHorizontal: 10,
    minHeight: 75,
  }
});