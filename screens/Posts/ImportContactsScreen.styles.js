export const localStyles = ({ theme, isRTL, isIOS }) => ({
  inputContainer: {
    alignSelf: "stretch",
    marginVertical: 10,
    padding: 5,
    alignItems: "flex-start",
  },
  inputLabel: {
    margin: 5,
  },
  inputLabelText: {
    color: "#555555",
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
  welcomeImage: {
    height: 60,
    width: 250,
    resizeMode: "contain",
    padding: 20,
  },
  formContainer: {
    alignSelf: "stretch",
    flexGrow: 1,
    padding: 20,
  },
  signInButton: {
    marginTop: 10,
    backgroundColor: Colors.tintColor,
    borderRadius: 10,
  },
  signInButtonText: {
    color: "white",
  },
  forgotButton: {
    alignSelf: "stretch",
    alignItems: "center",
    padding: 12,
    marginLeft: 20,
    marginRight: 20,
  },
  forgotButtonText: {
    color: Colors.tintColor,
  },
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  textField: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#fff",
  },
  validationErrorInput: {
    backgroundColor: "#FFE6E6",
    borderWidth: 2,
    borderColor: Colors.errorBackground,
  },
  validationErrorMessage: {
    color: Colors.errorBackground,
  },
  headerText: {
    fontSize: 25,
    textAlign: "center",
    margin: 10,
    color: "black",
    fontWeight: "bold",
  },
  textBoxContainer: {
    position: "relative",
    alignSelf: "stretch",
    justifyContent: "center",
  },
  textBox: {
    fontSize: 16,
    paddingRight: 30,
    paddingLeft: 8,
    paddingVertical: 0,
    flex: 1,
  },
  touchableButton: {
    position: "absolute",
    right: 10,
    height: 75,
    padding: 2,
  },
  buttonImage: {
    resizeMode: "contain",
    height: "100%",
    width: "100%",
  },
  spinner: {
    margin: 20,  
  }
});
