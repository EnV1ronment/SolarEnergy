import React, {PureComponent} from 'react';
import {
    View,
    Modal,
    Image,
    TouchableOpacity,
    Text,
    StyleSheet,
    ImageBackground
} from 'react-native';
import PropTypes from 'prop-types';
import alert_bg_image from '../../Source/Common/alert_bg_image.png';
import WKModal from "./WKModal";

export default class WKPresenter extends PureComponent {

    static propTypes = {
        visible: PropTypes.bool,
        image: PropTypes.any,
        message: PropTypes.string.isRequired,
        messageAttributes: PropTypes.array,   // message range text
        messageAttributeColors: PropTypes.array, // message range text color
        leftButtonText: PropTypes.string,
        leftButtonClick: PropTypes.func.isRequired,
        defaultButtonText: PropTypes.string,
        defaultButtonClick: PropTypes.func
    };

    static defaultProps = {
        visible: false,
        leftButtonText: '',
        defaultButtonText: ''
    };

    _rightClick = () => {
        const {defaultButtonClick} = this.props;
        defaultButtonClick && defaultButtonClick();
    };

    _leftClick = () => {
        const {leftButtonClick} = this.props;
        if (leftButtonClick) leftButtonClick();
    };

    _getMessage = () => {

        let {
            message,
            messageAttributes,
            messageAttributeColors
        } = this.props;

        if (message && messageAttributes && messageAttributeColors) {
            if (!Array.isArray(messageAttributes) || !Array.isArray(messageAttributeColors)) {
                __DEV__ && console.error('WKPresenter: messageAttributes and messageAttributeColors are required an Array type!');
            }
            if (!messageAttributes.length || !messageAttributeColors.length) {
                __DEV__ && console.error('WKPresenter: messageAttributes and messageAttributeColors cannot be empty')
            }
            let obj = {};
            messageAttributes.forEach(item => {
                if (message.indexOf(item) < 0) {
                    __DEV__ && console.error(`WKPresenter: 【${message}】doesn't contain 【${item}】`);
                }
                obj[message.indexOf(item)] = item;
            });
            const sortedMessageAttributes = [];
            Object.keys(obj).forEach(key => {
                sortedMessageAttributes.push(obj[key]);
            });

            sortedMessageAttributes.forEach(item => {
                message = message.replace(item, '-');
            });
            const messageArr = message.split('-');

            return (<Text style={styles.instruction}>
                {
                    messageArr.map((item, index) => <Text key={index}>
                        {item}
                        <Text
                            style={
                                [
                                    styles.instruction,
                                    {
                                        color: index > (messageAttributeColors.length - 1) ? messageAttributeColors[messageAttributeColors.length - 1] : messageAttributeColors[index]
                                    }
                                ]
                            }
                        >
                            {sortedMessageAttributes[index]}
                        </Text>
                    </Text>)
                }
            </Text>);
        }

        return <Text style={styles.instruction}>{message}</Text>;
    };

    render() {
        const {
            image,
            leftButtonText,
            defaultButtonText,
            visible
        } = this.props;
        return (
            <View style={styles.container}>
                <WKModal
                    transparent={true}
                    presentationStyle={'overFullScreen'}
                    visible={visible}
                    animationType={'fade'}
                    onRequestClose={this._leftClick}
                >
                    <View style={styles.cover}>
                        <ImageBackground style={styles.view} source={alert_bg_image} resizeMode={'stretch'}>
                            <View style={styles.messageContainer}>
                                {!!image && <Image source={image} style={styles.image}/>}
                                {this._getMessage()}
                            </View>
                            <View style={styles.buttonContainer}>
                                {!!leftButtonText.trim().length && <TouchableOpacity
                                    style={styles.leftButton}
                                    activeOpacity={0.7}
                                    onPress={this._leftClick}
                                >
                                    <Text style={styles.leftButtonText}>{leftButtonText}</Text>
                                </TouchableOpacity>}
                                {!!defaultButtonText.trim().length && <TouchableOpacity
                                    style={styles.button}
                                    activeOpacity={0.9}
                                    onPress={this._rightClick}
                                >
                                    <Text style={styles.buttonText}>{defaultButtonText}</Text>
                                </TouchableOpacity>}
                            </View>
                        </ImageBackground>
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    view: {
        width: __SCREEN_WIDTH__ - 100,
        height: 166 + 40,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    messageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        width: 39,
        height: 44
    },
    instruction: {
        color: Colors.white,
        fontSize: 12,
        marginTop: 12,
        marginLeft: 15,
        marginRight: 15,
        lineHeight: 20
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    leftButton: {
        width: 80,
        height: 35,
        borderWidth: 1,
        borderColor: Colors.placeholder,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20
    },
    leftButtonText: {
        fontSize: 12,
        color: Colors.placeholder,
        paddingLeft: 5
    },
    button: {
        marginBottom: 18,
        width: 80,
        height: 35,
        borderRadius: 3,
        backgroundColor: "#00a6ff",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: Colors.buttonBgColor,
        shadowColor: "rgba(0, 166, 255, 0.35)",
        shadowOffset: {
            width: 0,
            height: 1
        },
        justifyContent: 'center',
        alignItems: 'center',
        shadowRadius: 8,
        shadowOpacity: 1
    },
    buttonText: {
        color: Colors.white,
        fontSize: 12
    }
});