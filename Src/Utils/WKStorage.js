import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';

const asyncStorage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    enableCache: true
});

export default class WKStorage {

    /**
     * Store a value for a string key
     * @param key: string type without underscore
     * @param value: object, string, or model
     */
    static setItem = (key, value) => {
        asyncStorage.save({key: key, data: value});
    };

    /**
     * Get a value for corresponding key
     * @param key: a string key stored before
     */
    static getItem = (key) => {
        return asyncStorage.load({key: key});
    };

    /* Deprecated
    static getItem = (key, callback) => {
        asyncStorage.load({key: key})
            .then(ret => {
                const result = {
                    ok: true,
                    data: ret,
                    errorMsg: ''
                };
                callback(result);
            })
            .catch(error => {
                const result = {
                    ok: false,
                    data: null,
                    errorMsg: error.message
                };
                callback(result);
            });
    };*/

    /**
     * Remove a value stored in memory for key
     * @param key
     */
    static removeItem = (key) => {
        asyncStorage.remove({key: key});
    };

    /**
     * Remove all values for all keys in this project
     */
    static removeAll = () => {
        Object.keys(CacheKeys).forEach(key => {
            this.removeItem(key);
        });
    }

}