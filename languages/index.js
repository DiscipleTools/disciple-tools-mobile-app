import { I18nManager } from 'react-native';
import i18n from 'i18n-js';
// This import is added to enable momentJS library (do not delete)
import moment from './moment';

import * as en from './en.json';
import * as ar from './ar.json';
import * as bn from './bn.json';
import * as es from './es.json';
import * as fr from './fr.json';
import * as id from './id.json';
import * as nl from './nl.json';
import * as ptBR from './pt.json';
import * as ru from './ru.json';
import * as sr from './sr.json';
import * as sl from './sl.json';
import * as hr from './hr.json';
import * as sw from './sw.json';
import * as tr from './tr.json';
import * as zhCn from './zhCn.json';
import * as zhTw from './zhTw.json';
import * as fa from './fa.json';

i18n.fallbacks = true;
i18n.defaultLocale = 'en-US';
// Locale codes names as expo-localization -> Localization.locale format (device)
i18n.translations = {
  'en-US': en,
  ar,
  'bn-BD': bn,
  'es-ES': es,
  'fa-IR': fa,
  'fr-FR': fr,
  'id-ID': id,
  'nl-NL': nl,
  'pt-BR': ptBR,
  'ru-RU': ru,
  sr,
  sl,
  hr,
  sw,
  'tr-TR': tr,
  'zh-CN': zhCn,
  'zh-TW': zhTw,
};

// Do not try to set I18nManager.isRTL here as it will have no effect.
// To change RTL, use I18nManager.forceRTL(bool) and then refresh the app
// to see the direction changed.

i18n.setLocale = async function setLocale(locale, isRTL) {
  this.locale = locale;
  // Enable/Disable RTL
  I18nManager.allowRTL(isRTL);
  I18nManager.forceRTL(isRTL);
  // Update momentJS locale
  let momentLocale =
    locale.substring(0, 2) === 'zh' ? locale.toLowerCase() : locale.substring(0, 2);
  moment.locale(momentLocale);
};

export default i18n;
