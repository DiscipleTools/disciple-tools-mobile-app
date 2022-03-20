export const localStyles = ({ theme, isRTL, isIOS }) => ({
  button: {
    backgroundColor: theme.brand.primary,
  },
  languagePickerContainer: {
    backgroundColor: theme.surface.primary,
    padding: 5,
    alignItems: "center",
    marginHorizontal: 10,
  },
  pickerIosIcon: {
    color: theme.text.secondary,
  },
});