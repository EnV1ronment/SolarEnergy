import React from 'react';
import {
    Dimensions,
    Platform,
} from 'react-native';

// Constants
import Colors from "./Colors";
import RouteKeys from './RouteKeys';
import CacheKeys from './CacheKeys';
import Methods from './Methods';
import EmitterEvents from './EmitterEvents';

// Utils
import WKStorage from '../../Utils/WKStorage';

// Components
import WKToast from '../Components/WKToast';
import WKLoading from "../Components/WKLoading";
import WKAlert from "../Components/WKAlert";

const {width, height} = Dimensions.get('window');

// Device size
global.__SCREEN_WIDTH__ = width;
global.__SCREEN_HEIGHT__ = height;
global.SCREEN_WIDTH = width;
global.SCREEN_HEIGHT = height;


// Platfrom variables
global.__isIOS__ = Platform.OS === 'ios';
global.__isAndroid__ = Platform.OS === 'android';


// iPhone variables (iPhone X && iPhone XS)、(iPhone XR && iPhone XS Max)
global.__isIphoneX__ = (__isIOS__ && width === 375.0 && height === 812.0) || (__isIOS__ && width === 414.0 && height === 896.0);
global.__iosStatusBarHeight__ = __isIphoneX__ ? 44.0 : 20.0;
global.__iosNavigationBarHeight__ = 44.0;
global.__iosSafeAreaTopHeight__ = __isIphoneX__ ? 88.0 : 64.0;
global.__iosSafeAreaBottomHeight__ = __isIphoneX__ ? 34.0 : 0.0;
global.__iosTabBarHeight__ = __isIphoneX__ ? 83.0 : 49.0;
global.__isIphone5s__ = width === 320.0 && height === 568.0;


global.isIOS = Platform.OS === 'ios';
global.isAndroid = Platform.OS === 'android';
global.isIphoneX = (isIOS && width === 375.0 && height === 812.0) || (isIOS && width === 414.0 && height === 896.0);

// Navigation bar
global.iosStatusBarHeight = isIphoneX ? 44.0 : 20.0;
global.iosSafeAreaTopHeight = iosStatusBarHeight;
global.iosNavigationBarNormalHeight = 44.0;
global.iosNavigationBarSafeHeight = iosStatusBarHeight + iosNavigationBarNormalHeight;

// Tab bar
global.iosSafeAreaBottomHeight = isIphoneX ? 34.0 : 0.0;
global.iosTabBarNormalHeight__ = 49.0;
global.iosTabBarSafeHeight__ = iosSafeAreaBottomHeight + iosTabBarNormalHeight__;


// adapt screen height（take iPhone 6s as an standard）
global.adaptHeight = function(h) {
    return h * (height / 667.0);
};

// adapt screen width（take iPhone 6s as a standard）
global.adaptWidth = function(w) {
    return w * (width / 375.0);
};

// Global color configurations
global.Colors = Colors;

// Global route keys
global.RouteKeys = RouteKeys;

global.CacheKeys = CacheKeys;

global.METHOD = Methods;

global.EmitterEvents = EmitterEvents;


/** About global storage **/
global.WKStorage = WKStorage;

// Global toast
global.WKToast = WKToast;
global.WKLoading = WKLoading;
global.WKAlert = WKAlert;