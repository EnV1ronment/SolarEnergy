import React, {Component} from 'react';
import {
    Keyboard,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Image
} from "react-native";
import WKGeneralBackground from "../../../../../../Common/Components/WKGeneralBackground";
import WKNavigationBarRightItem from "../../../../../../Common/Components/WKNavigationBarRightItem";
import RegisterItem from "../../../../../Login/Register/Components/RegisterItem";
import site_title_delete from '../../../../../../Source/Status/site_title_delete.png';
import WKFetch from "../../../../../../Network/WKFetch";
import WKNavigationBarLeftItem from "../../../../../../Common/Components/WKNavigationBarLeftItem";

export default class SNCodePage extends Component {

    constructor(props) {
        super(props);
        const {navigation} = props;
        const {state} = navigation;
        const {params} = state;
        const {
            stationId,
        } = params;
        this.state = {
            snCode: '',
            stationId: stationId,
        };
    }

    static navigationOptions = ({navigation}) => {
        return {
            header: null,
        };
    };

    componentDidMount() {
    }

    _hideKeyboard = () => {
        Keyboard.dismiss();
    };

    _goBack() {
        const {navigation} = this.props;
        const callback = navigation.getParam('callback');
        callback && callback();
        navigation.goBack();
    }

    _finish = () => {
        this._hideKeyboard();
        const {snCode} = this.state;
        if (!snCode) {
            WKToast.show(WK_T(wkLanguageKeys.enter_snCode));
            return;
        }

        //查询设备是否存在
        // const {
        //     snCode,
        //     stationId,
        // } = this.state;
        //
        // if (!snCode) {
        //     WKToast.show(WK_T(wkLanguageKeys.enter_snCode));
        //     return;
        // }
        //
        // const data = {
        //     stationId,
        // };
        // WKLoading.show(WK_T(wkLanguageKeys.adding));
        // WKFetch(`/station/device/${snCode}`, data, METHOD.POST).then(ret => {
        //     WKLoading.hide();
        //     if (!ret.ok) {
        //         WKToast.show(ret.errorMsg);
        //         return;
        //     }
        //     WKToast.show(WK_T(wkLanguageKeys.add_successfully));
        //     DeviceEventEmitter.emit(EmitterEvents.ADD_DEVICE_SUCCESS);
        //     const {navigation} = this.props;
        //     const isFromHomePage = navigation.getParam('isFromHomePage', false);
        //     if (isFromHomePage) {
        //         navigation.popToTop();
        //     } else {
        //         navigation.navigate(RouteKeys.DevicePage);
        //     }
        // });

        const {navigation} = this.props;
        navigation.navigate(RouteKeys.DevicePage, {
            stationId: this.state.stationId,
            deviceInfo: {},
            isFromHomePage: navigation.getParam('isFromHomePage', false),
            callback: () => {
                const {navigation} = this.props;
                navigation.getParam('callback')(this.state.snCode);
                navigation.goBack();
            },
        });
    };

    _onChangeText = (snCode) => {
        this.setState({
            snCode: snCode.trim(),
        });
    };

    render() {
        const {navigation} = this.props;
        return (
        <WKGeneralBackground style={styles.container}>
            <View style={styles.emptyHeader}/>
                <View style={styles.searchBar}>
                    <WKNavigationBarLeftItem click={()=>{this._goBack()}}/>
                    <View style={styles.searchArea}>
                        <Text style={[styles.searchTitle]}>Add Device</Text>
                    </View>
                    <WKNavigationBarRightItem click={()=>{}}/>
                </View>
            <View style={[styles.snView, {paddingTop: 0, paddingBottom: 0}]}>
                <Text style={[styles.title, {alignSelf: 'center'}]}>SN</Text>
                <View style={[styles.scanButton, {
                    paddingTop: 0,
                    paddingBottom: 0,
                    paddingRight: 0,
                }]}>
                    <TextInput
                        keyboardType={'default'}
                        placeholderTextColor={Colors.placeholder}
                        selectionColor={Colors.white}
                        autoFocus={false}
                        style={styles.textInput}
                        maxLength={16}
                        value={this.state.snCode}
                        placeholder={'Please enter SN code'}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        secureTextEntry={false}
                        returnKeyType={'done'}
                        // contextMenuHidden={true} // Disable copy and paste
                        onChangeText={(e) => this._onChangeText(e)}/>
                    {!!this.state.snCode.length && <TouchableOpacity
                        style={styles.clearButton}
                        disabled={!!!this.state.snCode}
                        onPress={() => this.setState({snCode: ''})}>
                            <Image source={site_title_delete} resizeMode='contain'/>
                        </TouchableOpacity>}
                    </View> 
                </View>
                <View style={styles.bottomButtonContainer}>
                    <TouchableOpacity
                        style={styles.bottomButton}
                        onPress={this._finish}
                        activeOpacity={0.5}>
                        <Text style={styles.bottomButtonText}>Next</Text>
                    </TouchableOpacity>
                </View>
            </WKGeneralBackground>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    emptyHeader: {
        height: global.__iosStatusBarHeight__,
        backgroundColor: Colors.theme,
        zIndex: 9
    },
    searchBar: {
        height: 60,
        backgroundColor: Colors.theme,
        flexDirection: 'row',
        paddingBottom: 15,
        zIndex: 9
    },
    searchArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    snView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: Colors.cellBackgroundColor,
        height: 60,
        paddingLeft: 15,
        margin: 10,
        marginBottom: 5,
        marginTop: 10,
        paddingTop: 12,
        paddingBottom: 12,
        borderRadius: 6,
    },

    // Device SN and Site Location styles
    title: {
        fontSize: 16,
        color: Colors.cellFontColor,
    },
    scanButton: {
        flex: 1,
        paddingRight: 15,
        flexDirection: 'row',
        paddingLeft: 15,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    scanText: {
        fontSize: 16,
        color: "#999999",
        marginRight: 5,
    },

    // Site title row styles
    textInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
        marginLeft: 5,
        color: Colors.white,
        marginRight: 5,
        paddingVertical: 0, // make text show whole on Android
    },
    clearButton: {
        paddingRight: 15,
        height: 60,
        justifyContent: 'center',
    },
    // Bottom button
     bottomButtonContainer: {
        height: 150,
        width: SCREEN_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 81 + iosSafeAreaBottomHeight,
    },
    bottomButton: {
        backgroundColor: Colors.buttonBgColor,
        borderWidth: 1,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        width: 240,
    },
    bottomButtonText: {
        color: Colors.white,
        fontSize:16,
    },
});

