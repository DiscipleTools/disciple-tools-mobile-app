export const localStyles = ({ theme, isRTL }) => ({
  container: {
    backgroundColor: theme.background.primary,
    color: theme.text.primary,
    //borderBottomColor: theme.divider,
    //borderBottomWidth: 1,
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  closeIcon: {
    color: theme.text.primary,
    fontSize: 32,
  }
});