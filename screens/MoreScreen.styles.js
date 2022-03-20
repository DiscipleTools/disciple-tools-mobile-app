export const localStyles = ({ theme, isRTL, isIOS }) => ({
  titleBar: {
    borderBottomColor: theme.background.primary,
    borderBottomWidth: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 10,
    // TODO: constant
    height: 50,
  },
});