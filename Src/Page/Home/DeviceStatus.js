import React, {Component} from 'react';
import {
    Text,
    StyleSheet,
    View,
    ScrollView,
    Image,
    TouchableWithoutFeedback,
    RefreshControl,
} from 'react-native';
import PieEcharts from "./Components/PieEcharts";
import {HcdWaveView} from './Components/HcdWaveView'

const _imgRes = [(<Image source={require('../../Source/Status/solar.png')}
                         style={{height: 40, width: 40, resizeMode: 'stretch'}}/>),
    (<Image source={require('../../Source/Status/grid.png')}
            style={{height: 40, width: 40, resizeMode: 'stretch'}}/>), (
        <Image source={require('../../Source/Status/consumption.png')}
               style={{height: 40, width: 40, resizeMode: 'stretch'}}/>), (
        <Image source={require('../../Source/Status/battery.png')}
               style={{height: 20, width: 40, resizeMode: 'stretch', marginBottom: 10}}/>)];
const imgRes = [(<Image source={require('../../Source/Status/icon_solar.png')}
                        style={{height: 40, width: 40, resizeMode: 'stretch'}}/>),
    (<Image source={require('../../Source/Status/icon_grid.png')}
            style={{height: 40, width: 40, resizeMode: 'stretch'}}/>), (
        <Image source={require('../../Source/Status/icon_consumption.png')}
               style={{height: 40, width: 40, resizeMode: 'stretch'}}/>), (
        <Image source={require('../../Source/Status/icon_battery.png')}
               style={{height: 40, width: 40, resizeMode: 'stretch'}}/>)];
const imgResSelected = [(<Image source={require('../../Source/Status/icon_solar_selected.png')}
                                style={{height: 40, width: 40, resizeMode: 'stretch'}}/>),
    (<Image source={require('../../Source/Status/icon_grid_selected.png')}
            style={{height: 40, width: 40, resizeMode: 'stretch'}}/>), (
        <Image source={require('../../Source/Status/icon_consumption_selected.png')}
               style={{height: 40, width: 40, resizeMode: 'stretch'}}/>), (
        <Image source={require('../../Source/Status/icon_battery_selected.png')}
               style={{height: 40, width: 40, resizeMode: 'stretch'}}/>)];
export default class DeviceStatus extends Component {
    state = {
        status: [{
            type: 'SOLAR',
            val: '— —',
            unit: 'kWh',
            power: '— —',
            powerUnit: 'kW',
            lifeTime: '— —',
            lifeUnit: 'kWh',
            icon: '',
            selected: true,
            status: 'Produced',
            detail: [{
                name: 'Home',
                val: '— —',
                unit: 'kWh'
            }, {
                name: 'Battery',
                val: '— —',
                unit: 'kWh'
            }, {
                name: 'Grid exported',
                val: '— —',
                unit: 'kWh',
                key: 'grid'
            }]
        }, {
            type: 'GRID ENERGY',
            val: '— —',
            unit: 'kWh',
            power: '— —',
            powerUnit: 'kW',
            lifeTime: '— —',
            lifeUnit: 'kWh',
            icon: '',
            selected: false,
            status: 'Imported',
            detail: [{
                name: 'Home',
                val: '— —',
                unit: 'kWh'
            }, {
                name: 'Battery',
                val: '— —',
                unit: 'kWh'
            }]
        }, {
            type: 'CONSUMPTION',
            val: '— —',
            unit: 'kWh',
            power: '— —',
            powerUnit: 'kW',
            lifeTime: '— —',
            lifeUnit: 'kWh',
            icon: '',
            selected: false,
            status: 'Consumed',
            detail: [{
                name: 'Solar',
                val: '— —',
                unit: 'kWh'
            }, {
                name: 'Battery',
                val: '— —',
                unit: 'kWh'
            }, {
                name: 'Grid imported',
                val: '— —',
                unit: 'kWh'
            }]
        }, {
            type: 'BATTERY',
            val: '— —',
            unit: '%',
            power: '— —',
            powerUnit: 'kW',
            icon: '',
            selected: false,
            status: WK_T(wkLanguageKeys.idle),
            detail: [{
                name: 'Power',
                val: '— —',
                unit: 'kW'
            }]
        }],
        index: 0
    };

    componentDidMount() {
        this.setState({})
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.dataSource.length) {
            this.setState({
                status: nextProps.dataSource,
                index: nextProps.index
            })
        } else {
            this.init();
        }
    }

    init = () => {
        this.setState({
            status: [{
                type: 'SOLAR',
                val: '— —',
                unit: 'kWh',
                power: '— —',
                powerUnit: 'kW',
                lifeTime: '— —',
                lifeUnit: 'kWh',
                icon: '',
                selected: true,
                status: 'Produced',
                detail: [{
                    name: 'Home',
                    val: '— —',
                    unit: 'kWh'
                }, {
                    name: 'Battery',
                    val: '— —',
                    unit: 'kWh'
                }, {
                    name: 'Grid exported',
                    val: '— —',
                    unit: 'kWh'
                }]
            }, {
                type: 'GRID ENERGY',
                val: '— —',
                unit: 'kWh',
                power: '— —',
                powerUnit: 'kW',
                lifeTime: '— —',
                lifeUnit: 'kWh',
                icon: '',
                selected: false,
                status: 'Imported',
                detail: [{
                    name: 'Home',
                    val: '— —',
                    unit: 'kWh'
                }, {
                    name: 'Battery',
                    val: '— —',
                    unit: 'kWh'
                }]
            }, {
                type: 'CONSUMPTION',
                val: '— —',
                unit: 'kWh',
                power: '— —',
                powerUnit: 'kW',
                lifeTime: '— —',
                lifeUnit: 'kWh',
                icon: '',
                selected: false,
                status: 'Consumed',
                detail: [{
                    name: 'Solar',
                    val: '— —',
                    unit: 'kWh'
                }, {
                    name: 'Battery',
                    val: '— —',
                    unit: 'kWh'
                }, {
                    name: 'Grid imported',
                    val: '— —',
                    unit: 'kWh'
                }]
            }, {
                type: 'BATTERY',
                val: '— —',
                unit: '%',
                power: '— —',
                powerUnit: 'kW',
                icon: '',
                selected: false,
                status: WK_T(wkLanguageKeys.idle),
                detail: [{
                    name: 'Power',
                    val: '— —',
                    unit: 'kW'
                }]
            }],
            index: 0
        })
    };

    _getCurrentDesc = () => [
        WK_T(wkLanguageKeys.current_generation_power),
        WK_T(wkLanguageKeys.current_onGrid_power),
        WK_T(wkLanguageKeys.current_consumption_power),
        WK_T(wkLanguageKeys.current_battery_power),
    ];

    _getDailyDesc = () => [
        WK_T(wkLanguageKeys.daily_generation),
        WK_T(wkLanguageKeys.daily_onGrid),
        WK_T(wkLanguageKeys.daily_consumption),
        WK_T(wkLanguageKeys.daily_battery),
    ];

    _getLifetimeDes = () => [
        WK_T(wkLanguageKeys.lifetime_generation),
        WK_T(wkLanguageKeys.lifetime_onGrid),
        WK_T(wkLanguageKeys.lifetime_consumption),
    ];

    getStatusView = (status) => {

        const mapRound = [0, 1];
        const colors = [
            'rgb(35,124,254)',
            'rgb(163,161,252)',
            'rgb(240,132,5)',
            'rgb(44,219,215)',
        ];
        return (<View style={styles._statusViews}>
            {
                mapRound.map((index) => {
                    return (<View key={index}>
                        {
                            status.map((item, i) => {
                                if (i % 2 === index)
                                    return (
                                        <View key={i} style={[styles.status_View, {
                                            backgroundColor: i === 0 ? '#121f4b' : 'rgb(18,31,75)',
                                            borderColor: '#121f4b'
                                        }]}>
                                            <View style={styles.status_firstLine}>
                                                <View style={styles.status_firstLine_title}>
                                                    <View
                                                        style={[styles.status_firstLine_circular, {backgroundColor: colors[i]}]}/>
                                                    <Text
                                                        style={[styles.status_firstLine_type, {color: colors[i]}]}>{item.type}</Text>
                                                </View>
                                                <View style={styles.status_firstLine_icon}>{_imgRes[i]}
                                                    {i === 3 && item.val !== '— —' && item.val !== '- -' &&
                                                    <View
                                                        style={[styles.status_firstLine_power, {width: (item.val / 100 * 30)}]}/>}
                                                </View>
                                            </View>
                                            <View style={styles.status_secondLine}>
                                                <View style={styles.status_secondLine_device}>
                                                    <Text
                                                        style={[styles.val, {color: colors[i]}]}>{item.power}</Text>
                                                    {item.power !== '— —' && item.power !== '- -' && <Text
                                                        style={[styles.unit, {color: colors[i]}]}>{item.powerUnit}</Text>}
                                                </View>
                                                <Text
                                                    style={[styles.unit, {color: colors[i]}]}>{this._getCurrentDesc()[i]}</Text>
                                            </View>
                                            <View style={styles.splitLine}/>
                                            <View style={styles.status_thirdLine}>
                                                <View style={styles.status_thirdLine_device}>
                                                    {i === 3 ? <Text
                                                        style={[styles.unit, {color: colors[i]}]}>SOC:</Text> : null}
                                                    <Text
                                                        style={[styles.val, {color: colors[i]}]}>{item.val}</Text>
                                                    {item.val !== '— —' && item.val !== '- -' && <Text
                                                        style={[styles.unit, {color: colors[i]}]}>{item.unit}</Text>}
                                                </View>
                                                {i === 3 ? <Text
                                                        style={[styles.unit, {color: colors[i]}]}>{item.status}</Text> :
                                                    <Text
                                                        style={[styles.unit, {color: colors[i]}]}>{this._getDailyDesc()[i]}</Text>}
                                            </View>
                                            <View style={styles.status_fourthLine}>
                                                {i === 3 ? null : <View style={{flexDirection: 'row'}}>
                                                    <Text style={styles.lifeTime}>{item.lifeTime} </Text>
                                                    {item.lifeTime !== '— —' && item.lifeTime !== '- -' &&
                                                    <Text style={styles.lifeTime}>{item.lifeUnit}</Text>}
                                                </View>}
                                                {i === 3 ? null : <Text
                                                    style={styles.lifeTime}>{this._getLifetimeDes()[i]}</Text>}
                                            </View>
                                            <View style={styles._statusMarker}>
                                                <Image source={require('../../Source/Status/icon_marker.png')}
                                                       style={{height: 12, width: 12, resizeMode: 'stretch'}}/>
                                            </View>
                                        </View>
                                    )
                            })
                        }
                    </View>)
                })
            }
        </View>);
    };

    render() {
        let {status} = this.state;
        let _status = this.getStatusView(status);
        return (
            <ScrollView
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={this.props.onRefresh}
                    />
                }
            >
                {_status}
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    device: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    d_left: {
        flex: 1,
        color: Colors.white,
        fontSize: 12,
        fontWeight: 'bold'
    },
    d_right: {
        color: Colors.buttonBgColor,
        fontSize: 12,
        fontWeight: 'bold'
    },
    describe: {
        color: Colors.white,
        fontSize: 14,
        paddingTop: 12,
        paddingBottom: 12,
        fontWeight: 'bold'
    },
    _statusViews: {
        flexDirection: 'row',
        paddingLeft: 5,
    },
    _statusView: {
        width: __SCREEN_WIDTH__ / 2 - 10,
        borderWidth: 1,
        borderColor: '#121f4b',
        height: 120,
        marginBottom: 5,
        marginRight: 2.5,
        marginLeft: 2.5,
        borderRadius: 3,
        paddingRight: 5,
        flexDirection: 'row'
    },
    _statusView_b: {
        width: __SCREEN_WIDTH__ / 2 - 10,
        borderWidth: 1,
        borderColor: '#121f4b',
        backgroundColor: '#121f4b',
        height: 120,
        marginBottom: 5,
        marginRight: 2.5,
        marginLeft: 2.5,
        borderRadius: 3,
        paddingRight: 5,
        flexDirection: 'row'
    },
    _statusCircular: {
        height: 14,
        marginRight: 9,
        marginLeft: 9,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    circular: {
        width: 10,
        height: 10,
        borderRadius: 10,
        backgroundColor: '#ffffff',
    },
    circular_b: {
        width: 10,
        height: 10,
        borderRadius: 10,
        backgroundColor: '#019ef4',
    },
    _statusDes: {
        fontSize: 12,
        color: '#ffffff',
        flex: 1
    },
    _type: {
        height: 14,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    type: {
        fontSize: 12,
        color: '#ffffff',
    },
    val: {
        fontSize: 24,
    },
    unit: {
        fontSize: 12,
        marginBottom: 3,
        // marginTop: 12
    },
    status: {
        fontSize: 12,
        color: '#ffffff',
        marginTop: 6
    },
    lifeTime: {
        fontSize: 12,
        color: '#5b6483',
    },
    type_b: {
        fontSize: 12,
        color: '#019ef4',
    },
    val_b: {
        fontSize: 24,
        color: '#019ef4'
    },
    unit_b: {
        fontSize: 12,
        color: '#019ef4',
        marginBottom: 3,
        // marginTop: 12
    },
    status_b: {
        fontSize: 12,
        color: '#019ef4',
        marginTop: 6
    },
    _statusIcon: {
        height: 60,
        width: 40,
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    _statusMarker: {
        position: 'absolute',
        bottom: 2,
        right: 2
    },
    marker: {},
    _detailView: {
        marginTop: 10,
        flexDirection: 'row'
    },
    _detailTitle: {
        flexDirection: 'row',
        marginLeft: 15,
        height: 20,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 5
    },
    _detailCircular: {
        backgroundColor: '#00a6ff',
        width: 9,
        height: 9,
        borderRadius: 9,
    },
    _detailName: {
        marginLeft: 10,
        color: '#00a6ff'
    },
    _detailLeft: {
        flex: 2,
        position: 'relative',
        width: __SCREEN_WIDTH__,
        height: 2 * __SCREEN_WIDTH__ / 3
    },
    _detailLeftView: {
        height: 2 * __SCREEN_WIDTH__ / 3,
        position: 'absolute',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    _detailRight: {
        flex: 1,
        marginTop: 20
    },
    _rightData: {
        flexDirection: 'row',
        marginBottom: 5,
        marginTop: 10
    },
    _rightVal: {
        color: '#ffffff',
        fontSize: 18
    },
    _rightUnit: {
        color: '#ffffff',
        fontSize: 12,
        marginTop: 6
    },
    _rightTitle: {
        flexDirection: 'row',
        marginBottom: 5
    },
    _rightCircular: {
        width: 9,
        height: 9,
        borderRadius: 9,
        marginTop: 6
    },
    _rightName: {
        marginTop: 2,
        marginLeft: 25,
        color: '#5b6483',
        fontSize: 12
    },
    _rightUnderline: {
        height: 1,
        width: '75%',
        backgroundColor: '#2c3141'
    },
    status_View: {
        width: __SCREEN_WIDTH__ / 2 - 10,
        // flex: 1,
        borderWidth: 1,
        height: __SCREEN_HEIGHT__ / 3,
        marginBottom: 5,
        marginRight: 2.5,
        backgroundColor: 'rgb(18,31,75)',
        marginLeft: 2.5,
        borderRadius: 3,
        paddingLeft: 5,
        paddingRight: 5,
    },
    status_firstLine: {
        flexDirection: 'row',
        flex: 1,
    },
    status_firstLine_title: {
        flexDirection: 'row',
        height: 20,
        alignItems: 'center',
        justifyContent: 'flex-start',
        flex: 1,
    },
    status_firstLine_circular: {
        width: 10,
        height: 10,
        borderRadius: 10,
        marginRight: 10,
    },
    status_firstLine_type: {
        fontSize: 12
    },
    status_firstLine_icon: {
        width: 50,
        height: 50,
        paddingBottom: 5,
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
    },
    status_firstLine_power: {
        height: 12,
        backgroundColor: 'rgb(44,219,215)',
        borderRadius: 1,
        position: 'absolute',
        top: 19,
        left: 4
    },
    status_secondLine: {
        flex: 1,
    },
    status_secondLine_device: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    splitLine: {
        borderWidth: 0.5,
        borderColor: 'rgb(8,22,67)',
        marginTop: 20,
        marginBottom: 20
    },
    status_thirdLine: {
        flex: 1,
    },
    status_thirdLine_device: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    status_fourthLine: {
        flex: 1,
        paddingBottom: 5,
        paddingRight: 5,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
});
