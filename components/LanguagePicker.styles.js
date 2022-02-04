export const localStyles = ({ theme, isRTL, isIOS }) => ({
  button: {
    backgroundColor: theme.brand.primary,
  },
  languagePickerContainer: {
    flexDirection: isRTL ? "row-reverse" : "row",
    backgroundColor: theme.surface.primary,
    padding: 5,
    alignItems: "center",
    marginHorizontal: 10,
  },
  pickerIosIcon: {
    color: theme.text.secondary,
  },
});