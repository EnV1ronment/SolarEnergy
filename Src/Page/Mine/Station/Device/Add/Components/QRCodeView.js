import React, {PureComponent} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Easing,
} from 'react-native';
import PropTypes from 'prop-types';
import ScanQRCodeBottomView from "./ScanQRCodeBottomView";

const qrCodeBoxSize = __SCREEN_WIDTH__ * 2 / 3.0;

export default class QRCodeView extends PureComponent {

    static propTypes = {
        startScanQRCode: PropTypes.bool.isRequired,
        enterSNCode: PropTypes.func.isRequired,
        openTorch: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            animation: new Animated.Value(0)
        };
    }

    componentDidMount() {
        this._startAnimation();
    }

    _startAnimation = () => {
        this.state.animation.setValue(0);
        Animated.timing(this.state.animation, {
            toValue: 1,
            duration: 1500,
            easing: Easing.linear,
        }).start(() => this._startAnimation());
    };

    _enterSNCode = () => {
        const {enterSNCode} = this.props;
        enterSNCode && enterSNCode();
    };

    _openTorch = () => {
        const {openTorch} = this.props;
        openTorch && openTorch();
    };

    render() {
        return (
            <View style={{flex: 1}}>
                <View style={styles.qrCodeTopPlaceholder}/>
                <View style={styles.qrCodeContainer}>
                    <View style={styles.itemStyle}/>
                    <View style={styles.rectangle}>

                        {/********************* top left corner border line *********************/}
                        <View style={styles.topLeftRowLine}/>
                        <View style={styles.topLeftColumnLine}/>

                        {/********************* top right corner border line *********************/}
                        <View style={styles.topRightRowLine}/>
                        <View style={styles.topRightColumnLine}/>

                        {/********************* bottom left corner border line *********************/}
                        <View style={styles.bottomLeftRowLine}/>
                        <View style={styles.bottomLeftColumnLine}/>

                        {/********************* bottom right corner border line *********************/}
                        <View style={styles.bottomRightRowLine}/>
                        <View style={styles.bottomRightColumnLine}/>

                        {this.props.startScanQRCode && <Animated.View style={[styles.animatedStyle, {
                            transform: [{
                                translateY: this.state.animation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, qrCodeBoxSize]
                                })
                            }]
                        }]}/>}

                    </View>
                    <View style={styles.itemStyle}/>
                </View>
                <View style={styles.qrCodeBottomPlaceholder}>
                    <Text style={styles.textStyle}>{WK_T(wkLanguageKeys.align_qrCode)}</Text>
                    <View style={styles.bottomContainer}>
                        <ScanQRCodeBottomView enterSNCode={this._enterSNCode} openTorch={this._openTorch}/>
                    </View>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    // QRCode
    qrCodeTopPlaceholder: {
        height: (__SCREEN_HEIGHT__ - __iosSafeAreaTopHeight__ - qrCodeBoxSize) / 2 - 60,
        width: __SCREEN_WIDTH__,
        backgroundColor: 'rgba(0,0,0,0.7)'
    },
    qrCodeContainer: {
        flexDirection: 'row',
    },
    itemStyle: {
        width: (__SCREEN_WIDTH__ - qrCodeBoxSize) / 2,
        height: qrCodeBoxSize,
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    animatedStyle: {
        height: 0.7,
        backgroundColor: Colors.buttonBgColor,
        shadowColor: Colors.buttonBgColor,
        shadowOpacity: 0.9,
        shadowOffset: {
            height: 1
        }
    },
    rectangle: {
        height: qrCodeBoxSize,
        width: qrCodeBoxSize,
        borderWidth: 0.5,
        borderColor: '#969696',
    },
    topLeftRowLine: {
        position: 'absolute',
        width: 15,
        height: 2,
        backgroundColor: Colors.buttonBgColor,
    },
    topLeftColumnLine: {
        position: 'absolute',
        width: 2,
        height: 15,
        backgroundColor: Colors.buttonBgColor
    },
    topRightRowLine: {
        position: 'absolute',
        marginLeft: qrCodeBoxSize - 15,
        width: 15,
        height: 2,
        backgroundColor: Colors.buttonBgColor
    },
    topRightColumnLine: {
        position: 'absolute',
        marginLeft: qrCodeBoxSize - 3,
        width: 3,
        height: 15,
        backgroundColor: Colors.buttonBgColor
    },
    bottomLeftRowLine: {
        position: 'absolute',
        marginTop: qrCodeBoxSize - 15,
        width: 2,
        height: 15,
        backgroundColor: Colors.buttonBgColor
    },
    bottomLeftColumnLine: {
        position: 'absolute',
        marginTop: qrCodeBoxSize - 3,
        width: 15,
        height: 3,
        backgroundColor: Colors.buttonBgColor
    },
    bottomRightRowLine: {
        position: 'absolute',
        marginTop: qrCodeBoxSize - 15,
        marginLeft: qrCodeBoxSize - 3,
        width: 3,
        height: 15,
        backgroundColor: Colors.buttonBgColor
    },
    bottomRightColumnLine: {
        position: 'absolute',
        marginTop: qrCodeBoxSize - 3,
        marginLeft: qrCodeBoxSize - 15,
        width: 15,
        height: 3,
        backgroundColor: Colors.buttonBgColor
    },

    // Bottom view
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.black
    },
    qrCodeBottomPlaceholder: {
        // height: (__SCREEN_HEIGHT__ - __iosSafeAreaTopHeight__ - qrCodeBoxSize) / 2 + 60 + 60,
        // width: __SCREEN_WIDTH__,
        flexGrow: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'space-between'
    },
    textStyle: {
        color: '#e6e6f0',
        marginTop: 20,
        fontSize: 13.0,
        marginLeft: 15,
        marginRight: 15,
        alignSelf: 'center',
        textAlign: 'center'
    }
});
