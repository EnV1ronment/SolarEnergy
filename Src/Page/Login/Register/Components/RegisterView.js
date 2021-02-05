import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import PropTypes from 'prop-types';

// Icons
import register_password_icon from '../../../../Source/Register/register_password_icon.png';
import register_verification_code_icon from '../../../../Source/Register/register_verification_code_icon.png';

// Components
import RegisterItem from "./RegisterItem";
import WKGeneralButton from "../../../../Common/Components/WKGeneralButton";
import WKRegExp from "../../../../Utils/WKRegExp";

export default class RegisterView extends Component {

    static propTypes = {
        register: PropTypes.func.isRequired,
        leftClick: PropTypes.func.isRequired,
        leftValue: PropTypes.string.isRequired,
        verifyCodeClick: PropTypes.func,
        count: PropTypes.number,
        seePrivacy: PropTypes.func.isRequired,
    };

    state = {
        phone: '',
        password: '',
        verificationCode: '',
        confirmPassword: '',
        hasTicked: false
    };

    _onChangeTextWithPhone = (phone) => {
        this.setState({phone: WKRegExp.onlyNumber(phone)});
    };

    _onChangeTextWithPassword = (password) => {
        this.setState({password: password.trim()});
    };

    _onChangeTextWithConfirmPassword = (confirmPassword) => {
        this.setState({confirmPassword: confirmPassword.trim()});
    };

    _onChangeTextWithVerifyCode = (verificationCode) => {
        this.setState({verificationCode: verificationCode.trim()});
    };

    _leftClick = () => {
        const {leftClick} = this.props;
        leftClick && leftClick();
    };

    _register = () => {
        if (!this.state.verificationCode) return;
        const {register} = this.props;
        register && register(this.state);
    };

    _verifyCodeClick = () => {
        const {verifyCodeClick} = this.props;
        verifyCodeClick && verifyCodeClick(this.state);
    };

    render() {
        const {
            phone,
            password,
            confirmPassword,
            verificationCode
        } = this.state;
        const {leftValue, count} = this.props;
        const isVerificationCodeDisabled = !!!phone;
        const isRegisterButtonDisabled = isVerificationCodeDisabled || !!!verificationCode || !!!password || !!!confirmPassword;
        // const isRegisterButtonDisabled = isVerificationCodeDisabled || !!!password || !!!confirmPassword;
        return (
            <View>
                <RegisterItem
                    keyboardType={'number-pad'}
                    maxInputLength={11}
                    autoFocus={true}
                    marginTop={25}
                    leftValue={leftValue}
                    leftClick={this._leftClick}
                    value={phone}
                    placeholderText={WK_T(wkLanguageKeys.enter_phone)}
                    onChangeText={this._onChangeTextWithPhone}
                />
                <RegisterItem
                    marginTop={10}
                    leftValue={register_password_icon}
                    value={password}
                    placeholderText={WK_T(wkLanguageKeys.enter_password)}
                    maxInputLength={16}
                    onChangeText={this._onChangeTextWithPassword}
                    showEye={true}
                />
                <RegisterItem
                    marginTop={10}
                    leftValue={register_password_icon}
                    value={confirmPassword}
                    placeholderText={WK_T(wkLanguageKeys.confirm_pwd)}
                    maxInputLength={16}
                    onChangeText={this._onChangeTextWithConfirmPassword}
                    showEye={true}
                />
                <RegisterItem
                    phone={phone}
                    isVerificationCodeDisabled={isVerificationCodeDisabled}
                    needVerifyCode={true}
                    count={count}
                    verifyCodeClick={this._verifyCodeClick}
                    keyboardType={'number-pad'}
                    maxInputLength={6}
                    marginTop={10}
                    leftValue={register_verification_code_icon}
                    value={verificationCode}
                    placeholderText={WK_T(wkLanguageKeys.verify_code)}
                    onChangeText={this._onChangeTextWithVerifyCode}
                    onSubmitEditing={this._register}
                />
                <View style={styles.container}>
                    <TouchableOpacity
                        style={styles.tickButton}
                        activeOpacity={0.7}
                        onPress={() => {
                            this.setState(({hasTicked}) => {
                                return {hasTicked: !hasTicked};
                            });
                        }}
                    >
                        <View style={[
                            styles.tickDot,
                            {
                                backgroundColor: this.state.hasTicked ? Colors.buttonBgColor : Colors.theme,
                                borderColor: this.state.hasTicked ? Colors.buttonBgColor : Colors.separatorColor,
                                shadowColor: this.state.hasTicked ? Colors.buttonBgColor : Colors.theme,
                            }
                        ]}/>
                    </TouchableOpacity>
                    <TouchableWithoutFeedback onPress={this.props.seePrivacy}>
                        <Text numberOfLines={0} style={styles.privacy}>
                            {WK_T(wkLanguageKeys.agree_privacy)}
                            <Text numberOfLines={0} style={{color: Colors.buttonBgColor}}>
                                {WK_T(wkLanguageKeys.wanke_policy)}
                            </Text>
                        </Text>
                    </TouchableWithoutFeedback>
                </View>
                <WKGeneralButton
                    title={WK_T(wkLanguageKeys.sign_up)}
                    disabled={isRegisterButtonDisabled}
                    click={this._register}
                />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        // padding: 10,
        paddingLeft: 0,
        marginTop: 10,
        flexDirection: 'row',
        // backgroundColor: 'red'
    },
    tickButton: {
        paddingTop: 15,
        // backgroundColor: 'green',
        alignItems: 'center',
        marginLeft: 10,
        width: 30,
        height: 30,
    },
    tickDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 0.5,
        shadowOpacity: 0.9,
        shadowRadius: 5,
        shadowOffset: {height: 1}
    },
    privacy: {
        marginLeft: 2,
        paddingTop: 10.5,
        width: __SCREEN_WIDTH__ - 60,
        color: Colors.placeholder,
    },
});

