export const localStyles = ({ theme, isRTL }) => ({
  container: {
    backgroundColor: theme.background.primary,
    color: theme.text.primary,
    //borderBottomColor: theme.divider,
    //borderBottomWidth: 1,
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  controls: {
    marginStart: "auto",
  },
  closeIcon: {
    color: theme.text.primary,
    fontSize: 28,
  },
});
