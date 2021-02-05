import React, {Component} from 'react';
import {TouchableOpacity, Keyboard} from 'react-native';
import WKGeneralBackground from "../../../Common/Components/WKGeneralBackground";
import ForgetPasswordView from "./Components/ForgetPasswordView";
import SelectCountryModal from "../Register/Components/SelectCountryModal";
import WKFetch from "../../../Network/WKFetch";
import UserInfoModel from "../../../Model/UserInfoModel";
import SystemModel from "../../../Model/SystemModel";
import {connect} from 'react-redux';
import {userAction} from "../../../Redux/Action/userAction";

const fiveMinutes = 1000 * 60 * 5;
let _account = '';
let verification_code = '-';

class ForgetPasswordPage extends Component {

    state = {
        leftValue: '+234',
        count: 0
    };

    static navigationOptions = ({navigation}) => {
        return {
            title: navigation.state.params.route === RouteKeys.AccountPage ? WK_T(wkLanguageKeys.change_phone) : WK_T(wkLanguageKeys.forgot_pwd)
        };
    };

    componentWillUnmount() {
        this._clearTimer();
        this._clearTimeOut();
    }

    _nextStep = ({phone, verificationCode}) => {
        this._hideKeyboard();
        const {navigation} = this.props;
        if (verificationCode !== verification_code) {
            WKToast.show(WK_T(wkLanguageKeys.invalid_verify_code));
            return;
        }
        if (!verificationCode) {
            WKToast.show(WK_T(wkLanguageKeys.invalid_verify_code));
            return;
        }
        if (navigation.state.params.route === RouteKeys.AccountPage) {
            const data = {
                phone: phone,
                verifyCode: verificationCode,
                userId: this.props.userId,
            };
            WKLoading.show();
            WKFetch('/setting/user/phone', data, METHOD.PATCH).then(ret => {
                WKLoading.hide();
                if (ret.ok) {
                    this.props.updateUserInfo({userName: phone});
                    WKStorage.setItem(CacheKeys.userInfo, new UserInfoModel(phone, this.props.password));
                    navigation.goBack();
                } else {
                    WKToast.show(ret.errorMsg);
                }
            });
        } else {
            const params = {
                account: _account,
                verificationCode,
                route: RouteKeys.ForgetPasswordPage
            };
            navigation.push(RouteKeys.ConfirmPasswordPage, params);
        }
    };

    _selectAreaCode = () => {
        this._hideKeyboard();
        this._showCountryModal();
    };

    _showCountryModal = () => {
        this.countryModal.show();
    };

    _hideKeyboard = () => {
        Keyboard.dismiss();
    };

    _getPhone = (phone) => {
        const {leftValue} = this.state;
        return leftValue.substr(1) + '-' + phone;
    };

    _clickItem = ({Name, ISO, Code}) => {
        this.setState({leftValue: `+${Code}`})
    };

    // Begin countdown
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

    // Clear timer
    _clearTimer = () => {
        this.timer && clearInterval(this.timer);
    };

    _clearTimeOut = () => {
        this.timeoutTimer && clearTimeout(this.timeoutTimer);
    };

    _isChangePhone = () => this.props.navigation.state.params.route === RouteKeys.AccountPage;

    // Send verification code
    _verifyCodeClick = (phone) => {
        this._hideKeyboard();
        !this._isChangePhone() && WKStorage.setItem(CacheKeys.systemInfo, new SystemModel('', '', '', ''));
        // If current user.
        if (this._isChangePhone() && phone === this.props.userName) {
            WKToast.show(WK_T(wkLanguageKeys.phone_already_registered));
            return;
        }
        this._clearTimer();
        this._clearTimeOut();
        WKLoading.show();
        WKFetch('/login/verify-code', {
            phone: this._getPhone(phone),
            action: this._isChangePhone() ? 'changePhone' : 'forgetPassword',
        }).then(ret => {
            WKLoading.hide();
            if (ret.ok && ret.data && ret.data.results) {
                WKToast.show(WK_T(wkLanguageKeys.sent));
                _account = phone;
                verification_code = ret.data.results;
                this.setState({count: 60}, this._beginCountdown);
                this.timeoutTimer = setTimeout(() => {
                    verification_code = '-';
                }, fiveMinutes);
            } else {
                WKToast.show(ret.errorMsg, true);
            }
        });
    };

    render() {

        const buttonTitle = this._isChangePhone() ? WK_T(wkLanguageKeys.confirm) : WK_T(wkLanguageKeys.continue);
        return (
            <WKGeneralBackground>
                <TouchableOpacity
                    style={{flex: 1}}
                    activeOpacity={1}
                    onPress={this._hideKeyboard}
                >
                    <SelectCountryModal
                        ref={countryModal => this.countryModal = countryModal}
                        clickItem={this._clickItem}
                    />
                    <ForgetPasswordView
                        isChangePhone={this._isChangePhone()}
                        nextStep={this._nextStep}
                        leftValue={this.state.leftValue}
                        nextStepTitle={buttonTitle}
                        selectAreaCode={this._selectAreaCode}
                        verifyCodeClick={this._verifyCodeClick}
                        count={this.state.count}
                    />
                </TouchableOpacity>
            </WKGeneralBackground>
        );
    }

}

const mapStateToProps = state => ({
    userId: state.userReducer.userId,
    userName: state.userReducer.userName,
    password: state.userReducer.password,
});

const mapDispatchToProps = dispatch => {
    return {
        updateUserInfo: userInfo => {
            dispatch(userAction(userInfo));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ForgetPasswordPage);
