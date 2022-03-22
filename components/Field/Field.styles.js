import Constants from 'constants';

export const localStyles = ({ theme, isRTL, isIOS }) => ({
  container: {
    padding: 10,
    height: "auto",
    width: "auto"
  },
  component: {
    backgroundColor: theme.background.primary,
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 5,
    borderStyle: "solid",
    borderColor: theme.divider,
    minHeight: Constants.FIELD_HEIGHT,
  },
  fieldLabelContainer: {
    paddingVertical: 3,
    alignItems: "center",
    marginEnd: "auto"
  },
  fieldLabelText: {
    color: theme.text.primary,
    fontSize: 14,
    paddingStart: 3,
  },
  fieldControls: {
    marginStart: "auto"
  },
});
