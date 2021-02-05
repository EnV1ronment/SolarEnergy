import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';

export default class BottomView extends Component {

    static propTypes = {
        register: PropTypes.func,
        forget: PropTypes.func
    };

    _register = () => {
        this.props.register && this.props.register();
    };

    _forgetPassword = () => {
        this.props.forget && this.props.forget();
    };

    render() {
        return (
            <View style={styles.signInOrForgetPasswordContainer}>
                <TouchableOpacity onPress={this._register} activeOpacity={1}>
                    <Text style={styles.signInOrForgetPassword}>{WK_T(wkLanguageKeys.sign_up)}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this._forgetPassword} activeOpacity={1}>
                    <Text style={styles.signInOrForgetPassword}>{WK_T(wkLanguageKeys.forgot_pwd)}</Text>
                </TouchableOpacity>
            </View>
        );
    };

}

const styles = StyleSheet.create({
    signInOrForgetPasswordContainer: {
        marginTop: 10,
        padding: 9,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    signInOrForgetPassword: {
        paddingLeft: 5,
        paddingRight: 5,
        color: Colors.white,
        fontSize: 12
    }
});
