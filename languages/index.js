import { Localization } from 'expo';
import i18n from 'i18n-js';

import * as en from './en.json';
import * as ar from './ar.json';

i18n.fallbacks = true;
i18n.translations = { en, ar };
i18n.locale = Localization.locale;

export default i18n;
