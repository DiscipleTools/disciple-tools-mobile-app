import Constants from "constants";

export const localStyles = ({ theme, isRTL }) => ({
  rowFront: {
    backgroundColor: theme.surface.secondary,
    height: Constants.LIST_ITEM_HEIGHT,
    padding: 15,
  },
  rowBack: {
    backgroundColor: theme.surface.secondary,
    flexDirection: "row",
    height: listItemHeight,
  },
  backBtn: {
    backgroundColor: theme.surface.secondary,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    bottom: 0,
    height: Constants.LIST_ITEM_HEIGHT,
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  backBtnIcon: {
    color: "#FFF",
    fontSize: 22,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  backBtnText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  backBtn1: {
    backgroundColor: theme.brand.primary,
  },
  backBtn2: {
    backgroundColor: "green",
  },
  backBtn3: {
    backgroundColor: theme.brand.primary,
  },
  backBtn4: {
    backgroundColor: "green",
  },
  btn1: {
    start: isRTL ? Constants.SWIPE_BTN_WIDTH * 2 : 0,
  },
  btn2: {
    start: isRTL ? Constants.SWIPE_BTN_WIDTH : 0,
  },
  btn3: {
    start: isRTL ? 0 : Constants.SWIPE_BTN_WIDTH,
  }
});