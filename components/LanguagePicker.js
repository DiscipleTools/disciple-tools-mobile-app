import React from 'react';
import { Text, View } from 'react-native';
import { Picker as RNPicker } from '@react-native-picker/picker';
import {
  Body,
  Button,
  Icon,
  Left,
  ListItem,
  Picker as NBPicker,
  Right,
 } from 'native-base';

import useDevice from 'hooks/useDevice';
import useI18N from 'hooks/useI18N';

import { styles } from './LanguagePicker.styles';

const LanguagePicker = ({ dropdown }) => {
  const { isIOS } = useDevice();
  const { i18n, isRTL, locale, setLocale } = useI18N();
  return(
    <>
      { dropdown ? (
        <ListItem icon>
          <Left>
            <Button style={styles.button}>
              <Icon active type="FontAwesome" name="language" />
            </Button>
          </Left>
          <Body style={styles.body}>
            <Text
              style={{
                writingDirection: isRTL ? 'rtl' : 'ltr',
                textAlign: isRTL ? 'right' : 'left',
              }}>
              {i18n.t('global.language')}
            </Text>
          </Body>
          <Right>
            <NBPicker
              selectedValue={locale}
              onValueChange={locale => setLocale(locale)}
              iosIcon={<Icon style={styles.pickerIosIcon} name="caret-down" />}
              style={isIOS ? { width: 150 } : null}
            >
              {Object.keys(i18n?.translations).map(lang => {
                const endonym = i18n.translations[lang]?.endonym ?? null;
                return <NBPicker.Item label={endonym} value={lang} />
              })}
            </NBPicker>
          </Right>
        </ListItem>
      ) : (
        <View style={styles.languagePickerContainer}>
          <Icon type="FontAwesome" name="language" style={styles.languageIcon} />
          <RNPicker
            selectedValue={locale}
            onValueChange={locale => setLocale(locale)}
            style={styles.languagePicker}
          >
            {Object.keys(i18n?.translations).map(lang => {
              const endonym = i18n.translations[lang]?.endonym ?? null;
              return <RNPicker.Item label={endonym} value={lang} />
            })}
          </RNPicker>
        </View>
      )}
    </>
  );
};
export default LanguagePicker;