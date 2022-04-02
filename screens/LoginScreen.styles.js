export const localStyles = ({ theme, isRTL, isIOS }) => ({
  welcomeImage: {
    marginStart: "auto",
    marginEnd: "auto",
    marginTop: 60,
    height: 60,
    resizeMode: "contain",
  },
  formContainer: {
    flexGrow: 1,
    padding: 20,
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
  forgotPasswordLink: {
    alignSelf: "stretch",
    alignItems: "center",
    marginTop: 15,
  },
  validationErrorInput: {
    backgroundColor: "#FFE6E6",
    borderWidth: 2,
    borderColor: theme.error,
  },
  validationErrorMessage: {
    color: theme.error,
  },
  showPasswordIcon: (showPassword) => ({
    opacity: showPassword ? null : 0.3,
  }),
});
