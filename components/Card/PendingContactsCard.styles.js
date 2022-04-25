import { ThemeConstants } from "constants";

export const localStyles = ({ theme, isRTL, isIOS }) => ({
  container: (idx) => ({
    alignItems: "center",
    borderTopWidth: idx !== 0 ? 1 : null,
    borderTopColor: idx !== 0 ? theme.surface.primary : null,
    paddingVertical: 10
  }),
  // TODO: move to use-styles?
  title: {
    color: ThemeConstants.DARK === theme.mode ? theme.text.primary : theme.brand.primary,
    fontWeight: "bold",
    textDecorationLine: "underline",
    fontSize: 18,
    marginBottom: 15,
  },
  buttonRowContainer: {
    justifyContent: "center",
    paddingBottom: 10,
    width: "100%",
  },
  buttonContainer: {
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 5,
  },
  buttonText: {
    color: theme.offLight,
    fontWeight: "bold",
  },
  buttonAccept: {
    backgroundColor: theme.success,
  },
  buttonDecline: {
    backgroundColor: theme.error,
  },
  etcetera: {
    alignItems: "center",
  }
});