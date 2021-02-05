import React, {Component} from 'react';
import {
    TouchableOpacity,
    Keyboard
} from 'react-native';
import ConfirmPasswordView from "./Components/ConfirmPasswordView";
import WKGeneralBackground from "../../../Common/Components/WKGeneralBackground";
import WKFetch from "../../../Network/WKFetch";
import WKRegExp from "../../../Utils/WKRegExp";
import WKEncrypt from "../../../Utils/WKEncrypt";
import UserInfoModel from "../../../Model/UserInfoModel";
import WKPresenter from "../../../Common/Components/WKPresenter";
import {connect} from 'react-redux';

// Icons
import alert_check_icon from '../../../Source/Common/alert_check_icon.png';
import {userAction} from "../../../Redux/Action/userAction";

class ConfirmPasswordPage extends Component {

    state = {
        visible: false
    };

    static navigationOptions = ({navigation}) => {
        return {
            title: navigation.state.params.route === RouteKeys.ForgetPasswordPage ? WK_T(wkLanguageKeys.forgot_pwd) : WK_T(wkLanguageKeys.change_password)
        };
    };

    _confirm = ({oldPassword, newPassword, confirmNewPassword}) => {
        this._hideKeyboard();
        if (newPassword !== confirmNewPassword) {
            WKToast.show(WK_T(wkLanguageKeys.new_password));
            return;
        }
        if (!WKRegExp.verifyPassword(newPassword)) {
            WKToast.show(WK_T(wkLanguageKeys.new_password_with_numeric_alphabet));
            return;
        }
        const {navigation} = this.props;
        const {params} = navigation.state;
        const {route, account, verificationCode} = params;
        if (route === RouteKeys.ForgetPasswordPage) {
            newPassword = WKEncrypt.password(newPassword);
            const params = {
                account: account,
                password: newPassword,
                verifyCode: verificationCode,
            };
            WKLoading.show();
            WKFetch('/login/forget-password', params, METHOD.POST).then(ret => {
                WKLoading.hide();
                if (ret.ok) {
                    WKToast.show(WK_T(wkLanguageKeys.find_password_success));
                    navigation.popToTop();
                } else {
                    WKToast.show(ret.errorMsg);
                }
            });
        } else {
            if (WKEncrypt.password(oldPassword) !== this.props.password) {
                WKToast.show(WK_T(wkLanguageKeys.error_old_pwd));
                return;
            }
            if (!WKRegExp.verifyPassword(oldPassword)) {
                WKToast.show(WK_T(wkLanguageKeys.old_pwd_with_numeric_alphabet));
                return;
            }
            if (oldPassword === newPassword) {
                WKToast.show(WK_T(wkLanguageKeys.old_pwd_should_defer_new_pwd));
                return;
            }
            WKLoading.show();
            WKFetch('/setting/user/password', {
                userId: this.props.userId,
                password: WKEncrypt.password(newPassword)
            }, METHOD.PATCH).then(ret => {
                WKLoading.hide();
                if (ret.ok) {
                    WKStorage.setItem(CacheKeys.userInfo, new UserInfoModel(this.props.userName, WKEncrypt.password(newPassword)));
                    this.props.updateUserInfo({password: WKEncrypt.password(newPassword)});
                    this.setState({visible: true});
                } else {
                    WKToast.show(ret.errorMsg);
                }
            });
        }
    };

    _hideKeyboard = () => Keyboard.dismiss();

    _okAlertClick = () => {
        this._hideModal();
        const {navigation} = this.props;
        navigation && navigation.goBack();
    };

    _hideModal = () => this.setState({visible: false});

    render() {
        return (
            <WKGeneralBackground>
                <TouchableOpacity
                    style={{flex: 1}}
                    activeOpacity={1}
                    onPress={this._hideKeyboard}
                >
                    <ConfirmPasswordView
                        confirm={this._confirm}
                        route={this.props.navigation.state.params.route}
                    />
                    <WKPresenter
                        image={alert_check_icon}
                        message={WK_T(wkLanguageKeys.modify_success)}
                        leftButtonClick={this._hideKeyboard}
                        defaultButtonText={WK_T(wkLanguageKeys.ok)}
                        defaultButtonClick={this._okAlertClick}
                        visible={this.state.visible}
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
        updateUserInfo: userInfo => dispatch(userAction(userInfo)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ConfirmPasswordPage);
