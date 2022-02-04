import { ThemeConstants } from "constants";
const avatarSize = 60;

export const localStyles = ({ theme, isRTL, isIOS }) => ({
  avatar: {
    width: avatarSize,
    height: avatarSize,
    borderRadius: avatarSize/2
  },
  headerContainer: {
    backgroundColor: theme.surface.secondary,
    //backgroundColor: theme.background.primary,
    paddingTop: 15,
    paddingBottom: 15,
    paddingHorizontal: 10,
    //borderTopWidth: 1,
    //borderTopColor: theme.highlight,
    //borderBottomWidth: 1,
    //borderBottomColor: theme.highlight,
  },
  headerDomain: {
    color: theme.placeholder,
    fontStyle: "italic",
  },
  switch: {
    color: theme.mode === ThemeConstants.DARK ? theme.highlight : theme.brand.primary,
  },
  optionContainer: {
    borderBottomWidth: 1,
    borderBottomColor: theme.background.primary,
    marginHorizontal: 5,
    paddingHorizontal: 5,
    alignItems: "center",
    height: 50,
  },
});