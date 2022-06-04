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
    // RN throws console error about Image having a border property
    //borderBottomColor: theme.mode === ThemeConstants.DARK ? theme.highlight : theme.brand.primary,
    //borderBottomWidth: selected ? 2 : 0,
  }),
  switch: {
    color:
      theme.mode === ThemeConstants.DARK
        ? theme.highlight
        : theme.brand.primary,
  },
  listItem: {
    backgroundColor: theme.background.primary,
  },
  baptismContainer: {
    alignItems: "center",
    alignSelf: "flex-start",
    marginVertical: 10,
  },
  baptizeIconChurchHealth: {
    height: 20,
    width: 50,
  },
});
