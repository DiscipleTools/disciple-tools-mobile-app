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
  footerContainer: {
    flexDirection: "row",
    backgroundColor: theme.background.primary,
    borderTopWidth: 1,
    borderColor: theme.divider,
    padding: 10,
    height: 100,
  },
  footerText: {
    color: theme.placeholder,
    padding: 10
  },
  footerIcon: {
    flex: 1,
    paddingEnd: 10
  },
  image: {
    height: 25,
    width: 25,
    marginTop: 7, //'auto',
    //marginBottom: 'auto',
  },
  content: (userIsAuthor) => ({
    backgroundColor: theme.surface.primary,
    borderRadius: 5,
    flex: 1,
    marginLeft: 16,
    padding: 10,
    borderWidth: userIsAuthor ? 1 : null,
    borderColor: userIsAuthor ? theme.divider : null,
  }),
  name: {
    color: theme.text.primary,
    fontSize: 13,
    fontWeight: "bold",
  },
  time: {
    color: theme.text.secondary,
    fontSize: 10,
  },
  commentInputContainer: {
    flexDirection: "row",
    paddingTop: 25
  },
  commentInputText: {
    color: theme.text.primary,
    paddingHorizontal: 10,
    height: "auto",
    width: "85%",
  },
  commentText: (isActivity) => ({
    flexDirection: "row",
    color: isActivity ? theme.text.secondary : theme.text.primary,
    fontStyle: isActivity ? "italic" : null,
    padding: 5,
  }),
  parseText: {
    color:
      ThemeConstants.DARK === theme.mode
        ? theme.highlight
        : theme.brand.primary,
    textDecorationLine: "underline",
  },
  expandIcon: {
    color: theme.text.primary,
    fontSize: 25,
  },
  sendIcon: ({ isDisabled }) => ({
    color: isDisabled ? theme.disabled : (
      ThemeConstants.DARK === theme.mode
        ? theme.text.primary
        : theme.brand.primary
    ),
    //borderWidth: 2,
    //borderColor: theme.highlight,
    //borderRadius: 25,
    fontSize: 42,
    paddingTop: 5
  }),
  activityIndicator: {
    marginEnd: 15,
  },
  activityLink: {
    color:
      ThemeConstants.DARK === theme.mode
        ? theme.text.primary
        : theme.brand.primary,
    fontWeight: "bold",
    textDecorationLine: "underline",
    marginVertical: 2,
  },
});
