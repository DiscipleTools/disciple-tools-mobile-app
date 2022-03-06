export const localStyles = ({ theme, isRTL }) => ({
  container: {
    backgroundColor: theme.background.primary,
    color: theme.text.primary,
    //borderBottomColor: theme.divider,
    //borderBottomWidth: 1,
    flexDirection: isRTL ? "row-reverse" : "row",
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  controls: {
    marginStart: "auto"
  },
  closeIcon: {
    color: theme.text.primary,
    fontSize: 32,
  }
});