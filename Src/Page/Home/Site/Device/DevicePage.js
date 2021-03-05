import React, {Component} from 'react';
import {DeviceEventEmitter} from 'react-native';
import {StyleSheet, View, FlatList, Text, TouchableOpacity, Image, ImageBackground, Animated,} from 'react-native';
import WKRegExp from "../../../../Utils/WKRegExp";
import me_station_add from "../../../../Source/Me/me_station_add.png";
import WKNavigationBarRightItem from "../../../../Common/Components/WKNavigationBarRightItem";
import WKNavigationBarLeftItem from "../../../../Common/Components/WKNavigationBarLeftItem";
import WKGeneralBackground from "../../../../Common/Components/WKGeneralBackground";
import WKFetch from "../../../../Network/WKFetch";
import { ScrollView } from 'react-native-gesture-handler';

export default class DevicePage extends Component {

    constructor(props) {
        super(props);
        const {navigation} = props;
        const {state} = navigation;
        const {params} = state;
        const {stationId, isFromHomePage} = params;
        this.state = {
            data: [],
            stationId: stationId,
            isRegister: false,
            isFromHomePage: !!isFromHomePage,
        };
    }

    static navigationOptions = ({navigation}) => {
        return {
            header: null
        };
    };

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    _goBack() {
        const {navigation} = this.props;
        const callback = navigation.getParam('callback');
        callback && callback();
        navigation.goBack();
    }

    _loadDeviceList = (loading = true, tipMsg = '') => {
        const {
            stationId,
        } = this.state;
        const data = {
            stationId,
        };
        loading && WKLoading.show();
        WKFetch('/station/device', data).then(ret => {
            WKLoading.hide();
            const {ok, errorMsg, data} = ret;
            if (!ok) {
                this.setState({
                    data: [],
                });
                this._setOriginData();
                return;
            }
            if (data
                && data.results
                && Array.isArray(data.results)
                && data.results.length
            ) {
                WKToast.show(tipMsg);
                this._setOriginData(data.results);
                this.setState({
                    data: data.results
                }, () => {
                    if (this.state.savedSearchText.trim()) {
                        this._search(this.state.savedSearchText);
                    }
                });
            } else {
                this._setOriginData();
                this.setState({
                    data: [],
                    emptyText: `${WK_T(wkLanguageKeys.no_device)}_`
                });
            }
        });
    };

    _setOriginData = (data = []) => {
        this.state.originData = data;
    };

    _addDevice = () => {
        const {navigation} = this.props;
        navigation.navigate(RouteKeys.AddDevicePage, this.state);
    };

    _delete = () => {
        this._hideModal();
        const {
            data,
            stationId,
            deletedIndex
        } = this.state;
        const {id} = data[deletedIndex];
        const requestData = {
            stationId,
        };
        WKLoading.show();
        WKFetch(`/station/device/${id}`, requestData, METHOD.DELETE).then(ret => {
            if (ret.ok) {
                DeviceEventEmitter.emit(EmitterEvents.ADD_STATION_SUCCESS); // To refresh home page
                this._loadDeviceList(false);
            } else {
                this._loadDeviceList(false, ret.errorMsg);
            }
        });
    };


    render() {
        const {isRegister, isOnLine, isAdd} = this.state;
        let bgimg = isOnLine ? me_station_add : me_station_add;
        return (
            <WKGeneralBackground style={styles.container}>
                <View style={styles.emptyHeader}/>
                    <View style={styles.searchBar}>
                        <WKNavigationBarLeftItem click={()=>{this._goBack()}}/>
                        <View style={styles.searchArea}>
                            <Text style={[styles.searchTitle]}>Device</Text>
                        </View>
                        <WKNavigationBarRightItem click={()=>{}}/>
                    </View>
                <View style={styles.midContainer}>
                    <ScrollView>
                        <View style={styles.deviceNameView}>
                            <Text style={[styles.deviceTitle]}>Device</Text>
                        </View>
                        <View style={styles.deviceImgView}>
                            <Image source={me_station_add} style={styles.deviceImg}/>    
                        </View>
                        {!isAdd && <View style={styles.deviceStatusView}>
                        
                        </View>}
                        <View style={styles.deviceInfoView}>
                            <View style={styles.itemView}>
                                <Image source={me_station_add} style={styles.itemIcon}/> 
                                <Text style={[styles.itemTitle]}>SN</Text>
                                <Text style={[styles.itemValue]}>154415455</Text>
                            </View>
                            {!isAdd && <View style={styles.itemView}>
                                <Image source={me_station_add} style={styles.itemIcon}/> 
                                <Text style={[styles.itemTitle]}>Cpacity</Text>
                                <Text style={[styles.itemValue]}>5 kw / 13 kWh</Text>
                            </View>}
                            {!isAdd && <View style={styles.itemView}>
                                <Image source={me_station_add} style={styles.itemIcon}/> 
                                <Text style={[styles.itemTitle]}>Operating Mode</Text>
                                <Text style={[styles.itemValue]}>154415455</Text>
                            </View>}
                        </View>
                    </ScrollView>
                </View>
                <View style={styles.bottomButtonContainer}>
                    <TouchableOpacity
                        style={styles.bottomButton}
                        onPress={null}
                        activeOpacity={0.5}
                    >
                        <Text style={styles.bottomButtonText}>Register</Text>
                    </TouchableOpacity>
                </View>
                <Image source={bgimg} style={styles.backgroundImg}/>
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
    },
    searchBar: {
        height: 60,
        backgroundColor: Colors.theme,
        flexDirection: 'row',
        paddingBottom: 15,
    },
    searchArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchTitle:{
        fontSize: 16,
        color: Colors.white,
    },

    midContainer:{
        height: SCREEN_HEIGHT - global.__iosStatusBarHeight__ - 120 - iosSafeAreaBottomHeight,
        padding: 20,
        zIndex: 9,
    },
    deviceNameView:{
        marginTop: 20,
    },
    deviceTitle:{
        fontSize: 32,
        color: Colors.white,
        fontWeight: 'bold'
    },
    deviceImgView:{
        height: SCREEN_WIDTH - 40,
        padding: 50,
    },
    deviceImg:{
        width: SCREEN_WIDTH - 140,
        height: SCREEN_WIDTH - 140,
    },

    itemView: {
        flexDirection: 'row',
        alignItems:'center',
        backgroundColor: Colors.cellBackgroundColor,
        height: 50,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 25,
        marginBottom: 20,
    },
    itemIcon: {
        width:20,
        height:20,
    },
    itemTitle: {
        flex: 1,
        fontSize: 16,
        marginLeft: 20,
        color: Colors.cellFontColor,
    },
    itemValue: {
        flex: 1,
        textAlign: 'right',
        fontSize: 16,
        color: Colors.white,
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
        height: 80,
        marginTop: 20,
        width: SCREEN_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: iosSafeAreaBottomHeight,
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
    backgroundImg: {
        position: 'absolute',
        height: SCREEN_HEIGHT - 140,
        width: SCREEN_WIDTH,
        resizeMode: 'stretch',
    },
});

