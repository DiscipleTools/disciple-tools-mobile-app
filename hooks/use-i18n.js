import { useCallback, useEffect, useMemo } from "react";
import { Alert, I18nManager } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment/min/moment-with-locales";

import { setLocale } from "store/actions/i18n.actions";

import * as Localization from "expo-localization";
import * as Updates from "expo-updates";

//https://github.com/fnando/i18n-js
import i18n from "i18n-js";

import * as am_ET from "languages/am_ET.json";
import * as ar from "languages/ar.json";
import * as ar_MA from "languages/ar_MA.json";
import * as bg_BG from "languages/bg_BG.json";
import * as bn_BD from "languages/bn_BD.json";
import * as bs_BA from "languages/bs_BA.json";
import * as cs from "languages/cs.json";
import * as de_DE from "languages/de_DE.json";
import * as en_US from "languages/en_US.json";
import * as es_ES from "languages/es_ES.json";
import * as fa_IR from "languages/fa_IR.json";
import * as fr_FR from "languages/fr_FR.json";
import * as gu from "languages/gu.json";
import * as ha from "languages/ha.json";
import * as hi_IN from "languages/hi_IN.json";
import * as hr from "languages/hr.json";
import * as hu_HU from "languages/hu_HU.json";
import * as id_ID from "languages/id_ID.json";
import * as it_IT from "languages/it_IT.json";
import * as ja from "languages/ja.json";
import * as kn from "languages/kn.json";
import * as ko_KR from "languages/ko_KR.json";
import * as ku from "languages/ku.json";
import * as lo from "languages/lo.json";
import * as mk_MK from "languages/mk_MK.json";
import * as ml from "languages/ml.json";
import * as mr from "languages/mr.json";
import * as my_MM from "languages/my_MM.json";
import * as ne_NP from "languages/ne_NP.json";
import * as nl_NL from "languages/nl_NL.json";
import * as pa_IN from "languages/pa_IN.json";
import * as pl from "languages/pl.json";
import * as pt_BR from "languages/pt_BR.json";
import * as ro_RO from "languages/ro_RO.json";
import * as ru_RU from "languages/ru_RU.json";
import * as sl_SI from "languages/sl_SI.json";
import * as so from "languages/so.json";
import * as sr_BA from "languages/sr_BA.json";
import * as sw from "languages/sw.json";
import * as ta from "languages/ta.json";
import * as te from "languages/te.json";
import * as th from "languages/th.json";
import * as tl from "languages/tl.json";
import * as tr_TR from "languages/tr_TR.json";
import * as uk from "languages/uk.json";
import * as ur from "languages/ur.json";
import * as vi from "languages/vi.json";
import * as yo from "languages/yo.json";
import * as zh_CN from "languages/zh_CN.json";
import * as zh_TW from "languages/zh_TW.json";

const DEFAULT_LOCALE = "en_US";

i18n.translations = {
  am_ET,
  ar,
  ar_MA,
  bg_BG,
  bn_BD,
  bs_BA,
  cs,
  de_DE,
  en_US,
  es_ES,
  fa_IR,
  fr_FR,
  gu,
  ha,
  hi_IN,
  hr,
  hu_HU,
  id_ID,
  it_IT,
  ja,
  kn,
  ko_KR,
  ku,
  lo,
  mk_MK,
  ml,
  mr,
  my_MM,
  ne_NP,
  nl_NL,
  pa_IN,
  pl,
  pt_BR,
  ro_RO,
  ru_RU,
  sl_SI,
  so,
  sr_BA,
  sw,
  ta,
  te,
  th,
  tl,
  tr_TR,
  uk,
  ur,
  vi,
  yo,
  zh_CN,
  zh_TW,
};
i18n.defaultLocale = DEFAULT_LOCALE;
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

const useI18N = () => {
  const dispatch = useDispatch();
  const locale = useSelector((state) => state.i18nReducer?.locale);

  const getCountryCode = useCallback((locale) => locale?.substring(0, 2), []);

  const _isRTL = useCallback(
    (_locale) => {
      // if param is undefined, then default to use existing/persisted locale
      _locale = _locale ?? locale;
      if (!_locale) return null;
      const countryCode = getCountryCode(_locale);
      return RTL_LANGS.includes(countryCode);
    },
    [locale]
  );

  const mapLocaleToMomentLocale = useCallback((_locale) => {
    const special = ["ar_MA", "bn_BD", "pt_BR", "tl"];
    if (special.includes(_locale)) {
      if (_locale === "tl") return "tl-ph";
      return _locale?.toLowerCase()?.replace("_", "-") ?? "en";
    }
    return _locale?.split("_")?.[0];
  }, []);

  useEffect(() => {
    // if no 'locale' existing in-memory or storage, then use device locale
    if (!locale) {
      _setLocale(Localization?.locale ?? DEFAULT_LOCALE);
      return;
    }
    // sync in-memory locale
    if (i18n?.locale !== locale) {
      i18n.locale = locale;
      moment.locale(mapLocaleToMomentLocale(locale));
    }
    return;
  }, [locale]);

  const reloadApp = useCallback(() => {
    setTimeout(() => {
      Updates.reloadAsync();
    }, 1000);
  }, []);

  const _setLocale = (_locale) => {
    const isRTL = _isRTL(_locale);
    if (i18n?.locale !== _locale) {
      i18n.locale = _locale;
    }
    if (moment?.locale() !== mapLocaleToMomentLocale(_locale)) {
      moment.locale(mapLocaleToMomentLocale(_locale));
    }
    if (locale !== _locale) {
      dispatch(setLocale(_locale));
    }
    if (isRTL !== I18nManager?.isRTL) {
      I18nManager.allowRTL(isRTL);
      I18nManager.forceRTL(isRTL);
      Alert.alert(i18n.t("global.alert"), i18n.t("global.appRestart"), [
        {
          text: "OK",
          onPress: () => reloadApp(),
        },
      ]);
    }
  };

  const numberFormat = useCallback(
    (numberValue) => {
      try {
        return new Intl.NumberFormat(locale?.replace("_", "-")).format(
          numberValue
        );
      } catch (error) {
        return numberValue;
      }
    },
    [locale]
  );

  const selectedEndonym = useMemo(
    () => i18n?.translations[locale]?.endonym ?? "",
    [locale]
  );

  return {
    i18n,
    get isRTL() {
      return _isRTL();
    },
    locale,
    setLocale: _setLocale,
    selectedEndonym,
    moment,
    numberFormat,
  };
};
export default useI18N;
