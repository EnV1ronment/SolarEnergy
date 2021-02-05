import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    Image,
    TextInput,
    Keyboard
} from 'react-native';
import PropTypes from 'prop-types';

// Icons
import switchRole from '../../../Source/Login/login_page_switch_role.png';
import companySign from '../../../Source/Login/login_page_company_sign.png';
import accountIcon from '../../../Source/Login/login_account_icon.png';
import passwordIcon from '../../../Source/Login/login_password_icon.png';
import login_password_hidden from '../../../Source/Login/login_password_hidden.png';
import login_password_visible from '../../../Source/Login/login_password_visible.png';

// Components
import WKGeneralButton from "../../../Common/Components/WKGeneralButton";
import LoginRoleAlert from "./LoginRoleAlert";
import WKRegExp from "../../../Utils/WKRegExp";

const ROLE_TYPE = {
    NORMAL: 'Normal',
    ADVANCE: 'Advance'
};

export default class LoginView extends Component {

    static propTypes = {
        login: PropTypes.func.isRequired,
        userName: PropTypes.string.isRequired,
        showRoleSwitch: PropTypes.bool, // Needless and unused for this version, will be used in next version.
    };

    static defaultProps = {
        showRoleSwitch: false
    };

    constructor(props) {
        super(props);
        this.state = {
            role: ROLE_TYPE.NORMAL,
            showRoleAlert: false,
            userName: props.userName,
            password: '',
            isPasswordVisible: false
        };
    }

    _hideKeyboard = () => {
        Keyboard.dismiss();
    };

    _switchRole = () => {
        this._hideKeyboard();
        this.setState(({role}) => {
            return {
                role: role === ROLE_TYPE.NORMAL ? ROLE_TYPE.ADVANCE : ROLE_TYPE.NORMAL,
                showRoleAlert: role === ROLE_TYPE.NORMAL
            };
        });
    };

    _onChangeTextWithUserName = (userName) => {
        this.setState({userName:  WKRegExp.onlyNumber(userName)});
    };

    _clickLogin = () => {
        const {login} = this.props;
        const {userName, password, role} = this.state;
        if (!userName) {
            WKToast.show(WK_T(wkLanguageKeys.enter_phone));
            return;
        }
        login && login({userName, password, role});
    };

    _onChangeTextWithPassword = (password) => {
        this.setState({password: password.trim()});
    };

    _showOrHidePassword = () => {
        this.setState(({isPasswordVisible}) => {
            return {isPasswordVisible: !isPasswordVisible};
        });
    };

    _disableLoginButton = () => {
        const {userName, password} = this.state;
        if (userName === '178') {
            return !userName || password.length < 1;
        }
        return !userName || password.length < 8;
    };

    _hideRoleAlert = () => {
        this.setState({showRoleAlert: false});
    };

    render() {
        const {
            role,
            userName,
            password,
            isPasswordVisible,
            showRoleAlert
        } = this.state;
        const {showRoleSwitch} = this.props;
        const visiblePasswordIcon = isPasswordVisible ? login_password_visible : login_password_hidden;
        const disabled = this._disableLoginButton();
        const showEyeButton = !!password;
        return (
            <View style={styles.container}>
                {showRoleSwitch && <TouchableWithoutFeedback onPress={this._switchRole}>
                    <View style={styles.switchRole}>
                        <Text style={styles.roleText}>{role}</Text>
                        <Image style={styles.roleImage} source={switchRole}/>
                    </View>
                </TouchableWithoutFeedback>}
                <Image style={[styles.companySign, {marginTop: showRoleSwitch ? 0 : 30}]} source={companySign}/>
                <View style={styles.accountPassword}>
                    <View style={{alignItems: 'center'}}>
                        <View>
                            <View style={{marginTop: 30, flexDirection: 'row', alignItems: 'center'}}>
                                <Image style={styles.phoneOrPasswordImage} source={accountIcon}/>
                                {/*<Text style={styles.phoneOrPasswordTitle}>{WK_T(wkLanguageKeys.phone)}</Text>*/}
                            </View>
                            <View style={{marginTop: 30, flexDirection: 'row', alignItems: 'center'}}>
                                <Image style={styles.phoneOrPasswordImage} source={passwordIcon}/>
                                {/*<Text style={styles.phoneOrPasswordTitle}>{WK_T(wkLanguageKeys.password)}</Text>*/}
                            </View>
                        </View>
                    </View>
                    <View style={{flexGrow: 1, justifyContent: 'center'}}>
                        <TextInput
                            placeholderTextColor={Colors.placeholder}
                            selectionColor={Colors.white}
                            style={styles.fieldTextInput}
                            value={userName}
                            maxLength={11}
                            placeholder={WK_T(wkLanguageKeys.enter_phone)}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            returnKeyType={'done'}
                            keyboardType={'number-pad'}
                            contextMenuHidden={true} // Disable copy and paste
                            onChangeText={this._onChangeTextWithUserName}
                        />
                        <View style={{justifyContent: 'center'}}>
                            <TextInput
                                placeholderTextColor={Colors.placeholder}
                                selectionColor={Colors.white}
                                style={styles.fieldTextInput}
                                placeholder={WK_T(wkLanguageKeys.enter_password)}
                                autoCapitalize={'none'}
                                maxLength={16}
                                value={password}
                                secureTextEntry={!isPasswordVisible}
                                onChangeText={this._onChangeTextWithPassword}
                                onSubmitEditing={this._clickLogin}
                                returnKeyType={'done'}
                                contextMenuHidden={true} // Disable copy and paste
                            />
                            {showEyeButton && <TouchableWithoutFeedback onPress={this._showOrHidePassword}>
                                <View style={styles.visiblePasswordIconContainer}>
                                    <Image style={styles.visiblePasswordIcon} source={visiblePasswordIcon}/>
                                </View>
                            </TouchableWithoutFeedback>}
                        </View>
                    </View>
                </View>
                <WKGeneralButton
                    title={WK_T(wkLanguageKeys.log_in)}
                    disabled={disabled}
                    click={this._clickLogin}
                />
                <LoginRoleAlert
                    visible={showRoleAlert}
                    click={this._hideRoleAlert}
                />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        marginTop: adaptHeight(120),
        marginLeft: 5,
        marginRight: 5,
        height: 224 + 60,
        paddingBottom: 10,
        opacity: 0.8,
        backgroundColor: "#121f4b",
        shadowColor: "rgba(0, 0, 0, 0.35)",
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowRadius: 8,
        shadowOpacity: 1
    },
    switchRole: {
        width: 150,
        paddingTop: 13,
        paddingLeft: 11,
        flexDirection: 'row',
        alignItems: 'center'
    },
    roleText: {
        fontSize: 15,
        color: Colors.buttonBgColor,
        marginRight: 19,
        fontWeight: 'bold'
    },
    roleImage: {
        marginTop: 4,
        paddingLeft: adaptWidth(12),
        width: 10,
        height: 12
    },
    sign: {
        marginTop: 24,
        position: 'absolute',
        width: __SCREEN_WIDTH__,
        alignItems: 'center'
    },
    companySign: {
        alignSelf: 'center',
        width: 97,
        height: 27
    },
    accountPassword: {
        flex: 1,
        marginLeft: 9,
        marginTop: 40,
        marginRight: 15,
        flexDirection: 'row',
    },
    phoneOrPasswordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    phoneOrPasswordImage: {
        width: 16,
        height: 16
    },
    phoneOrPasswordTitle: {
        marginLeft: 10,
        fontSize: 12,
        color: Colors.white
    },
    fieldTextInput: {
        marginTop: 8,
        marginLeft: 12,
        fontSize: 12,
        height: 33,
        color: Colors.white,
        borderBottomWidth: 1,
        paddingVertical: 0, // make text show whole on Android
        borderBottomColor: Colors.white
    },
    visiblePasswordIconContainer: {
        position: 'absolute',
        right: -5,
        top: 18,
        height: 20,
        width: 30,
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
