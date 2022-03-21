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
  commentView: {
    backgroundColor: theme.background.primary,
    borderColor: theme.divider,
    borderTopWidth: 1,
  },
  commentInputView: {
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingBottom: 15,
    minHeight: 100,
  },
  commentInputText: {
    color: theme.text.primary,
  },
  commentText: (isActivity) => ({
    flexDirection: isRTL ? "row-reverse" : "row",
    color: isActivity ? theme.text.secondary : theme.text.primary,
    //color: theme.text.secondary,
    fontStyle: isActivity ? "italic" : null,
    padding: 5,
  }),
  parseText: {
    color: ThemeConstants.DARK === theme.mode ? theme.highlight : theme.brand.primary,
    //textDecorationLine: "underline",   
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
    fontSize: 50,
  },
  activityIndicator: {
    marginEnd: 15
  }
});
