// TODO: merge this, PostItemSkeleton, and FieldSkeleton styles
export const localStyles = ({ theme, isRTL, isIOS }) => ({
  container: {
    backgroundColor: theme.surface.primary,
    height: "100%",
  },
  skeletonBackground: {
    backgroundColor: theme.divider
  },
  skeletonForeground: {
    backgroundColor: theme.background.primary
  },
  titleBarMock: {
    backgroundColor: theme.background.primary,
    height: 35,
  }
});