export const localStyles = ({ theme, isRTL, isIOS }) => ({
  offlineBar: {
    height: 20,
    backgroundColor: theme.warning,
  },
  offlineBarText: {
    color: theme.offDark,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
  },
});
