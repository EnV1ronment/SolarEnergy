import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Vibration,
    DeviceEventEmitter,
    StatusBar,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import WKGeneralBackground from "../../../../../Common/Components/WKGeneralBackground";
import QRCodeView from "./Components/QRCodeView";
import QRCodeNavigationBar from "./Components/QRCodeNavigationBar";
import WKFetch from "../../../../../Network/WKFetch";
import WKPresenter from "../../../../../Common/Components/WKPresenter";

const qrCodeBoxSize = __SCREEN_WIDTH__ * 2 / 3.0;

export default class AddDevicePage extends Component {

    navigationBarTitle = WK_T(wkLanguageKeys.qr_bar_code);

    constructor(props) {
        super(props);
        const {navigation} = props;
        const {state} = navigation;
        const {params} = state;
        const {stationId} = params;
        this.state = {
            startScanQRCode: true,
            isTorchOpened: false,
            stationId: stationId,
            statusBarBgColor: 'transparent',
            statusBarTranslucent: true
        };
    }

    _availableScanArea = (event) => {
        if (__isAndroid__) return true; // The scan area cannot be controlled on Android now.
        const topHeight = (__SCREEN_HEIGHT__ - __iosSafeAreaTopHeight__ - qrCodeBoxSize) / 2 - 40;
        return (event.bounds.origin.y - qrCodeBoxSize - topHeight) < 0
            && (event.bounds.origin.y - topHeight - __iosSafeAreaTopHeight__) > 0
            && event.bounds.origin.x > 0
            && event.bounds.origin.x < 250;
    };

    _scanQRCodeResult = (event) => {
        if (!event) {
            return;
        }
        if (this._availableScanArea(event) && event.data && typeof event.data === 'string' && event.data.length) {
            this.setState({
                startScanQRCode: false
            }, () => {
                Vibration.vibrate(20);
                if (event.data.indexOf('http') >= 0
                    || event.data.indexOf(':') >= 0
                    || event.data.indexOf('com') >= 0
                    || event.data.indexOf('/') >= 0) {
                    this.setState({
                        statusBarBgColor: Colors.theme,
                        statusBarTranslucent: false,
                    });
                    WKToast.show(event.type === 'QR_CODE' ? WK_T(wkLanguageKeys.invalid_qrCode) : 'Invalid bar code');
                    //确认后放开扫码权限
                    // this.setState({
                    //     startScanQRCode: true
                    // })
                    return;
                }
                //查询设备是否存在

                // const data = {
                //     stationId: this.state.stationId,
                // };
                // WKLoading.show(WK_T(wkLanguageKeys.adding));
                // WKFetch(`/station/device/${event.data}`, data, METHOD.POST).then(ret => {
                //     WKLoading.hide();
                //     if (!ret.ok) {
                //         this.setState({
                //             statusBarBgColor: Colors.theme,
                //             statusBarTranslucent: false,
                //         }, () => {
                //             this.props.navigation.goBack();
                //         });
                //         WKToast.show(ret.errorMsg);
                //         return;
                //     }
                //     DeviceEventEmitter.emit(EmitterEvents.ADD_DEVICE_SUCCESS);
                //     this.setState({
                //         visible: true
                //     });
                // });
                const {navigation} = this.props;
                navigation.navigate(RouteKeys.DevicePage, {
                    stationId: this.state.stationId,
                    deviceInfo: {},
                    isFromHomePage: navigation.getParam('isFromHomePage', false),
                    callback: (sn) => {
                        navigation.getParam('callback')(sn);
                        this.setState({
                            startScanQRCode: true
                        });
                        navigation.goBack();
                    },
                });
            });
        }
    };

    _renderNotAuthorizedView = () => {
        return (<View style={{flex: 1}}>
            <QRCodeNavigationBar
                {...this.props}
                title={this.navigationBarTitle}
                bgColor={Colors.theme}
                showTopRightSNButton={true}
                enterSN={this._enterSNCode}
            />
            <WKGeneralBackground>
                <View style={styles.noAuthorizedViewContainer}>
                    <Text numberOfLines={0} style={styles.noAuthorizedViewText}>
                        {WK_T(wkLanguageKeys.authority_camera)}
                    </Text>
                </View>
            </WKGeneralBackground>
        </View>);
    };

    _enterHelp = () => {
        const {navigation} = this.props;
            navigation.navigate(RouteKeys.SNHelpPage);
    };

    _enterSNCode = () => {
        this.setState({
            statusBarBgColor: Colors.theme,
            statusBarTranslucent: false,
        }, () => {
            const {navigation} = this.props;
            navigation.navigate(RouteKeys.SNCodePage, {
                stationId: this.state.stationId,
                isFromHomePage: navigation.getParam('isFromHomePage', false),
                callback: sn => {
                    sn && navigation.getParam('callback')(sn);
                    this.setState({
                        statusBarBgColor: 'transparent',
                        statusBarTranslucent: true,
                    });
                    sn && navigation.goBack();
                }
            });
        });
    };

    _openTorch = () => {
        this.setState(({isTorchOpened}) => {
            return {isTorchOpened: !isTorchOpened};
        });
    };

    _flashMode = () => {
        const {isTorchOpened} = this.state;
        return isTorchOpened ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off;
    };

    _renderStatusBar = () => {
        if (__isIOS__) return;
        return (<StatusBar
            // barStyle={'light-content'}
            backgroundColor={this.state.statusBarBgColor}
            translucent={this.state.statusBarTranslucent}
        />);
    };

    render() {
        const {startScanQRCode} = this.state;
        return (
            <View style={styles.container}>
                {this._renderStatusBar()}
                <RNCamera
                    style={styles.container}
                    type={RNCamera.Constants.Type.back}
                    notAuthorizedView={this._renderNotAuthorizedView()}
                    // pendingAuthorizationView
                    captureAudio={false}
                    flashMode={this._flashMode()}
                    onBarCodeRead={startScanQRCode ? this._scanQRCodeResult : null}
                    androidCameraPermissionOptions={{
                        title: WK_T(wkLanguageKeys.agree_camera),
                        message: WK_T(wkLanguageKeys.agree_use_camera),
                        buttonPositive: WK_T(wkLanguageKeys.ok),
                        buttonNegative: WK_T(wkLanguageKeys.cancel),
                    }}
                >
                    <QRCodeNavigationBar
                        {...this.props}
                        leftItemClick={() => {
                            this.setState({
                                statusBarBgColor: Colors.theme,
                                statusBarTranslucent: false,
                            }, () => {
                                this.props.navigation.goBack();
                            });
                        }}
                        title={this.navigationBarTitle}
                        bgColor={'rgba(0,0,0,0.7)'}
                    />
                    <QRCodeView
                        startScanQRCode={startScanQRCode}
                        enterHelp={this._enterHelp}
                        enterSNCode={this._enterSNCode}
                        openTorch={this._openTorch}
                    />
                </RNCamera>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.theme,
    },
    // No Authorization View
    noAuthorizedViewContainer: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center'
    },
    noAuthorizedViewText: {
        color: '#8e8e8e',
        paddingLeft: 15,
        paddingRight: 15,
        alignSelf: 'center',
        textAlign: 'center'
    }
});
