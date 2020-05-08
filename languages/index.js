import { I18nManager } from 'react-native';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

// Intl fix
import 'intl';
// Imports by supported languages (When adding or removing a new language, modify this imports and imports of 'languages/moment.js' file)
import 'intl/locale-data/jsonp/en';
import 'intl/locale-data/jsonp/ar';
import 'intl/locale-data/jsonp/bn';
import 'intl/locale-data/jsonp/es';
import 'intl/locale-data/jsonp/fa';
import 'intl/locale-data/jsonp/fr';
import 'intl/locale-data/jsonp/id';
import 'intl/locale-data/jsonp/nl';
import 'intl/locale-data/jsonp/pt';
import 'intl/locale-data/jsonp/ru';
import 'intl/locale-data/jsonp/sw';
import 'intl/locale-data/jsonp/tr';
import 'intl/locale-data/jsonp/zh';

import * as en from './en.json';
import * as bn from './bn.json';
import * as es from './es.json';
import * as fr from './fr.json';
import * as id from './id.json';
import * as nl from './nl.json';
import * as ptBR from './pt.json';
import * as ru from './ru.json';
import * as sw from './sw.json';
import * as tr from './tr.json';
import * as zhCn from './zhCn.json';
import * as zhTw from './zhTw.json';
import * as ar from './ar.json';
import * as fa from './fa.json';

i18n.fallbacks = true;
i18n.translations = {
  en,
  bn,
  es,
  fr,
  id,
  nl,
  'pt-BR': ptBR,
  ru,
  sw,
  tr,
  'zh-hans': zhCn,
  'zh-hant': zhTw,
  ar,
  fa,
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
