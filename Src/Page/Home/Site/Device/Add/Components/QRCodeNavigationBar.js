import React, {PureComponent} from 'react';
import {View, Text, StyleSheet, TouchableWithoutFeedback, Image} from "react-native";
import PropTypes from 'prop-types';
import backButtonImage from "../../../../../../Source/Common/back_icon.png";
import me_manual_icon from '../../../../../../Source/Me/me_manual_icon.png';

export default class QRCodeNavigationBar extends PureComponent {

    static propTypes = {
        title: PropTypes.string.isRequired, // Title for navigation bar
        bgColor: PropTypes.string.isRequired ,// Background color for navigation bar
        leftItemClick: PropTypes.func, // Optional, callback for left item button event
        showTopRightSNButton: PropTypes.bool,
        enterSN: PropTypes.func,
    };

    static defaultProps = {
        showTopRightSNButton: false
    };

    _backButtonClicked = () => {
        const {navigation, leftItemClick} = this.props;
        if (leftItemClick) {
            leftItemClick();
            return;
        }
        navigation && navigation.goBack();
    };

    _enterSn = () => {
        const {enterSN} = this.props;
        enterSN && enterSN();
    };

    render() {
        return (<View style={[styles.navigationBarContainer, {backgroundColor: this.props.bgColor}]}>
            <TouchableWithoutFeedback onPress={this._backButtonClicked}>
                <View style={styles.backButtonContainer}>
                    <Image source={backButtonImage} style={styles.backButtonImage}/>
                </View>
            </TouchableWithoutFeedback>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{this.props.title}</Text>
            </View>
            {
                this.props.showTopRightSNButton &&  <TouchableWithoutFeedback onPress={this._enterSn}>
                    <View style={styles.snView}>
                        <Image source={me_manual_icon} style={styles.snIcon}/>
                    </View>
                </TouchableWithoutFeedback>
            }
        </View>);
    }

}

const styles = StyleSheet.create({
    navigationBarContainer: {
        flexDirection: 'row',
        height: __iosSafeAreaTopHeight__
    },
    backButtonContainer: {
        height: __iosNavigationBarHeight__,
        width: 60,
        marginTop: __isIOS__ ? __iosStatusBarHeight__ : 25
    },
    backButtonImage: {
        width: 7,
        height: 13,
        marginLeft: 15,
        marginTop: 15
    },
    snView: {
        height: __iosNavigationBarHeight__,
        position: 'absolute',
        bottom: 0,
        right: 0,
        paddingRight: 10,
        paddingLeft: 15,
        justifyContent: 'center',
    },
    snIcon: {
        width: 16,
        height: 16,
    },
    titleContainer: {
        width: __SCREEN_WIDTH__ - 120,
        height: __iosNavigationBarHeight__,
        marginTop: __isIOS__ ? __iosStatusBarHeight__ : 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 17.0,
        color: 'white'
    }
});