export const localStyles = ({ theme, isRTL, isIOS }) => ({
  inputContainer: {
    alignSelf: "stretch",
    marginVertical: 5,
    padding: 5,
    alignItems: "flex-start",
    height: 75,
  },
  inputLabel: {
    margin: 5,
  },
  inputLabelText: {
    color: theme.text.primary,
    fontWeight: '600',
    marginLeft: 5
  },
  inputRow: {
    alignSelf: "stretch",
    flexDirection: "row",
  },
  inputRowIcon: {
    fontSize: 25,
    marginHorizontal: 5,
  },
  inputRowTextInput: {
    color: theme.text.primary,
    padding: 5,
    flexGrow: 1,
  },
  textField: {
    backgroundColor: theme.text.inverse,
    borderWidth: 1,
    borderColor: theme.divider,
    borderRadius: 5,
  },
  inputText: {
    color: theme.text.primary,
    padding: 5,
    width: "100%",
  },
  validationErrorInput: {
    borderWidth: 2,
    borderColor: theme.error,
  },
  validationErrorMessage: {
    color: theme.error,
  },
});
