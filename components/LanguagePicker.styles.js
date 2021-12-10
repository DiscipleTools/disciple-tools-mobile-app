import { StyleSheet } from 'react-native';
import Colors from 'constants/Colors';

export const styles = StyleSheet.create({
  body: {
    alignItems: 'flex-start',
  },
  button: {
    backgroundColor: Colors.tintColor,
  },
  languagePickerContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.gray,
    padding: 5,
    alignItems: 'center',
  },
  languagePicker: {
    flex: 1,
  },
  languageIcon: {
    marginHorizontal: 20,
  },
  pickerIosIcon: {
    color: Colors.grayDark,
  },
});
