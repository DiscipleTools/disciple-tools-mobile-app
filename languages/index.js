import { I18nManager } from 'react-native';
import i18n from 'i18n-js';
import locales from './locales';

const ar = require('./ar.json');
//const ar_MA = require('./ar_MA.json');
const am_ET = require('./am_ET.json');
const bn_BD = require('./bn_BD.json');
const bs_BA = require('./bs_BA.json');
const cs = require('./cs.json');
const my_MM = require('./my_MM.json');
const zh_CN = require('./zh_CN.json');
const zh_TW = require('./zh_TW.json');
const hr = require('./hr.json');
const nl_NL = require('./nl_NL.json');
const en_US = require('./en_US.json');
const fr_FR = require('./fr_FR.json');
const de_DE = require('./de_DE.json');
const gu = require('./gu.json');
const ha = require('./ha.json');
const hi_IN = require('./hi_IN.json');
const id_ID = require('./id_ID.json');
const it_IT = require('./it_IT.json');
const ja = require('./ja.json');
const kn = require('./kn.json');
const ko_KR = require('./ko_KR.json');
const mk_MK = require('./mk_MK.json');
const mr = require('./mr.json');
const ne_NP = require('./ne_NP.json');
const pa_IN = require('./pa_IN.json');
const fa_IR = require('./fa_IR.json');
const pl = require('./pl.json');
const pt_BR = require('./pt_BR.json');
const ro_RO = require('./ro_RO.json');
const ru_RU = require('./ru_RU.json');
const sr_BA = require('./sr_BA.json');
const sl_SI = require('./sl_SI.json');
const so = require('./so.json');
const es_ES = require('./es_ES.json');
const sw = require('./sw.json');
const tl = require('./tl.json');
const ta = require('./ta.json');
const te = require('./te.json');
const th = require('./th.json');
const tr_TR = require('./tr_TR.json');
const ur = require('./ur.json');
const vi = require('./vi.json');

i18n.getLocaleObj = function getLocaleObj(locale) {
  var localeObj = locales.find((item) => {
    return item.code === locale;
  });
  if (localeObj !== undefined) {
    return localeObj;
  } else {
    if (locale.length > 1) {
      const subcode = locale.substring(0, 2);
      if (i18n.locales.hasOwnProperty(subcode)) {
        const subLangCodes = i18n.locales[subcode];
        for (var ii = 0; ii < subLangCodes.length; ii++) {
          const subLangCode = subLangCodes[ii];
          localeObj = locales.find((item) => {
            return item.code === subLangCode;
          });
          if (localeObj !== null) break;
        }
      }
    }
    if (localeObj === undefined) {
      const defaultCode = i18n.defaultLocale.toString();
      localeObj = locales.find((item) => {
        return item.code === defaultCode;
      });
    }
    return localeObj;
  }
};

// Do not try to set I18nManager.isRTL here as it will have no effect.
// To change RTL, use I18nManager.forceRTL(bool) and then refresh the app
// to see the direction changed.
i18n.setLocale = function setLocale(languageCode) {
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

  const localeObj = this.getLocaleObj(languageCode);
  const locale = localeObj.code;
  const isRTL = localeObj.rtl;
  this.locale = locale;
  // Enable/Disable RTL
  I18nManager.allowRTL(isRTL);
  I18nManager.forceRTL(isRTL);
  return localeObj;
};

export default i18n;
