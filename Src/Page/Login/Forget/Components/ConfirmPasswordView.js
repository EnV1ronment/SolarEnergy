import React, {Component} from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import RegisterItem from "../../Register/Components/RegisterItem";
import register_password_icon from "../../../../Source/Register/register_password_icon.png";
import WKGeneralButton from "../../../../Common/Components/WKGeneralButton";

export default class ConfirmPasswordView extends Component {

    static propTypes = {
        confirm: PropTypes.func.isRequired,
        route: PropTypes.string.isRequired
    };

    state = {
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    };

    _onChangeTextWithOldPassword = (oldPassword) => {
        this.setState({oldPassword: oldPassword.trim()});
    };

    _onChangeTextWithNewPassword = (newPassword) => {
        this.setState({newPassword: newPassword.trim()});
    };

    _onChangeTextWithConfirmNewPassword = (confirmNewPassword) => {
        this.setState({confirmNewPassword: confirmNewPassword.trim()});
    };

    _confirm = () => {
        if (!this.state.confirmNewPassword) return;
        const {confirm} = this.props;
        confirm && confirm(this.state);
    };

    render() {
        const {
            oldPassword,
            newPassword,
            confirmNewPassword
        } = this.state;
        const {route} = this.props;
        let disabled;
        if (route === RouteKeys.AccountPage) {
            disabled = oldPassword.length < 8 || newPassword.length < 8 || confirmNewPassword.length < 8
        } else {
            disabled = newPassword.length < 8 || confirmNewPassword.length < 8
        }
        return (
            <View>
                {route === RouteKeys.AccountPage && <RegisterItem
                    marginTop={25}
                    leftValue={register_password_icon}
                    autoFocus={true}
                    value={oldPassword}
                    placeholderText={WK_T(wkLanguageKeys.old_pwd)}
                    maxInputLength={16}
                    onChangeText={this._onChangeTextWithOldPassword}
                    showEye={true}
                />}
                <RegisterItem
                    marginTop={route === RouteKeys.AccountPage ? 10 : 25}
                    leftValue={register_password_icon}
                    autoFocus={route !== RouteKeys.AccountPage}
                    value={newPassword}
                    placeholderText={WK_T(wkLanguageKeys.new_pwd)}
                    maxInputLength={16}
                    onChangeText={this._onChangeTextWithNewPassword}
                    showEye={true}
                />
                <RegisterItem
                    marginTop={10}
                    leftValue={register_password_icon}
                    value={confirmNewPassword}
                    placeholderText={WK_T(wkLanguageKeys.confirm_new_pwd)}
                    onChangeText={this._onChangeTextWithConfirmNewPassword}
                    maxInputLength={16}
                    onSubmitEditing={this._confirm}
                    showEye={true}
                />
                <WKGeneralButton
                    title={WK_T(wkLanguageKeys.confirm)}
                    disabled={disabled}
                    click={this._confirm}
                />
            </View>
        );
    }

}
