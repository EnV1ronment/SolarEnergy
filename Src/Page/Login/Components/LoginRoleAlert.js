import React, {Component} from 'react';
import {
    View,
    Modal,
    Image,
    TouchableOpacity,
    Text,
    StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';

// icons
import login_switch_role_hint from '../../../Source/Login/login_switch_role_hint.png';
import login_no_reminders_selected from '../../../Source/Login/login_no_reminders_selected.png';
import login_no_reminders_unselected from '../../../Source/Login/login_no_reminders_unselected.png';
import WKModal from "../../../Common/Components/WKModal";

export default class LoginRoleAlert extends Component {

    static propTypes = {
        visible: PropTypes.bool,
        click: PropTypes.func
    };

    static defaultProps = {
        visible: false
    };

    state = {
        reminderSelected: false
    };

    _onPress = () => {
        const {click} = this.props;
        click && click();
    };

    // no more reminders
    _reminder = () => {
        this.setState(({reminderSelected}) => {
            return {reminderSelected: !reminderSelected};
        });
    };

    render() {
        const {
            visible
        } = this.props;
        const {
            reminderSelected
        } = this.state;
        return (
            <View style={styles.container}>
                <WKModal
                    transparent={true}
                    presentationStyle={'overFullScreen'}
                    visible={visible}
                    animationType={'fade'}
                    onRequestClose={this._onPress}
                >
                    <View style={styles.cover}>
                        <View style={styles.imageBg}>
                            <Image style={styles.image} source={login_switch_role_hint}/>
                            <View style={styles.innerView}>
                                <Text style={styles.instruction}>
                                    {WK_T(wkLanguageKeys.configure_parameters)}
                                </Text>
                                <View style={styles.bottom}>
                                    <TouchableOpacity
                                        style={styles.noMoreReminderButton}
                                        activeOpacity={1}
                                        onPress={this._reminder}
                                    >
                                        <Image
                                            style={styles.noMoreReminderButtonIcon}
                                            source={reminderSelected ? login_no_reminders_selected : login_no_reminders_unselected}
                                        />
                                        <Text style={styles.noMoreReminderButtonText}>{WK_T(wkLanguageKeys.no_more_reminders)}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.confirmButton}
                                        activeOpacity={1}
                                        onPress={this._onPress}
                                    >
                                        <Text style={styles.confirmButtonText}>{WK_T(wkLanguageKeys.ok)}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </WKModal>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        position: 'absolute'
    },
    cover: {
        flex: 1,
    },
    imageBg: {
        marginTop: 36 + adaptHeight(120),
        marginLeft: 25,
        width: 264,
    },
    image: {
        resizeMode: 'stretch',
        width: 264,
        height: 154,
        position: 'absolute'
    },
    innerView: {
        marginTop: 30,
        marginLeft: 18,
        marginRight: 10,
        height: 115,
        justifyContent: 'space-between'
    },
    instruction: {
        color: Colors.white,
        fontSize: 12,
        lineHeight: 20
    },
    noMoreButton: {
        width: 11,
        height: 11,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#00a6ff"
    },
    bottom: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    noMoreReminderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        paddingLeft: 0
    },
    noMoreReminderButtonIcon: {
        width: 12,
        height: 12,
        resizeMode: 'stretch'
    },
    noMoreReminderButtonText: {
        fontSize: 10,
        color: "#00a6ff",
        marginLeft: 5
    },
    confirmButton: {
        width: 76,
        height: 26,
        backgroundColor: Colors.buttonBgColor,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5,
        marginBottom: 5
    },
    confirmButtonText: {
        fontSize: 12,
        color: Colors.white
    }
});
