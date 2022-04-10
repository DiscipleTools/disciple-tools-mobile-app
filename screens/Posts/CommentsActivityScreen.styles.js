import { ThemeConstants } from "constants";

export const localStyles = ({ theme, isRTL, isIOS }) => ({
  container: {
    paddingLeft: 19,
    paddingRight: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: theme.background.primary,
  },
  image: {
    height: 25,
    width: 25,
    marginTop: 7, //'auto',
    //marginBottom: 'auto',
  },
  content: {
    backgroundColor: theme.surface.primary,
    borderRadius: 5,
    flex: 1,
    marginLeft: 16,
    padding: 10,
  },
  name: {
    color: theme.text.primary,
    fontSize: 13,
    fontWeight: "bold",
  },
  time: {
    color: theme.text.secondary,
    fontSize: 10,
  },
  commentInputText: {
    color: theme.text.primary,
    padding: 10,
    marginBottom: 10
  },
  commentText: (isActivity) => ({
    flexDirection: "row",
    color: isActivity ? theme.text.secondary : theme.text.primary,
    fontStyle: isActivity ? "italic" : null,
    padding: 5,
  }),
  parseText: {
    color: ThemeConstants.DARK === theme.mode ? theme.highlight : theme.brand.primary,
    textDecorationLine: "underline",   
  },
  expandIcon: {
    color: theme.text.primary,
    fontSize: 25,
  },
  sendIcon: {
    color: ThemeConstants.DARK === theme.mode ? theme.text.primary : theme.brand.primary,
    //borderWidth: 2,
    //borderColor: theme.highlight,
    //borderRadius: 25,
    fontSize: 42,
  },
  activityIndicator: {
    marginEnd: 15
  }
});
