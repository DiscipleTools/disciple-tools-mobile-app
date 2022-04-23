import { useEffect, useMemo } from "react";
import { Alert, I18nManager } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment/min/moment-with-locales';

import useMyUser from "hooks/use-my-user";

import { setLocale } from "store/actions/i18n.actions";

import * as Localization from "expo-localization";
import * as Updates from 'expo-updates';

//import axios from "services/axios";

//https://github.com/fnando/i18n-js
import i18n from "i18n-js";

import * as ar from "languages/ar.json";
//const ar_MA from 'languages/ar_MA.json');
/*
import * as am_ET from "languages/am_ET.json";
import * as bn_BD from "languages/bn_BD.json";
import * as bs_BA from "languages/bs_BA.json";
import * as cs from "languages/cs.json";
import * as my_MM from "languages/my_MM.json";
import * as zh_CN from "languages/zh_CN.json";
import * as zh_TW from "languages/zh_TW.json";
import * as hr from "languages/hr.json";
import * as nl_NL from "languages/nl_NL.json";
*/
import * as en_US from "languages/en_US.json";
/*
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
*/
import * as fa_IR from "languages/fa_IR.json";
/*
import * as pl from "languages/pl.json";
import * as pt_BR from "languages/pt_BR.json";
import * as ro_RO from "languages/ro_RO.json";
import * as ru_RU from "languages/ru_RU.json";
import * as sr_BA from "languages/sr_BA.json";
import * as sl_SI from "languages/sl_SI.json";
import * as so from "languages/so.json";
*/
import * as es_ES from "languages/es_ES.json";
/*
import * as sw from "languages/sw.json";
import * as tl from "languages/tl.json";
import * as ta from "languages/ta.json";
import * as te from "languages/te.json";
import * as th from "languages/th.json";
import * as tr_TR from "languages/tr_TR.json";
import * as ur from "languages/ur.json";
import * as vi from "languages/vi.json";
*/

i18n.translations = {
  //am_ET,
  ar,
  //bn_BD,
  //bs_BA,
  //cs,
  //my_MM,
  //zh_CN,
  //zh_TW,
  //hr,
  //nl_NL,
  en_US,
  //fr_FR,
  //de_DE,
  //gu,
  //ha,
  //hi_IN,
  //id_ID,
  //it_IT,
  //ja,
  //kn,
  //ko_KR,
  //mk_MK,
  //mr,
  //ne_NP,
  //pa_IN,
  fa_IR,
  //pl,
  //pt_BR,
  //ro_RO,
  //ru_RU,
  //sr_BA,
  //sl_SI,
  //so,
  es_ES,
  //sw,
  //tl,
  //ta,
  //te,
  //th,
  //tr_TR,
  //ur,
  //vi,
};
i18n.defaultLocale = "en_US";
i18n.fallbacks = true;
// Set fallback chain
//i18n.locales.zh = ["zh_CN", "zh_TW"];
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

const DEFAULT_LOCALE = "en_US";

const useI18N = () => {

  const dispatch = useDispatch();
  const locale = useSelector((state) => state.i18nReducer?.locale);
  const { data: userData } = useMyUser();

  const getCountryCode = (locale) => locale?.substring(0,2);

  const _isRTL = (_locale) => {
    // if param is undefined, then default to use existing/persisted locale
    _locale = _locale ?? locale;
    if (!_locale) return null;
    const countryCode = getCountryCode(_locale);
    return RTL_LANGS.includes(countryCode);
  };

  const isRTL = _isRTL();

  const mapLocaleToMomentLocale = (locale) => {
    const special = [
      "pt_BR",
    ];
    if (special.includes(locale)) {
      switch(locale) {
        case "pt_BR":
          return "pt-br";
        default:
          return "en";
      };
    };
    return locale?.split("_")?.[0];
  };

  useEffect(() => {
    // if no 'locale' existing in-memory or storage, then use device locale
    if (!locale) _setLocale(Localization?.locale ?? DEFAULT_LOCALE);
    // NOTE: not sure why this is necessary, but it is...
    if (locale !== i18n?.locale) {
      i18n.locale = locale;
      moment.locale(mapLocaleToMomentLocale(locale));
    };
  }, [locale]);

  // NOTE: detect API language change and update app locale
  useEffect(() => {
    if (userData?.locale !== locale) _setLocale(locale);
  }, [userData?.locale]);

  const reloadApp = () => {
    setTimeout(() => {
      Updates.reloadAsync();
    }, 1000);
  };

  const _setLocale = (_locale) => {
    if (_locale !== locale) {
      i18n.locale = _locale;
      moment.locale(mapLocaleToMomentLocale(_locale));
      const isRTL = _isRTL(_locale);
      dispatch(setLocale(_locale));
      if (isRTL !== I18nManager?.isRTL) {
        I18nManager.allowRTL(isRTL);
        I18nManager.forceRTL(isRTL);
        Alert.alert(
          i18n.t("global.alert"),
          i18n.t("global.appRestart"),
          [
            {
              text: "OK",
              onPress: () => reloadApp()
            }
          ]
        );
      };
    };
  };

  const selectedEndonym = i18n?.translations[locale]?.endonym ?? ''; 

  return useMemo(() => ({
    i18n,
    isRTL,
    locale,
    setLocale: _setLocale,
    selectedEndonym,
    moment
  }), [isRTL, locale, selectedEndonym]);
};
export default useI18N;