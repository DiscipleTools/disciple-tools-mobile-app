export const localStyles = ({ theme, isRTL, isIOS }) => ({
  rowContainer: {
    alignItems: "center",
  },
  bodyContainer: {
    alignItems: "center",
  },
  buttonContainer: {
    backgroundColor: theme.brand.primary,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: theme.highlight,
    color: theme.offLight,
    marginHorizontal: 10,
    overflow: "hidden",
  },
  buttonText: {
    color: theme.text.primary,
    fontSize: 60,
  },
});
