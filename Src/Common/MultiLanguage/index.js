import I18n from './I18n';
import Keys from './Languages/Keys';

const _zh = 'zh';
const _en = 'en';

/*************** Multi-language ******************/

/**
 * Set language
 * @param language language you'd like to set as your primary language, such as 'en' or 'zh'.
 */
global.WK_SL = function (language) {
    I18n.locale = language;
};

/**
 * Translate language
 * @param key string type. Language key to match the corresponding value for the current language
 * @returns {*} return a value for language
 */
global.WK_T = function (key) {
    if (key && typeof key === 'number') {
        const str = key.toString();
        return I18n.t(str);
    }
    if (key && typeof key === 'string') {
        return I18n.t(key);
    }
    __DEV__ && console.error('Error: \nfile: Src/Common/MultiLanguage/index.js\nline: 27\nreason: language key type is incorrect, expect to be a string type');
    return '';
};

/**
 * Judge the current language being used
 * @returns {*|boolean} return a boolean value to determine whether the current language is chinese
 */
global.isChinese = function () {
    const currentLocale = I18n.currentLocale();
    return currentLocale && typeof currentLocale === 'string' && currentLocale.indexOf(_zh) >= 0
};

// Language key used for anywhere while translating language
global.wkLanguageKeys = Keys;

/**
 * Obtain the current language
 * @returns {string} language identifier
 */
global.WK_GetCurrentLocale = function () {
    const currentLocale = I18n.currentLocale();
    if (currentLocale.indexOf(_zh) >= 0) {
        return _zh;
    } else {
        return _en;
    }
};
