import I18n from 'i18n-js';
import * as RNLocalize from 'react-native-localize';
import en from './Languages/en';
import zh from './Languages/zh';
import Languages from "./Languages";
import LanguageCache from "./Model/LanguageCache";

I18n.fallbacks = true;

/**
 * Follow the system language settings
 */
const languageTags = Object.keys(Languages);
const {languageTag} = RNLocalize.findBestAvailableLanguage(languageTags);
I18n.defaultLocale = languageTag;
// I18n.locale = languageTag;
I18n.locale = 'en'; // Set as English language permanently
/**
 * if you have already set the language in app, then the system language settings will be unavailable
 */
LanguageCache.getLanguageCache((isSuccess, language) => {
    if (isSuccess && language) {
        I18n.locale = language;
    }
});

// Supported multiple language
I18n.translations = {
    en,
    zh
};

export default I18n;
