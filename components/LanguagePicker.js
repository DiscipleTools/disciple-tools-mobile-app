import React from 'react';
import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Icon } from 'native-base';

//import useDevice from 'hooks/useDevice';
import useI18N from 'hooks/useI18N';

import { styles } from './LanguagePicker.styles';

const LanguagePicker = () => {
  //const { isIOS } = useDevice();
  const { i18n, isRTL, locale, setLocale } = useI18N();
  return(
    <View style={styles.languagePickerContainer}>
      <Icon type="FontAwesome" name="language" style={styles.languageIcon} />
      <Picker
        selectedValue={locale}
        onValueChange={locale => setLocale(locale)}
        style={styles.languagePicker}
      >
        {Object.keys(i18n?.translations).map(lang => {
          const endonym = i18n.translations[lang]?.endonym ?? null;
          return <Picker.Item label={endonym} value={lang} />
        })}
      </Picker>
    </View>
  );
};
export default LanguagePicker;