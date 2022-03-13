import { useEffect } from "react";
import { I18nManager } from 'react-native';

import { useDispatch, useSelector } from "react-redux";

import {
  setLocale as _setLocale
} from "store/actions/i18n.actions";

import * as Localization from "expo-localization";
import * as Updates from 'expo-updates';

//import axios from "services/axios";

//https://github.com/fnando/i18n-js
import i18n from "i18n-js";

import * as ar from "languages/ar.json";
//const ar_MA from 'languages/ar_MA.json');
import * as am_ET from "languages/am_ET.json";
import * as bn_BD from "languages/bn_BD.json";
import * as bs_BA from "languages/bs_BA.json";
import * as cs from "languages/cs.json";
import * as my_MM from "languages/my_MM.json";
import * as zh_CN from "languages/zh_CN.json";
import * as zh_TW from "languages/zh_TW.json";
import * as hr from "languages/hr.json";
import * as nl_NL from "languages/nl_NL.json";
import * as en_US from "languages/en_US.json";
import * as fr_FR from "languages/fr_FR.json";
import * as de_DE from "languages/de_DE.json";
import * as gu from "languages/gu.json";
import * as ha from "languages/ha.json";
import * as hi_IN from "languages/hi_IN.json";
import * as id_ID from "languages/id_ID.json";
import * as it_IT from "languages/it_IT.json";
import * as ja from "languages/ja.json";
import * as kn from "languages/kn.json";
import * as ko_KR from "languages/ko_KR.json";
import * as mk_MK from "languages/mk_MK.json";
import * as mr from "languages/mr.json";
import * as ne_NP from "languages/ne_NP.json";
import * as pa_IN from "languages/pa_IN.json";
import * as fa_IR from "languages/fa_IR.json";
import * as pl from "languages/pl.json";
import * as pt_BR from "languages/pt_BR.json";
import * as ro_RO from "languages/ro_RO.json";
import * as ru_RU from "languages/ru_RU.json";
import * as sr_BA from "languages/sr_BA.json";
import * as sl_SI from "languages/sl_SI.json";
import * as so from "languages/so.json";
import * as es_ES from "languages/es_ES.json";
import * as sw from "languages/sw.json";
import * as tl from "languages/tl.json";
import * as ta from "languages/ta.json";
import * as te from "languages/te.json";
import * as th from "languages/th.json";
import * as tr_TR from "languages/tr_TR.json";
import * as ur from "languages/ur.json";
import * as vi from "languages/vi.json";

i18n.translations = {
  am_ET,
  ar,
  bn_BD,
  bs_BA,
  cs,
  my_MM,
  zh_CN,
  zh_TW,
  hr,
  nl_NL,
  en_US,
  fr_FR,
  de_DE,
  gu,
  ha,
  hi_IN,
  id_ID,
  it_IT,
  ja,
  kn,
  ko_KR,
  mk_MK,
  mr,
  ne_NP,
  pa_IN,
  fa_IR,
  pl,
  pt_BR,
  ro_RO,
  ru_RU,
  sr_BA,
  sl_SI,
  so,
  es_ES,
  sw,
  tl,
  ta,
  te,
  th,
  tr_TR,
  ur,
  vi,
};
i18n.defaultLocale = "en_US";
i18n.fallbacks = true;
// Set fallback chain
i18n.locales.zh = ["zh_CN", "zh_TW"];
//i18n.locales.es = ["es_419","es_ES","es_MX","es_AR","es_CO"];

const RTL_LANGS = [
  "ar", // Arabic
  "arc", // Aramaic
  "dv", // Divehi
  "fa", // Persian
  "ha", // Hausa
  "he", // Hebrew
  "khw", // Khowar
  "ks", // Kashmiri
  "ku", // Kurdish
  "ps", // Pashto
  "ur", // Urdu
  "yi", // Yiddish
];

const useI18N = () => {

  const dispatch = useDispatch();
  const locale = useSelector((state) => state.i18nReducer?.locale);
  const prevLocale = useSelector((state) => state.i18nReducer?.prevLocale);

  const _isRTL = (_locale) => {
    // if param is undefined, then default to use existing/persisted locale
    _locale = _locale ?? locale;
    if (!_locale) return null;
    const countryCode = _locale.substring(0, 2);
    return RTL_LANGS.includes(countryCode);
  };

  const isRTL = _isRTL();

  const reloadApp = (isRTL) => {
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
    setTimeout(() => {
      Updates.reloadAsync();
    }, 500);
    return;
  };

  // TODO: useI18N() is rendered too much, employ useCallback strategy
  useEffect(async() => {
    // if no 'locale' existing in-memory or storage, then use device locale
    if (!locale) {
      setLocale(Localization.locale ?? "en_US");
      return;
    };
    // this condition is used for when redux state is re-initialized
    // TODO: use constant
    if (locale === "en_US" && prevLocale === null) {
      i18n.locale = locale;
      setLocale(locale);
      if (I18nManager.isRTL) {
        reloadApp(false);
        return;
      };
    }
    // if I18nManager is out of sync, reload
    if (_isRTL(locale) !== I18nManager.isRTL) {
      reloadApp(isRTL);
      return;
    };
    // assume that we have already handled the locale change
    if (locale === prevLocale) return;
    // set new locale in memory and in storage, and restart if swtiching to RTL/LTR
    // NOTE: order of operations is important here, as is the app reload delay
    i18n.locale = locale;
    setLocale(locale);
    if ((_isRTL(locale) && !_isRTL(prevLocale)) || ((!_isRTL(locale) && (_isRTL(prevLocale))) && (_isRTL(prevLocale) && !prevLocale))) {
      reloadApp(isRTL);
      return;
    };
    return;
  }, [locale]);

  const setLocale = async(locale) => {
    dispatch(_setLocale(locale));
  };

  const selectedEndonym = i18n?.translations[locale]?.endonym ?? ''; 

  return {
    i18n,
    isRTL,
    locale,
    setLocale,
    selectedEndonym,
  };
};
export default useI18N;
