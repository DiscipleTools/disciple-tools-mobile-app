import Constants from 'constants';

// TODO: refactor to use global styles
export const localStyles = ({ theme, isRTL, isIOS }) => ({
  container: {
    minHeight: Constants.FIELD_HEIGHT,
    justifyContent: "center",
    backgroundColor: theme.background.primary,
    borderWidth: 1,
    borderRadius: 5,
    borderStyle: "solid",
    borderColor: theme.divider,
    justifyContent: "center",
    minHeight: Constants.FIELD_HEIGHT,
    marginBottom: 5,
    marginEnd: "auto",
    flex: 11,
    width: "100%",
  },
  input: {
    color: theme.text.primary,
    paddingHorizontal: 10,
  },
  controlIcons: {
    justifyContent: "space-between"
  },
  removeIcon: {
    flex: 1,
    justifyContent: "center"
  },
});