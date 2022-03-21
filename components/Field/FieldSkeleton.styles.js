export const localStyles = ({ theme, isRTL, isIOS }) => ({
  container: {
    backgroundColor: theme.surface.primary,
  },
  skeletonBackground: {
    backgroundColor: theme.divider
  },
  skeletonForeground: {
    backgroundColor: theme.background.primary
  },
});