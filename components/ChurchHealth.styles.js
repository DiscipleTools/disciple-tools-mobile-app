import { ThemeConstants } from "constants";

// TODO: constant
const CHURCH_CIRCLE_SIZE = 325;

export const localStyles = ({ theme, isRTL, isIOS }) => ({
  container: {
    //alignItems: "center",
    padding: 10,
    marginStart: "auto",
    marginEnd: "auto",
  },
  gridBox: {
    height: 50,
    width: 50,
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
    opacity: selected ? null : 0.15,
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