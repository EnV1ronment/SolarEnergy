import React, {Component} from 'react';
import {
    TouchableOpacity,
    ImageBackground,
    Keyboard,
    StatusBar,
} from 'react-native';
import bgImage from '../../Source/Login/login_page_bgImage.png';
import LoginView from "./Components/LoginView";
import BottomView from "./Components/BottomView";
import WKFetch from "../../Network/WKFetch";
import SystemModel from "../../Model/SystemModel";
import UserInfoModel from "../../Model/UserInfoModel";
import WKEncrypt from "../../Utils/WKEncrypt";
import styles from '../../Common/Styles';
import {connect} from 'react-redux';
import {userAction} from "../../Redux/Action/userAction";
import {NavigationActions, StackActions} from "react-navigation";

class LoginPage extends Component {

    componentDidMount() {
        __isAndroid__ && StatusBar.setBackgroundColor(Colors.theme);
    }

    _register = () => {
        this._hideKeyboard();
        const {navigation} = this.props;
        navigation.navigate(RouteKeys.RegisterPage, {
            callback: (phone, password) => {
                this._login(phone, password, false);
            },
        });
    };

    _forgetPassword = () => {
        this._hideKeyboard();
        this.props.navigation.navigate(RouteKeys.ForgetPasswordPage, {route: RouteKeys.LoginPage});
    };

    _hideKeyboard = () => Keyboard.dismiss();

    _login = (userName, password, loading = true) => {
        this._hideKeyboard();
        password = WKEncrypt.password(password);
        WKStorage.setItem(CacheKeys.systemInfo, new SystemModel('', '', '', ''));
        loading && WKLoading.show();
        WKFetch('/login', {
            account: userName,
            password: password
        }, METHOD.POST).then(ret => {
            WKLoading.hide();
            const {ok, data, errorMsg, errorCode, result} = ret;
            const {updateUserInfo, navigation} = this.props;
            if (ok) {
                const {results} = data;
                const {
                    id, // user id
                    name, // user name
                    token,
                    firm,
                } = results;
                updateUserInfo({userName, password, userId: id});
                WKStorage.setItem(CacheKeys.systemInfo, new SystemModel(token, firm.id, '', id));
                WKStorage.setItem(CacheKeys.userInfo, new UserInfoModel(userName, password, id));
                this._resetRouteToBottomTabBar();
            } else {
                let msg = errorMsg;
                if (errorCode === 52 && result && typeof result === 'object' && result.failedFrequency) {
                    const {failedFrequency} = result;
                    if (failedFrequency >= 5) {
                        WKAlert.show('Your account is locked, please try again in 30 minutes.');
                        return;
                    }
                    msg = `${errorMsg}, you have ${5 - failedFrequency} more times to try.`;
                }
                WKToast.show(msg, true, 2.5);
                navigation.goBack();
            }
        });
    };

    _resetRouteToBottomTabBar = () => {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({
                    routeName: RouteKeys.BottomTabBar,
                    params: {isFromLogin: true},
                }),
            ],
        });
        const {navigation} = this.props;
        navigation.dispatch(resetAction);
    };

    render() {
        return (
            <TouchableOpacity
                style={styles.themeContainer}
                activeOpacity={1}
                onPress={this._hideKeyboard}
            >
                <ImageBackground
                    style={styles.themeContainer}
                    //source={bgImage}
                >
                    <LoginView
                        login={({userName, password}) => this._login(userName, password)}
                        userName={this.props.userName}
                    />
                    <BottomView
                        register={this._register}
                        forget={this._forgetPassword}
                    />
                </ImageBackground>
            </TouchableOpacity>
        );
    }

}

const mapStateToProps = state => ({
    userName: state.userReducer.userName,
});

const mapDispatchToProps = dispatch => {
    return {
        updateUserInfo: userInfo => {
            dispatch(userAction(userInfo));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
