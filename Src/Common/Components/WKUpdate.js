import {NativeModules, Linking} from 'react-native';
import WKFetch from "../../Network/WKFetch";
import {appVersion} from '../../../app';

const ALERT_MSG = 'New version is discovered: ';
const ALERT_MSG_DOWNLOAD_NOW_ANDROID = '. Please go to Google Play Store to download';
const ALERT_MSG_DOWNLOAD_NOW_IOS = '. Please go to App Store to download';
const ALERT_CANCEL = 'Cancel';
const ALERT_OK = 'Ok';
const ALERT_TITLE = 'New Version';
const APPLE_ID = '1478203354';

let canShow = true;

class WKUpdate {

    static check() {

        if (!canShow) return;

        WKFetch('/setting/versions', {
            type: this.getType(),
        }).then(ret => {

            const {
                ok,
                result,
            } = ret;

            if (!ok) return;

            canShow = false;

            const {
                version, // 2.0.0
                // type, // 'ios' or 'android'
                update,  // true: force update, false: general update
            } = result || {};

            const hasNewVersion = version > appVersion;
            if (hasNewVersion) {
                const okCallback = () => {
                    canShow = true;
                    if (isIOS) {
                        NativeModules.upgrade.openAPPStore(APPLE_ID);
                        return;
                    }
                    // Open Google Play store market
                    const googlePlayStoreUrl = "market://details?id=com.solarenergy";
                    // const googlePlayStoreUrl = "https://play.google.com/store/apps/details?id=com.solarenergy";
                    const canOpen = Linking.canOpenURL(googlePlayStoreUrl);
                    if (canOpen) {
                        Linking.openURL(googlePlayStoreUrl).then(result => {
                            __DEV__ && console.warn('Check Update: ' + JSON.stringify(result, null, 4));
                        }).catch(error => {
                            __DEV__ && console.warn('Check Update: ' + JSON.stringify(error, null, 4));
                        });
                    }
                };
                const cancelCallBack = () => {
                    canShow = true;
                };
                const msg = isIOS ? `${ALERT_MSG}${version}${ALERT_MSG_DOWNLOAD_NOW_IOS}${update ? ', download now?' : '.'}` : `${ALERT_MSG}${version}${ALERT_MSG_DOWNLOAD_NOW_ANDROID}${update ? ', download now?' : '.'}`;
                WKAlert.show(
                    msg,
                    !update && ALERT_CANCEL,
                    ALERT_OK,
                    okCallback,
                    cancelCallBack,
                    ALERT_TITLE,
                    {
                        cancelable: false,
                        onDismiss: () => {
                        },
                    }
                );
            }
        });
    }

    static getType() {
        return isIOS ? 'powerplus-ios' : 'powerplus-android';
    }

}

export default WKUpdate;