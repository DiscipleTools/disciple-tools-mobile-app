import { I18nManager } from 'react-native';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

import * as en from './en.json';
import * as ar from './ar.json';
import * as es from './es.json';
import * as fa from './fa.json';
import * as fr from './fr.json';
import * as pt from './pt.json';
import * as ru from './ru.json';
import * as tr from './tr.json';
import * as zhCn from './zh-cn.json';
import * as zhTw from './zh-tw.json';

i18n.fallbacks = true;
i18n.translations = {
  en,
  ar,
  es,
  fa,
  fr,
  pt,
  ru,
  tr,
  zhCn,
  zhTw,
};
i18n.locale = Localization.locale;
i18n.isRTL = I18nManager.isRTL;

I18nManager.allowRTL(true);

// Do not try to set I18nManager.isRTL here as it will have no effect.
// To change RTL, use I18nManager.forceRTL(bool) and then refresh the app
// to see the direction changed.

i18n.setLocale = function setLocale(locale) {
  Localization.locale = locale;
  this.locale = Localization.locale;
};

export default i18n;
