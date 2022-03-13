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
    paddingTop: 15,
    paddingBottom: 15,
    paddingHorizontal: 10,
  },
  headerText: {
    color: theme.placeholder,
    fontStyle: "italic",
    marginHorizontal: 20
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
  formContainer: {
    flexGrow: 1,
    padding: 20,
  },
});