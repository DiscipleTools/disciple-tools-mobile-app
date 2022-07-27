export const localStyles = ({ theme, isRTL, isIOS }) => ({
  container: {
    paddingVertical: 20,
  },
  cardRowContainer: {
    justifyContent: "space-evenly",
  },
  logo: {
    height: 25,
    width: 40,
    resizeMode: "contain",
  },
  brandText: {
    color: theme.text.primary,
    fontSize: 20,
    fontWeight: "bold",
    marginEnd: 5,
  },
  // TODO: move to globalStyles?
  headerIcon: {
    marginHorizontal: 5,
  },
  notificationsDot: (hasNotifications) => ({
    backgroundColor: "red",
    top: -25,
    left: isRTL ? null : 22,
    right: isRTL ? -22 : null,
    postition: "absolute",
    borderRadius: 5,
    width: 7,
    height: 7,
  }),
});
