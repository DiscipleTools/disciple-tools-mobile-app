import { I18nManager } from 'react-native';
import { Localization } from 'expo';
import i18n from 'i18n-js';

import * as en from './en.json';
import * as ar from './ar.json';

// Below for debugging RTL only. Do not leave uncommented
// Localization.locale = 'ar';
// Localization.isRTL = true;

i18n.fallbacks = true;
i18n.translations = { en, ar };
i18n.locale = Localization.locale;
i18n.isRTL = Localization.isRTL;

I18nManager.forceRTL(Localization.isRTL);

export default i18n;
