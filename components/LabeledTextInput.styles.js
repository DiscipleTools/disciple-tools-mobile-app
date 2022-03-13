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
    padding: 5,
    flexGrow: 1,
  },
});
