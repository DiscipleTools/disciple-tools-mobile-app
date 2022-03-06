export const localStyles = ({ theme, isRTL }) => ({
  container: {
    backgroundColor: theme.background.primary,
    color: theme.text.primary,
    //borderTopColor: theme.divider,
    //borderTopWidth: 1,
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "center",
    paddingHorizontal: 20,
    minHeight: 75,
    width: "100%",
  }
});