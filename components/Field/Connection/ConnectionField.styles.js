// TODO: constant
const GROUP_CIRCLE_SIZE = 150;

export const localStyles = ({ theme, isRTL, isIOS }) => ({
  groupCircleContainer: {
    height: GROUP_CIRCLE_SIZE,
    width: GROUP_CIRCLE_SIZE,
  },
  groupCircle: {
    position: "absolute",
    height: 125,
    width: 125,
    marginHorizontal: 10,
    marginTop: 5
  },
  groupCenterIcon: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    position: "absolute",
    height: 50,
    width: 50,
    marginTop: 50,
  },
  groupCircleName: {
    justifyContent: "center",
    marginTop: 30,
  },
  groupCircleNameText: {
    color: theme.text.primary,
  },
  groupCircleCounter: {
    justifyContent: "center",
  },
  /*
  progressIconText: {
    fontSize: 9,
    textAlign: "center",
    width: "100%",
  },
  membersIconActive: {
    opacity: 1,
  },
  membersIconInactive: {
    opacity: 0.15,
  },
  membersLeaderIcon: {
    height: 30,
    width: 18,
    marginLeft: 0,
  },
  membersCloseIcon: {
    color: theme.text.primary,
    fontSize: 25,
    marginTop: "auto",
    marginBottom: "auto",
  },
  */
});