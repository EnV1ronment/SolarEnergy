import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TextInput,
    TouchableWithoutFeedback
} from 'react-native';
import PropTypes from 'prop-types';
import login_password_hidden from '../../../../Source/Login/login_password_hidden.png';
import login_password_visible from '../../../../Source/Login/login_password_visible.png';

export default class RegisterItem extends Component {

    static propTypes = {
        needVerifyCode: PropTypes.bool, // default is false
        isVerificationCodeDisabled: PropTypes.bool, // Used for verification button whether disabled status
        count: PropTypes.number,
        verifyCodeClick: PropTypes.func,
        phone: PropTypes.string, // Only available when needVerifyCode is true,
        keyboardType: PropTypes.string,
        marginTop: PropTypes.number,
        leftValue: PropTypes.any, // image or text
        leftClick: PropTypes.func,
        value: PropTypes.string,
        autoFocus: PropTypes.bool, // default is false
        placeholderText: PropTypes.string,
        maxInputLength: PropTypes.number,
        onSubmitEditing: PropTypes.func,
        onChangeText: PropTypes.func,
        leftValueWidth: PropTypes.number, // Optional, default is 60
        leftValueBorderRightWidth: PropTypes.number, // Optional, default is 1
        hideAsterisk: PropTypes.bool, // Optional, default is true. Namely hide "*"
        showEye: PropTypes.bool, // Optional, whether to show eye, default is false
    };

    static defaultProps = {
        autoFocus: false,
        keyboardType: 'default',
        needVerifyCode: false,
        isVerificationCodeDisabled: false,
        leftValueWidth: 60,
        leftValueBorderRightWidth: 1,
        hideAsterisk: true,
        showEye: false
    };

    state = {
        isPasswordVisible: false
    };

    _onSubmitEditing = () => {
        const {onSubmitEditing} = this.props;
        onSubmitEditing && onSubmitEditing();
    };

    _onChangeText = (text) => {
        const {onChangeText} = this.props;
        onChangeText && onChangeText(text);
    };

    _leftButtonClick = () => {
        const {leftClick} = this.props;
        leftClick && leftClick();
    };

    _showOrHidePassword = () => {
        this.setState(({isPasswordVisible}) => {
            return {isPasswordVisible: !isPasswordVisible};
        });
    };

    _getVerifyCode = () => {
        const {verifyCodeClick} = this.props;
        verifyCodeClick && verifyCodeClick();
    };

    _renderVerificationCode = () => {
        const {isVerificationCodeDisabled, count} = this.props;
        const beginCountdown = count > 0;
        const disabled = beginCountdown || isVerificationCodeDisabled;
        const bgColor = disabled ? Colors.placeholder : '#00a6ff';
        const text = beginCountdown ? `${WK_T(wkLanguageKeys.get_code)}(${count})` : WK_T(wkLanguageKeys.get_code);
        return (<TouchableWithoutFeedback onPress={this._getVerifyCode} disabled={disabled}>
            <View style={[styles.verificationCode, {backgroundColor: bgColor}]}>
                <Text style={styles.verificationCodeText}>{text}</Text>
            </View>
        </TouchableWithoutFeedback>);
    };

    render() {
        const {
            marginTop,
            leftValue,
            value,
            placeholderText,
            maxInputLength,
            autoFocus,
            keyboardType,
            needVerifyCode,
            leftValueWidth,
            leftValueBorderRightWidth,
            hideAsterisk,
            showEye
        } = this.props;

        let isLeftImage = true;
        if (typeof leftValue === 'string') {
            isLeftImage = false;
        }

        const showEyeButton = !!value;
        const visiblePasswordIcon = this.state.isPasswordVisible ? login_password_visible : login_password_hidden;

        return (
            <View style={[styles.cell, {marginTop: marginTop}]}>
                <View style={[styles.leftContainer, {width: leftValueWidth, borderRightWidth: leftValueBorderRightWidth}]}>
                    <TouchableWithoutFeedback onPress={this._leftButtonClick}>
                        {isLeftImage ? <Image style={styles.leftIcon} source={leftValue}/> :
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1, height: 38}}>
                                {!hideAsterisk && <Text style={[styles.leftText, {paddingTop: 3.5}]}>*</Text>}
                                <Text style={styles.leftText}>
                                    {leftValue}
                                </Text>
                            </View>}
                    </TouchableWithoutFeedback>
                </View>
                <TextInput
                    keyboardType={keyboardType}
                    placeholderTextColor={Colors.placeholder}
                    selectionColor={Colors.white}
                    autoFocus={autoFocus}
                    style={styles.textInput}
                    value={value}
                    maxLength={maxInputLength || Number.MAX_VALUE}
                    placeholder={placeholderText}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    secureTextEntry={!this.state.isPasswordVisible && showEye}
                    returnKeyType={'done'}
                    contextMenuHidden={true} // Disable copy and paste
                    onSubmitEditing={this._onSubmitEditing}
                    onChangeText={this._onChangeText}
                />
                {needVerifyCode && this._renderVerificationCode()}
                {showEye && showEyeButton && <TouchableWithoutFeedback onPress={this._showOrHidePassword}>
                    <View style={styles.visiblePasswordIconContainer}>
                        <Image style={styles.visiblePasswordIcon} source={visiblePasswordIcon}/>
                    </View>
                </TouchableWithoutFeedback>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    cell: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 5,
        marginRight: 5,
        height: 50,
        borderRadius: 3,
        backgroundColor: Colors.theme,
        borderWidth: 1,
        borderColor: Colors.buttonBgColor,
        shadowColor: Colors.buttonBgColor,
        shadowOpacity: 0.9,
        shadowOffset: {
            height: 1
        }
    },
    leftContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 5,
        marginBottom: 5,
        borderRightWidth: 1,
        borderRightColor: Colors.placeholder
    },
    leftText: {
        fontSize: 12,
        color: "#00a6ff"
    },
    leftIcon: {
        width: 14,
        height: 16,
        resizeMode: 'contain',
    },
    textInput: {
        flex: 1,
        height: 40,
        fontSize: 12,
        marginLeft: 15,
        color: Colors.white,
        paddingVertical: 0 // make text show whole on Android
    },
    verificationCode: {
        paddingLeft: 10,
        paddingRight: 10,
        marginRight: 5,
        paddingTop: 12,
        paddingBottom: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        backgroundColor: "#00a6ff"
    },
    verificationCodeText: {
        color: Colors.white,
        fontSize: 12
    },
    visiblePasswordIconContainer: {
        position: 'absolute',
        right: 0,
        height: 25,
        width: 35,
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    visiblePasswordIcon: {
        width: 12,
        height: 12,
        marginRight: 8,
        resizeMode: 'contain',
    }
});
