import { ThemeConstants } from "constants";

// TODO: constant
const CHURCH_CIRCLE_SIZE = 325;

export const localStyles = ({ theme, isRTL, isIOS }) => ({
  container: {
    padding: 10,
  },
  gridBox: {
    height: 40,
    width: 40,
  },
  circle: {
    flex: 1,
    width: CHURCH_CIRCLE_SIZE,
    height: CHURCH_CIRCLE_SIZE,
  },
  circleImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  circleImage: (hasChurchCommitment) => ({
    tintColor: hasChurchCommitment ? theme.systemGreen : theme.systemGray,
    alignSelf: "center",
  }),
  iconImage: (selected) => ({
    //tintColor: selected ? null : "gray",
    opacity: selected ? null : 0.45,
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
  baptismMainContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  baptismContainer: {
    alignItems: "center",
    alignSelf: "flex-start",
    marginVertical: 10,
    paddingLeft: 4,
  },
  baptizeIconChurchHealth: {
    height: 20,
    width: 50,
  },
  churchCommitmentSwitch: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
});
