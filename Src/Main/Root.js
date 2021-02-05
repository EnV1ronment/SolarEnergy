import React, {Component} from 'react';
import {
    View,
    StatusBar,
    DeviceEventEmitter,
    AppState,
} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import App from './App';
import SplashScreen from 'react-native-splash-screen';
import 'react-native-gesture-handler'; // Required! Make sure gestures is available on iOS, or will crash.
import {Provider} from 'react-redux';
import WKFetch from "../Network/WKFetch";
// import JPushModule from "jpush-react-native";
import store from '../Redux/Store';
import styles from '../Common/Styles';
import {userAction} from "../Redux/Action/userAction";
import {netAction} from "../Redux/Action/netAction";
import WKUpdate from "../Common/Components/WKUpdate";
// import codePush from "react-native-code-push";
import {needPush} from '../../app';

// Monitor app state changes
const APP_STATE_CHANGE = 'appStateDidChange';

class Root extends Component {

    state = {
        visible: false,
        initialRouteName: RouteKeys.LoginPage,
    };

    componentDidMount() {
        // this._codePush();
        this._getUserInfo();
        this._addObserver();
        WKUpdate.check();
    }

    componentWillUnmount() {
        this._removeObserver();
        this._clearTimer();
    }

    // Hot update
    _codePush = () => {
        codePush.sync({
            updateDialog: false,
            installMode: codePush.InstallMode.ON_NEXT_RESTART,
            // deploymentKey: deploymentKey,
        }, status => {
            __DEV__ && console.warn(`status: ${status}`)
        }, progress => {
            const {totalBytes, receivedBytes} = progress;
            __DEV__ && console.warn(`totalBytes: ${totalBytes}, receivedBytes: ${receivedBytes}`);
        });
    };

    _addObserver = () => {
        this.appStateListener = AppState.addListener(APP_STATE_CHANGE, this._appState);
        this.netListener = NetInfo.addEventListener(EmitterEvents.CONNECTION_CHANGE, this._networkChanged);
    };

    _removeObserver = () => {
        this.appStateListener && this.appStateListener.remove();
        this.netListener && this.netListener.remove();
    };

    _clearTimer = () => this.timer && clearTimeout(this.timer);

    _networkChanged = (connectionType) => {
        const {type} = connectionType;
        if (type === 'none' || type === 'unknown') {
            WKToast.show(WK_T(wkLanguageKeys.no_net));
            store.dispatch(netAction({hasNetwork: false}));
        } else {
            store.dispatch(netAction({hasNetwork: true}));
            if (AppState.currentState === 'active') {
                DeviceEventEmitter.emit(EmitterEvents.NETWORK_CONNECTION);
            }
        }
    };

    _appState = state => {
        const {app_state} = state || {};
        if (app_state === 'active') {
            WKUpdate.check();
        }
        if (!needPush) return;
        // if (__isAndroid__) {
        //     // Android only. Clear all notifications in notification bar.
        //     JPushModule.clearAllNotifications();
        // } else {
        //     // iOS Only. Clear badges and all notifications in notification bar.
        //     JPushModule.setBadge(0, success => {
        //     });
        // }
    };

    _getUserInfo = () => {
        WKStorage.getItem(CacheKeys.userInfo).then(ret => {
            if (!ret) {
                this._loadPage();
                return;
            }
            const {
                account,
                password,
                userId,
            } = ret;
            store.dispatch(userAction({userName: account, password, userId}));
            if (account && password && userId) {
                this.setState({
                    visible: true,
                    initialRouteName: RouteKeys.BottomTabBar
                }, () => {
                    this._splash();
                });
                // this._checkLoginStatus();
                return;
            }
            this._loadPage();
        }).catch(() => {
            store.dispatch(userAction({userName: '', password: '', userId: ''}));
            this._loadPage();
        });
    };

    // Removed.
    _checkLoginStatus = () => {
        WKFetch('/login/status').then(ret => {
            // Invalid token
        });
    };

    _loadPage = () => {
        this.setState({
            visible: true
        }, () => {
            this._splash();
        });
    };

    // Resolve blank screen
    _splash = () => {
        this.timer = setTimeout(() => {
            this._clearTimer();
            SplashScreen.hide();
        }, 500);
    };

    render() {
        const {visible} = this.state;
        return (<Provider store={store}>
            <View style={styles.themeContainer}>
                <StatusBar
                    barStyle={'light-content'}
                    backgroundColor={Colors.theme}
                />
                {visible && <App
                    initialRouteName={this.state.initialRouteName}
                />}
            </View>
        </Provider>);
    };

}

// export default codePush(Root);

export default Root;