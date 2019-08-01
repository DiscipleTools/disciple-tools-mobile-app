import { I18nManager } from 'react-native';
import { Localization } from 'expo';
import i18n from 'i18n-js';

import * as en from './en.json';
import * as ar from './ar.json';

// Set translations and app locale (from device locale)
i18n.defaultLocale = 'en';

i18n.translations = { en, ar };

// Use rtl if active
i18n.isRTL = Localization.isRTL;

// Set default locale if language its not supported
i18n.fallbacks = true;
i18n.locale = Localization.locale;

I18nManager.allowRTL(Localization.isRTL);

export default i18n;
