import React, {Component} from 'react';
import {
    TouchableOpacity,
    Keyboard,
} from 'react-native';
import {StackActions, NavigationActions} from 'react-navigation';
import RegisterView from "./Components/RegisterView";
import WKGeneralBackground from "../../../Common/Components/WKGeneralBackground";
import WKPresenter from "../../../Common/Components/WKPresenter";
import flower from '../../../Source/Register/register_flower.png';
import SelectCountryModal from "./Components/SelectCountryModal";
import WKFetch from "../../../Network/WKFetch";
import WKRegExp from "../../../Utils/WKRegExp";
import WKEncrypt from "../../../Utils/WKEncrypt";
import SystemModel from "../../../Model/SystemModel";
import UserInfoModel from "../../../Model/UserInfoModel";
import {connect} from 'react-redux';
import {userAction} from "../../../Redux/Action/userAction";

let verification_code = '-';

class RegisterPage extends Component {

    state = {
        visible: false,
        index: 0,
        leftValue: '+234',
        count: 0,
    };

    static navigationOptions = () => ({title: WK_T(wkLanguageKeys.sign_up)});

    componentWillUnmount() {
        this._clearTimer();
    }

    _beginCountdown = () => {
        const now = new Date();
        this.timer = setInterval(() => {
            const time = new Date() - now;
            const timeInt = parseInt(time / 1000);
            if (this.state.count < 2) {
                this._clearTimer();
                this.setState({count: 0});
            } else {
                this.setState({count: 60 - timeInt})
            }
        }, 1000);
    };

    _clearTimer = () => {
        this.timer && clearInterval(this.timer);
    };

    _seePrivacy = () => {
        this.props.navigation.navigate(RouteKeys.PrivacyPage);
    };

    // Send verification code
    _verifyCodeClick = ({phone, password, confirmPassword}) => {
        this._hideKeyboard();
        if (!WKRegExp.verifyPassword(password) || password.length < 8 || confirmPassword.length < 8) {
            WKToast.show(WK_T(wkLanguageKeys.eight_to_sixteen_password));
            return;
        }
        if (password !== confirmPassword) {
            WKToast.show(WK_T(wkLanguageKeys.different_two_times_password));
            return;
        }
        WKStorage.setItem(CacheKeys.systemInfo, new SystemModel('', '', '', ''));
        this._clearTimer();
        WKLoading.show();
        WKFetch('/login/verify-code', {
            phone: this._getPhone(phone),
            action: 'register',
        }).then(ret => {
            WKLoading.hide();
            if (ret.ok) {
                WKToast.show(WK_T(wkLanguageKeys.sent));
                verification_code = ret.data.results;
                this.setState({count: 60}, this._beginCountdown);
            } else {
                WKToast.show(ret.errorMsg);
            }
        });
    };

    // Sign up
    _register = ({phone, password, confirmPassword, verificationCode, hasTicked}) => {
        WKStorage.setItem(CacheKeys.systemInfo, new SystemModel('', '', '', ''));
        this._hideKeyboard();
        if (!WKRegExp.verifyPassword(password) || password.length < 8 || confirmPassword.length < 8) {
            WKToast.show(WK_T(wkLanguageKeys.eight_to_sixteen_password));
            return;
        }
        if (password !== confirmPassword) {
            WKToast.show(WK_T(wkLanguageKeys.different_two_times_password));
            return;
        }
        if (verificationCode !== verification_code) {
            WKToast.show(WK_T(wkLanguageKeys.error_verify_code));
            return;
        }
        if (!verificationCode) {
            WKToast.show(WK_T(wkLanguageKeys.error_verify_code));
            return;
        }
        if (!hasTicked) {
            WKToast.show(WK_T(wkLanguageKeys.agree_privacy_continue));
            return;
        }
        password = WKEncrypt.password(password);
        WKLoading.show();
        WKFetch('/login/register', {
            account: phone,
            password: password,
            confirmPassword: password,
            verifyCode: verificationCode,
        }, METHOD.POST).then(ret => {
            WKLoading.hide();
            if (ret.ok) {
                this.setState({
                    visible: true,
                }, () => {
                    const {navigation} = this.props;
                    const callback = navigation.getParam('callback');
                    callback && callback(phone, confirmPassword);
                });
            } else {
                WKToast.show(ret.errorMsg);
            }
        });
    };

    _getPhone = (phone) => {
        const {leftValue} = this.state;
        return leftValue.substr(1) + '-' + phone;
    };

    _hideKeyboard = () => Keyboard.dismiss();

    _selectCountry = () => {
        this._hideKeyboard();
        this.countryModal.show();
    };

    _selectCountryCallback = ({Name, ISO, Code}) => {
        this.countryModal.hide();
        this.setState({leftValue: `+${Code}`});
    };

    render() {
        return (
            <WKGeneralBackground>
                <WKPresenter
                    image={flower}
                    message={WK_T(wkLanguageKeys.register_success)}
                    leftButtonClick={() => this.setState({visible: false})}
                    visible={this.state.visible}
                />
                <SelectCountryModal
                    ref={countryModal => this.countryModal = countryModal}
                    clickItem={this._selectCountryCallback}
                />
                <TouchableOpacity
                    style={{flex: 1}}
                    activeOpacity={1}
                    onPress={this._hideKeyboard}
                >
                    <RegisterView
                        leftClick={this._selectCountry}
                        register={this._register}
                        leftValue={this.state.leftValue}
                        verifyCodeClick={this._verifyCodeClick}
                        count={this.state.count}
                        seePrivacy={this._seePrivacy}
                    />
                </TouchableOpacity>
            </WKGeneralBackground>
        );
    }
}

const mapStateToProps = () => ({});
const mapDispatchToProps = dispatch => {
    return {
        updateUserInfo: userInfo => dispatch(userAction(userInfo)),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(RegisterPage);
