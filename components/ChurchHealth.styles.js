import { ThemeConstants } from "constants";

// TODO: constant
const CHURCH_CIRCLE_SIZE = 375;

export const localStyles = ({ theme, isRTL, isIOS }) => ({
  container: {
    alignItems: "center",
    paddingTop: 15,
  },
  gridBox: {
    height: 60,
    width: 60,
  },
  circle: {
    flex: 1,
    width: CHURCH_CIRCLE_SIZE,
    height: CHURCH_CIRCLE_SIZE,
  },
  circleImage: (hasChurchCommitment) => ({
    tintColor: hasChurchCommitment ? theme.systemGreen : theme.systemGray,
  }),
  iconImage: (selected) => ({
    //tintColor: selected ? null : "gray",
    opacity: selected ? null : 0.1,
    borderBottomColor: theme.mode === ThemeConstants.DARK ? theme.highlight : theme.brand.primary,
    borderBottomWidth: selected ? 2 : 0, 
  }),
  switch: {
    color: theme.mode === ThemeConstants.DARK ? theme.highlight : theme.brand.primary,
  },
  listItem: {
    backgroundColor: theme.background.primary,
  }
});