import React, {PureComponent} from 'react';
import {
    Alert,
} from 'react-native';

class WKAlert extends PureComponent {

    static show = (msg, leftTitle, rightTitle, rightCallback, leftCallBack, title, options = {cancelable: false}) => {
        let message = 'a tip message';
        if (msg) {
            message = msg;
        }

        let buttons = [];

        if (rightTitle) {
            const leftButton = {
                text: leftTitle, onPress: () => {
                    if (leftCallBack && typeof leftCallBack === 'function') {
                        leftCallBack();
                    }
                }
            };
            const rightButton = {
                text: rightTitle, onPress: () => {
                    if (rightCallback && typeof rightCallback === 'function') {
                        rightCallback();
                    }
                }
            };
            if (leftTitle) {
                buttons.push(leftButton);
                buttons.push(rightButton);
            } else {
                buttons.push(rightButton);
            }
        } else {
            leftTitle = leftTitle || 'Ok';
            const leftButton = {
                text: leftTitle, onPress: () => {
                    if (leftCallBack && typeof leftCallBack === 'function') {
                        leftCallBack();
                    }
                }
            };
            buttons.push(leftButton);
        }

        Alert.alert(
            title,
            message,
            buttons,
            options,
        );
    }

}

export default WKAlert;