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
    color: theme.brand.primary,
    fontSize: 13,
    fontWeight: "bold",
  },
  time: {
    color: theme.brand.primary,
    fontSize: 10,
  },
  commentView: {
    backgroundColor: theme.background.primary,
    borderColor: theme.divider,
    borderTopWidth: 1,
  },
  commentInput: {
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingBottom: 15,
    minHeight: 100,
  },
  commentText: {
    color: theme.text.primary,
    marginEnd: "auto",
    // TODO: improve
    width: "85%",
  },
  expandIcon: {
    color: theme.text.primary,
    fontSize: 25,
  },
  sendIcon: {
    color: theme.brand.primary,
    borderWidth: 2,
    borderColor: theme.highlight,
    borderRadius: 25,
    fontSize: 50,
  },
  activityIndicator: {
    marginEnd: 15
  }
});
