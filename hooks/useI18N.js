import React, { useEffect } from 'react';
//import { I18nManager } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';

import { setLocale } from 'store/actions/i18n.actions';

import * as Localization from 'expo-localization';
//import * as Updates from 'expo-updates';

//https://github.com/fnando/i18n-js
import i18n from 'i18n-js';

import * as ar from 'languages/ar.json';
//const ar_MA from 'languages/ar_MA.json');
import * as am_ET from 'languages/am_ET.json';
import * as bn_BD from 'languages/bn_BD.json';
import * as bs_BA from 'languages/bs_BA.json';
import * as cs from 'languages/cs.json';
import * as my_MM from 'languages/my_MM.json';
import * as zh_CN from 'languages/zh_CN.json';
import * as zh_TW from 'languages/zh_TW.json';
import * as hr from 'languages/hr.json';
import * as nl_NL from 'languages/nl_NL.json';
import * as en_US from 'languages/en_US.json';
import * as fr_FR from 'languages/fr_FR.json';
import * as de_DE from 'languages/de_DE.json';
import * as gu from 'languages/gu.json';
import * as ha from 'languages/ha.json';
import * as hi_IN from 'languages/hi_IN.json';
import * as id_ID from 'languages/id_ID.json';
import * as it_IT from 'languages/it_IT.json';
import * as ja from 'languages/ja.json';
import * as kn from 'languages/kn.json';
import * as ko_KR from 'languages/ko_KR.json';
import * as mk_MK from 'languages/mk_MK.json';
import * as mr from 'languages/mr.json';
import * as ne_NP from 'languages/ne_NP.json';
import * as pa_IN from 'languages/pa_IN.json';
import * as fa_IR from 'languages/fa_IR.json';
import * as pl from 'languages/pl.json';
import * as pt_BR from 'languages/pt_BR.json';
import * as ro_RO from 'languages/ro_RO.json';
import * as ru_RU from 'languages/ru_RU.json';
import * as sr_BA from 'languages/sr_BA.json';
import * as sl_SI from 'languages/sl_SI.json';
import * as so from 'languages/so.json';
import * as es_ES from 'languages/es_ES.json';
import * as sw from 'languages/sw.json';
import * as tl from 'languages/tl.json';
import * as ta from 'languages/ta.json';
import * as te from 'languages/te.json';
import * as th from 'languages/th.json';
import * as tr_TR from 'languages/tr_TR.json';
import * as ur from 'languages/ur.json';
import * as vi from 'languages/vi.json';

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
i18n.defaultLocale = 'en_US';
i18n.fallbacks = true;
// Set fallback chain
i18n.locales.zh = ['zh_CN', 'zh_TW'];
//i18n.locales.es = ["es_419","es_ES","es_MX","es_AR","es_CO"];

const RTL_LANGS = [
  'ar', // Arabic
  'arc', // Aramaic
  'dv', // Divehi
  'fa', // Persian
  'ha', // Hausa
  'he', // Hebrew
  'khw', // Khowar
  'ks', // Kashmiri
  'ku', // Kurdish
  'ps', // Pashto
  'ur', // Urdu
  'yi', // Yiddish
];

const useI18N = () => {

  const dispatch = useDispatch();

  /*
  const [state, setState] = React.useState({
    locale: 
  });
  */

  let locale = useSelector((state) => state.i18nReducer.locale);

  /*
  useEffect(() => {
    console.log(`useEffect - locale: ${locale}`);
  }, [locale]);
  */

  // if no 'locale' existing in-memory or storage, then use device locale
  if (!locale) locale = Localization.locale;

  i18n.locale = locale;

  const isRTL = (locale) => {
    const countryCode = locale.substring(0, 2);
    return RTL_LANGS.includes(countryCode);
  };

  const _setLocale = (locale) => {
    // TODO: set remote D.T Instance
    // TODO: handle RTL

    //i18n.locale = locale;
    dispatch(setLocale(locale));
    /*
    // Enable/Disable RTL
    if (isRTL(locale)) {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
    };
        // NOTE: This is obviously less than ideal bc we are guessing about how long to give Redux Persist time to write global state to AsyncStorage (so it is available upon App Restart). Unfotunately, 'try/finally' does not work bc the delay is not long enough.  It is for the same reason that we do not move this to a Saga, bc we need to ensure that the Redux State reduces and persists prior to App Restart.
        setTimeout(() => {
          Updates.reloadAsync();
        }, 1000);
    */
    console.log(`*** setLocale(${locale}) ***`);
    return;
  };

  return {
    i18n,
    isRTL,
    locale,
    setLocale: _setLocale
  };
};
export default useI18N;
