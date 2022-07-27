import { ThemeConstants } from "constants";

export const localStyles = ({ theme, isRTL, isIOS }) => ({
  container: {
    height: 75,
    width: "95%",
    backgroundColor: theme.error,
    alignSelf: "center",
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 10,
    marginVertical: 20,
    paddingVertical: 10,
  },
  icon: {
    color: theme.offLight,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.offLight,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: theme.offLight,
  },
});
