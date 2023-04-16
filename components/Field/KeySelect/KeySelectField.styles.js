export const localStyles = ({ theme, isRTL, isIOS }) => ({
  container: {
    paddingEnd: 5,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: -10,
  },
  statusBorder: ({ backgroundColor }) => ({
    height: 40,
    width: 20,
    marginEnd: 10,
    backgroundColor,
  }),
});
