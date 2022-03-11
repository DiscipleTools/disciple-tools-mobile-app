import React from "react";
import { Text, View } from "react-native";
import { Picker as RNPicker } from "@react-native-picker/picker";
import {
  Body,
  Button,
  Icon,
  Left,
  ListItem,
  Picker as NBPicker,
  Right,
} from "native-base";

import useAPI from "hooks/use-api";
import useDevice from "hooks/use-device";
import useI18N from "hooks/use-i18n";
import useStyles from "hooks/use-styles";
import useToast from "hooks/use-toast";

import { localStyles } from "./LanguagePicker.styles";

/*
        <ListItem icon>
          <Left>
            <Button style={styles.button}>
              <Icon active type="FontAwesome" name="language" />
            </Button>
          </Left>
          <Body style={styles.body}>
            <Text
              style={{
                writingDirection: isRTL ? "rtl" : "ltr",
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {i18n.t("global.language", { locale })}
            </Text>
          </Body>
          <Right>
            <NBPicker
              selectedValue={locale}
              onValueChange={async(locale) => {
                try {
                  await updateUser(locale);
                } catch (error) {
                  // TODO: generic error
                  toast(error.message, true);
                };
                setLocale(locale);
              }}
              iosIcon={<Icon style={styles.pickerIosIcon} name="caret-down" />}
              style={isIOS ? { width: 150 } : null}
            >
              {Object.keys(i18n?.translations).map((lang) => {
                const endonym = i18n.translations[lang]?.endonym ?? null;
                return <NBPicker.Item key={endonym} label={endonym} value={lang} />;
              })}
            </NBPicker>
          </Right>
        </ListItem>
*/
const LanguagePicker = ({ dropdown }) => {
  const { styles, globalStyles } = useStyles(localStyles);
  const { isIOS } = useDevice();
  const { i18n, isRTL, locale, setLocale } = useI18N();
  const toast = useToast();
  //const { updateUser } = useAPI();
  return (
    <View style={styles.languagePickerContainer}>
      <Icon
        type="FontAwesome"
        name="language"
        style={styles.languageIcon}
      />
      <RNPicker
        selectedValue={locale}
        onValueChange={(locale) => setLocale(locale)}
        style={styles.languagePicker}
      >
        {Object.keys(i18n?.translations).map((lang) => {
          const endonym = i18n.translations[lang]?.endonym ?? null;
          return <RNPicker.Item key={endonym} label={endonym} value={lang} />;
        })}
      </RNPicker>
    </View>
  );
};
export default LanguagePicker;
