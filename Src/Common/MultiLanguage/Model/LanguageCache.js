export default class LanguageCache {

    /**
     * Set language cache
     * @param value language key such as 'zh'、'en' and the like
     */
    static setLanguageCache = (value) => {
        WKStorage.setItem(CacheKeys.multiLanguage, {key: value});
    };

    /**
     * Get language cache
     * @param callback success or failed callback
     */
    static getLanguageCache = (callback) => {
        WKStorage.getItem(CacheKeys.multiLanguage)
            .then(result => {
                if (!result) {
                    callback && callback(false);
                    return;
                }
                callback && callback(true, result.key);
            })
            .catch(() => {
                callback && callback(false);
            });
    };

}
