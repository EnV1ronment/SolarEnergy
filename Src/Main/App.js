import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {BackHandler, ToastAndroid, DeviceEventEmitter} from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation';

// Pages
import LoginPage from "../Page/Login/LoginPage";
import RegisterPage from "../Page/Login/Register/RegisterPage";
import ForgetPasswordPage from "../Page/Login/Forget/ForgetPasswordPage";
import ConfirmPasswordPage from "../Page/Login/Forget/ConfirmPasswordPage";
import PrivacyPage from "../Page/Login/Register/Privacy/PrivacyPage";
import SettingsPage from "../Page/Mine/Settings/SettingsPage";
import MessagePage from "../Page/Mine/Message/MessagePage";
import StationPage from "../Page/Mine/Station/StationPage";
import AccountPage from "../Page/Mine/Settings/Account/AccountPage";
import DealerPage from "../Page/Mine/Settings/Dealer/DealerPage";
import HelpPage from "../Page/Mine/Settings/Help/HelpPage";
import SharePage from "../Page/Mine/Settings/Share/SharePage";
import FAQPage from "../Page/Mine/Settings/Help/FAQ/FAQPage";
import CommonOperationPage from "../Page/Mine/Settings/Help/Operation/CommonOperationPage";
import DevicePage from "../Page/Mine/Station/Device/DevicePage";
import AddStationPage from "../Page/Mine/Station/Add/AddStationPage";
import MessageDetailPage from "../Page/Mine/Message/Detail/MessageDetailPage";
import WKNavigationBarLeftItem from "../Common/Components/WKNavigationBarLeftItem";
import AddDevicePage from "../Page/Mine/Station/Device/Add/AddDevicePage";
import SNCodePage from "../Page/Mine/Station/Device/Add/SN/SNCodePage";
import AboutPage from "../Page/Mine/Settings/About/AboutPage";
import LanguagePage from "../Page/Mine/Settings/Language/LanguagePage";
import SiteInfoPage from "../Page/Home/Site/SiteInfoPage";
import AddSitePage from "../Page/Home/Site/Add/AddSitePage";
// import MapPage from "../Page/Home/Site/Add/Map/MapPage";
import BaiduMapPage from "../Page/Home/Site/Add/Map/BaiduMapPage";
import PhotoPage from "../Page/Home/Site/Add/Photo/PhotoPage";
import TimeZonePage from "../Page/Home/Site/Add/TimeZone/TimeZonePage";
import ConfigurationPage from "../Page/Home/Site/Add/Configuration/ConfigurationPage";
import EnergyRatesPage from "../Page/Home/Site/Add/EnergyRates/EnergyRatesPage";
import MapSearchPage from "../Page/Home/Site/Add/Map/MapSearchPage";
import CustomizePage from "../Page/Home/Site/Customize/CustomizePage";
import donghua from "../Page/Home/Site/Add/donghua/donghua";

// Components & model
import BottomTabBar from "./BottomTabBar";
import UserInfoModel from "../Model/UserInfoModel";
/**
 * Provider must be required as a wrapper in order to make
 * Toast component available. So don't remove it here please.
 */
import {Provider} from "@ant-design/react-native";

import { BaiduMapManager } from 'react-native-baidu-map'

class App extends Component {

    static propTypes = {
        initialRouteName: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            initialRouteName: props.initialRouteName
        };
    }

    componentDidMount() {
        this._addObserver();
        BaiduMapManager.initSDK('vmDyB26vvTk5apZNjiHHNGl3F1dccNyK');
    }

    componentWillUnmount() {
        this._removeObserver();
    }

    _addObserver = () => {
        BackHandler.addEventListener(EmitterEvents.ANDROID_BACK_HARDWARE, this._onBackAndroid);
        DeviceEventEmitter.addListener(EmitterEvents.INVALID_TOKEN_TO_LOGIN, this._loginPage);
    };

    _removeObserver = () => {
        BackHandler.removeEventListener(EmitterEvents.ANDROID_BACK_HARDWARE, this._onBackAndroid);
        DeviceEventEmitter.removeListener(EmitterEvents.INVALID_TOKEN_TO_LOGIN, this._loginPage);
    };

    _onBackAndroid = () => {
        const {_navigation} = this.navigator;
        WKLoading.hide(); // When page popped, hide all loading on Android.
        if (_navigation && _navigation.state.routes.length > 1) {
            _navigation.pop();
            return true;
        } else {
            if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
                BackHandler.exitApp();
                return false;
            }
            ToastAndroid.show(WK_T(wkLanguageKeys.exit_app), ToastAndroid.SHORT);
            this.lastBackPressed = Date.now();
            return true;
        }
    };

    _loginPage = () => {
        WKStorage.getItem(CacheKeys.userInfo).then(ret => {
            WKStorage.setItem(CacheKeys.userInfo, new UserInfoModel(ret.account, ''));
        });
        this.setState({
            initialRouteName: RouteKeys.LoginPage
        });
    };

    _back = () => {
        const {_navigation} = this.navigator;
        _navigation && _navigation.pop();
    };

    render() {
        const AppNavigator = createStackNavigator(
            {
                BottomTabBar: BottomTabBar(),
                LoginPage: {
                    screen: LoginPage,
                    navigationOptions: {
                        header: null
                    }
                },
                AddDevicePage: {
                    screen: AddDevicePage,
                    navigationOptions: {
                        header: null
                    }
                },
                RegisterPage,
                ForgetPasswordPage,
                ConfirmPasswordPage,
                SettingsPage,
                MessagePage,
                StationPage,
                AccountPage,
                DealerPage,
                HelpPage,
                SharePage,
                FAQPage,
                CommonOperationPage,
                DevicePage,
                AddStationPage,
                MessageDetailPage,
                SNCodePage,
                PrivacyPage,
                AboutPage,
                LanguagePage,
                SiteInfoPage,
                AddSitePage,
                // MapPage,
                BaiduMapPage,
                PhotoPage,
                TimeZonePage,
                ConfigurationPage,
                EnergyRatesPage,
                MapSearchPage,
                CustomizePage,
                donghua,
            },
            {
                initialRouteName: this.state.initialRouteName,
                // initialRouteParams: {},
                transparentCard: true, // Make sure that android transmission is not blinking white
                defaultNavigationOptions: {
                    headerStyle: {
                        backgroundColor: Colors.theme, // set backgroundColor for navigation bar
                        borderBottomWidth: 0 // hide bottom line
                    },
                    headerTintColor: Colors.white, // set color for navigation bar title, back button image and back button text
                    headerTitleStyle: { // set color for navigation bar title
                        fontWeight: 'normal'
                    },
                    // headerBackTitle: '   ', // back button title
                    headerLeft: <WKNavigationBarLeftItem click={this._back}/>,
                },
                headerLayoutPreset: 'center' // whether to center header title on Android
            }
        );

        const AppContainer = createAppContainer(AppNavigator);

        return <Provider>
            <AppContainer ref={nav => this.navigator = nav}/>
        </Provider>;
    }
}

export default App;
