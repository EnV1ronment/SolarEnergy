import React, {Component} from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import register_verification_code_icon from "../../../../Source/Register/register_verification_code_icon.png";
import RegisterItem from "../../Register/Components/RegisterItem";
import WKGeneralButton from "../../../../Common/Components/WKGeneralButton";
import WKRegExp from "../../../../Utils/WKRegExp";

export default class ForgetPasswordView extends Component {

    static propTypes = {
        nextStep: PropTypes.func.isRequired,
        leftValue: PropTypes.string.isRequired,
        nextStepTitle: PropTypes.string.isRequired,
        selectAreaCode: PropTypes.func.isRequired,
        verifyCodeClick: PropTypes.func,
        count: PropTypes.number,
        isChangePhone: PropTypes.bool.isRequired,
    };

    state = {
        phone: '',
        verificationCode: ''
    };

    _onChangeTextWithPhone = (phone) => {
        this.setState({phone: WKRegExp.onlyNumber(phone)});
    };

    _onChangeTextWithVerifyCode = (verificationCode) => {
        this.setState({verificationCode: WKRegExp.onlyNumber(verificationCode)});
    };

    _leftClick = () => {
        const {selectAreaCode} = this.props;
        selectAreaCode && selectAreaCode();
    };

    _nextStep = () => {
        if (!this.state.verificationCode) return;
        const {nextStep} = this.props;
        nextStep && nextStep(this.state);
    };

    _verifyCodeClick = () => {
        const {verifyCodeClick} = this.props;
        verifyCodeClick && verifyCodeClick(this.state.phone);
    };

    render() {
        const {
            phone,
            verificationCode
        } = this.state;
        const {
            leftValue,
            nextStepTitle,
            count,
            isChangePhone,
        } = this.props;
        const isVerificationCodeDisabled = !!!phone;
        const isNextStepButtonDisabled = isVerificationCodeDisabled || !!!verificationCode;
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
                    placeholderText={isChangePhone ? WK_T(wkLanguageKeys.enter_new_phone) : WK_T(wkLanguageKeys.enter_phone)}
                    onChangeText={this._onChangeTextWithPhone}
                />
                <RegisterItem
                    phone={phone}
                    needVerifyCode={true}
                    isVerificationCodeDisabled={isVerificationCodeDisabled}
                    count={count}
                    verifyCodeClick={this._verifyCodeClick}
                    keyboardType={'number-pad'}
                    maxInputLength={6}
                    marginTop={10}
                    leftValue={register_verification_code_icon}
                    value={verificationCode}
                    placeholderText={WK_T(wkLanguageKeys.verify_code)}
                    onChangeText={this._onChangeTextWithVerifyCode}
                    onSubmitEditing={this._nextStep}
                />
                <WKGeneralButton
                    title={nextStepTitle}
                    disabled={isNextStepButtonDisabled}
                    click={this._nextStep}
                />
            </View>
        );
    }


}
