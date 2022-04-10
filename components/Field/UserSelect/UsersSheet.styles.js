export const localStyles = ({ theme, isRTL, isIOS }) => ({
  avatar: {
    height: 16,
    width: 16,
    marginRight: 5,
  },
  itemContainer: {
    //flexDirection: isRTL ? "row-reverse" : "row",
    borderTopColor: theme.background.primary,
    borderTopWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginStart: 15,
    minHeight: 50,
  },
});