import { ThemeConstants } from "constants";

export const localStyles = ({ theme, isRTL, isIOS }) => ({
  container: {
    flex: 1,
    flexDirection: "column",
    borderTopColor: theme.divider,
    borderTopWidth: 1,
  },
  scrollViewContainer: {
    flexGrow: 0
  },
  scrollViewContent: {
    flexDirection: "row"
  },
  sceneContent: {
    flexGrow: 1,
  },
  tabContainer: (active) => ({
    height: 50,
    padding: 15,
    borderBottomWidth: active ? 3 : null,
    borderBottomColor: active ? (ThemeConstants.DARK === theme.mode ? theme.highlight : theme.brand.primary) : null,
  }),
});