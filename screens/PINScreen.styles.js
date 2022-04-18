export const localStyles = ({ theme, isRTL, isIOS }) => ({
  container: {
    backgroundColor: theme.brand.primary,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: "40%",
    width: "100%",
    height: "100%",
  },
  logo: {
    height: 60,
    resizeMode: "contain",
  },
  text: {
    color: theme.text.primary,
    fontSize: 24,
    fontWeight: "bold",
    margin: 20,
  },
  icon: {
    color: theme.text.primary,
    fontSize: 32,
    marginBottom: 20,
  },
  iconContainer: {
    alignSelf: "center"
  },
  cellStyle: {
    backgroundColor: "azure",
    borderColor: theme.highlight,
    borderWidth: 2,
    borderRadius: 24,
  },
  cellStyleFocused: {
    backgroundColor: theme.surface.primary,
    borderColor: theme.highlight,
  },
  textStyle: {
    color: theme.brand.primary,
    fontSize: 24,
  },
  textStyleFocused: {
    color: theme.brand.primary,
  },
});
