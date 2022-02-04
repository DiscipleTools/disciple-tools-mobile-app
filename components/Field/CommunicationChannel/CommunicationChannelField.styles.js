// TODO: refactor to use global styles
export const localStyles = ({ theme, isRTL, isIOS }) => ({
  addRemoveIcons: {
    fontSize: 30,
    marginRight: 0,
    color: "green", //Colors.addRemoveIcons,
  },
  addIcons: { color: "green" },
  removeIcons: { color: "red" },
  formIconLabel: {
    marginLeft: 10,
    width: "auto",
    marginBottom: "auto",
  },
  formIcon: {
    color: theme.text.primary, //Colors.tintColor,
    fontSize: 22,
    marginTop: "auto",
    marginBottom: "auto",
    width: 25,
  },
  formLabel: {
    color: theme.text.primary, //Colors.tintColor,
    marginTop: "auto",
    marginBottom: "auto",
  },
  formFieldMargin: {
    marginTop: 20,
    marginBottom: 10,
  },
  selectizeField: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#B4B4B4",
    borderBottomWidth: 1.5,
    borderBottomColor: "#B4B4B4",
    borderRadius: 5,
    minHeight: 50,
    marginTop: -15,
    padding: 10,
  },
  linkingText: {
    paddingTop: 4,
    paddingBottom: 8,
    color: theme.text.link,
    textDecorationLine: "underline",
  },
  field: {
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 5,
    borderStyle: "solid",
    borderColor: theme.divider,
    height: "auto",
    fontSize: 14,
    minHeight: 40, 
  },
});