import React, {Component} from 'react';
import WKGeneralBackground from "../../Common/Components/WKGeneralBackground";
import SegmentedControlTab from "react-native-segmented-control-tab";
import {DeviceEventEmitter, View} from "react-native";
import AlarmTabBar from "../Alarm/Components/AlarmTabBar";
import EnergyTimeView from "./EnergyTime/EnergyTimeView";
import PowerTimeView from "./PowerTime/PowerTimeView";
import EnergyDateBar from "./Components/EnergyDateBar";
import EnergyDateModal from "./Components/EnergyDateModal";
import {
    today,
    addDay,
    subtractDay,
    subtractMonth,
    addMonth,
    startDateOfCurrentWeek,
    endDateOfCurrentWeek,
    addWeek,
    subtractWeek,
    startOfCurrentMonth,
    endDateOfCurrentMonth,
} from "../../Utils/WKTime";
import WKDatePicker from "../../Common/Components/WKDatePicker";
import WKFetch from "../../Network/WKFetch";
import WKDeviceSelect from "../../Common/Components/WKDeviceSelect/WKDeviceSelect";
import PowerTimeViewEchartLegend from "./PowerTime/PowerTimeViewEchartLegend";

const DATE_TYPE = {
    DAY: 0,
    WEEK: 1,
    MONTH: 2,
    DATE_RANGE: 3
};

export default class EnergyPage extends Component {

    static navigationOptions = () => ({title: WK_T(wkLanguageKeys.energy)});

    state = {
        deviceSelectMarginTop: 0,
        stationOrDevice: 'All Stations',
        selectedSegmentedIndex: 0,
        startDate: today(),
        endDate: '',
        isDateModalVisible: false,
        modalVisible: false,
        selectDateTypeIndex: DATE_TYPE.DAY,
        visible: false,
        allDevices: [],
        selectedDevices: [],
        devCode: null,
        deviceBindTime: today(),
        params: {
            startTime: today(),
            endTime: today(),
            timeType: 'day',
            devCode: null, // Number type
            stationId: 'all',
            stationCode: 'all'
        }
    };

    componentDidMount() {
        this._getStations();
        this._addObserver();
    }

    componentWillUnmount() {
        this._removeObserver();
    }

    _getStations = () => {
        WKFetch('/enums/station-device').then(ret => {
            const {ok, errorMsg, data} = ret;
            if (ok) {
                if (data
                    && data.results
                    && Array.isArray(data.results)
                    && data.results.length
                ) {
                    this.setState({
                        allDevices: data.results,
                        stationOrDevice: data.results[0].name,
                    });
                    this._setSelectedDevices(null,
                        this.state.params.stationId,
                        this.state.params.stationCode,
                        data.results);
                }
            } else {
                WKToast.show(errorMsg);
            }
        });
    };

    _addObserver = () => {
        this.addDeviceListener = DeviceEventEmitter.addListener(EmitterEvents.ADD_DEVICE_SUCCESS, this._getStations);
        this.addStationListener = DeviceEventEmitter.addListener(EmitterEvents.ADD_STATION_SUCCESS, this._getStations);
        this.subscription = DeviceEventEmitter.addListener(EmitterEvents.RECEIVED_NOTIFICATION, this._receivedNotification);
    };

    _receivedNotification = () => {
        this._getStations();
    };

    _removeObserver = () => {
        this.addDeviceListener && this.addDeviceListener.remove();
        this.addStationListener && this.addStationListener.remove();
        this.subscription && this.subscription.remove();
    };

    _handleSegmentedIndexChange = selectedSegmentedIndex => {
        this.tabBarRef._goToTab(selectedSegmentedIndex);
        this.setState({selectedSegmentedIndex});
    };

    _onTabChange = (tab, tabIndex) => {
        this.setState({selectedSegmentedIndex: tabIndex});
    };

    _leftArrowClick = () => {
        const {selectDateTypeIndex, startDate, endDate} = this.state;
        if (selectDateTypeIndex === DATE_TYPE.DAY) {
            this.setState({startDate: subtractDay(startDate)});
            this._setParams(DATE_TYPE.DAY, subtractDay(startDate), subtractDay(startDate));
        } else if (selectDateTypeIndex === DATE_TYPE.MONTH) {
            this.setState({
                startDate: subtractMonth(startDate),
                endDate: subtractMonth(endDate),
            });
            this._setParams(DATE_TYPE.MONTH, subtractMonth(startDate), subtractMonth(endDate));
        } else if (selectDateTypeIndex === DATE_TYPE.WEEK) {
            this.setState({
                startDate: subtractWeek(startDate),
                endDate: subtractWeek(endDate)
            });
            this._setParams(DATE_TYPE.WEEK, subtractWeek(startDate), subtractWeek(endDate));
        }
    };

    _setSelectedDevices = (devCode, stationId, stationCode, allDevices) => {
        let selectedDevices = PowerTimeViewEchartLegend(
            devCode,
            stationId,
            allDevices,
        );
        WKFetch('/setting/user/bind-device-time', {
            devCode,
            stationId,
            stationCode,
        }).then(ret => {
            if (ret.data &&
                ret.data.results &&
                ret.data.results.bindTime
            ) {
                const {bindTime} = ret.data.results;
                const deviceBindTime = bindTime.substr(0, 10);
                this.setState({deviceBindTime, selectedDevices});
            } else {
                this.setState({selectedDevices});
            }
        });
    };

    _setParams = (selectDateTypeIndex, startDate, endDate, devCode, stationId, stationCode) => {
        let timeType;
        if (selectDateTypeIndex === DATE_TYPE.DAY) {
            timeType = 'day';
        } else if (selectDateTypeIndex === DATE_TYPE.MONTH) {
            timeType = 'month';
        } else if (selectDateTypeIndex === DATE_TYPE.WEEK || selectDateTypeIndex === DATE_TYPE.DATE_RANGE) {
            timeType = 'dateRange';
        }
        const {params} = this.state;
        this.setState({
            params: {
                startTime: startDate || params.startTime,
                endTime: endDate || params.endTime,
                timeType: timeType || params.timeType,
                devCode: devCode || this.state.devCode, // Number type
                stationId: stationId || params.stationId,
                stationCode: stationCode || params.stationCode
            }
        });
    };

    _dateClick = () => {
        this.setState({
            isDateModalVisible: true
        });
    };

    _selectDateCallBack = (index) => {
        if (index === DATE_TYPE.DAY) {
            this.setState({
                isDateModalVisible: false,
                startDate: today(),
                selectDateTypeIndex: index
            });
            this._setParams(index, today(), today());
        } else if (index === DATE_TYPE.MONTH) {
            this.setState({
                isDateModalVisible: false,
                startDate: startOfCurrentMonth(),
                endDate: endDateOfCurrentMonth(),// take care
                selectDateTypeIndex: index
            });
            this._setParams(index, startOfCurrentMonth(), endDateOfCurrentMonth());
        } else if (index === DATE_TYPE.WEEK) {
            this.setState({
                isDateModalVisible: false,
                startDate: startDateOfCurrentWeek(),
                endDate: endDateOfCurrentWeek(),
                selectDateTypeIndex: index
            });
            this._setParams(index, startDateOfCurrentWeek(), endDateOfCurrentWeek());
        } else if (index === DATE_TYPE.DATE_RANGE) {
            this.setState({
                isDateModalVisible: false,
                visible: true
            });
        }
    };

    _rightArrowClick = () => {
        const {selectDateTypeIndex, startDate, endDate} = this.state;
        if (selectDateTypeIndex === DATE_TYPE.DAY) {
            this.setState({startDate: addDay(startDate)});
            this._setParams(DATE_TYPE.DAY, addDay(startDate), addDay(startDate));
        } else if (selectDateTypeIndex === DATE_TYPE.MONTH) {
            this.setState({
                startDate: addMonth(startDate),
                endDate: addMonth(endDate),
            });
            this._setParams(DATE_TYPE.MONTH, addMonth(startDate), addMonth(endDate));
        } else if (selectDateTypeIndex === DATE_TYPE.WEEK) {
            this.setState({
                startDate: addWeek(startDate),
                endDate: addWeek(endDate)
            });
            this._setParams(DATE_TYPE.WEEK, addWeek(startDate), addWeek(endDate));
        }
    };

    _selectDevice = () => {
        this.setState({
            modalVisible: true
        });
    };

    _onChangeDevice = (item) => {
        this.state.stationOrDevice = item.name;
        if (item.code) { // device
            this.state.devCode = item.code;
            this._setParams(
                null,
                null,
                null,
                item.code,
            );
            this._setSelectedDevices(
                item.code,
                this.state.params.stationId,
                this.state.params.stationCode,
                this.state.allDevices,
            );
        } else { // station
            this.setState({
                devCode: null,
            }, () => {
                this._setParams(
                    null,
                    null,
                    null,
                    null,
                    item.stationId,
                    item.stationCode,
                );
                this._setSelectedDevices(
                    null,
                    item.stationId,
                    item.stationCode,
                    this.state.allDevices,
                );
            });
        }
    };

    render() {
        const {
            startDate,
            endDate,
            isDateModalVisible,
            selectDateTypeIndex,
            selectedSegmentedIndex,
            allDevices,
        } = this.state;
        return (
            <WKGeneralBackground>
                <View style={{height: 10}}/>
                <AlarmTabBar
                    ref={ref => this.tabBarRef = ref}
                    tabs={[{title: ''}, {title: ''}, {title: ''}]}
                    hideSlider={true}
                    onTabChange={this._onTabChange}
                >
                    <EnergyTimeView params={this.state.params}/>
                    <PowerTimeView params={this.state.params} devices={allDevices}/>
                </AlarmTabBar>
                <View style={{position: 'absolute', width: __SCREEN_WIDTH__}}>
                    <SegmentedControlTab
                        tabsContainerStyle={{marginLeft: 5, marginRight: 5, marginTop: 10}}
                        borderRadius={3}
                        tabTextStyle={{color: Colors.white, fontSize: 12}}
                        tabStyle={{
                            backgroundColor: Colors.theme,
                            height: 40,
                            borderWidth: 1,
                            borderColor: Colors.buttonBgColor
                        }}
                        activeTabStyle={{backgroundColor: Colors.buttonBgColor}}
                        values={[WK_T(wkLanguageKeys.energy_over_time), WK_T(wkLanguageKeys.power_over_time)]}
                        selectedIndex={selectedSegmentedIndex}
                        onTabPress={this._handleSegmentedIndexChange}
                    />
                    <EnergyDateBar
                        allDevices={allDevices}
                        selectedDevices={this.state.selectedDevices}
                        stationOrDevice={this.state.stationOrDevice}
                        deviceBindTime={this.state.deviceBindTime}
                        startDate={startDate}
                        endDate={endDate}
                        dateType={selectDateTypeIndex}
                        leftArrowClick={this._leftArrowClick}
                        leftArrowDisabled={selectDateTypeIndex === DATE_TYPE.DATE_RANGE}
                        dateClick={this._dateClick}
                        rightArrowClick={this._rightArrowClick}
                        rightArrowDisabled={selectDateTypeIndex === DATE_TYPE.DATE_RANGE}
                        selectDevice={this._selectDevice}
                        getMarginTop={(top) => {
                            this.setState({
                                deviceSelectMarginTop: top
                            });
                        }}
                    />
                    {this.state.allDevices.length > 0 &&
                    <WKDeviceSelect
                        visible={this.state.modalVisible}
                        onChangeDevice={this._onChangeDevice}
                        close={() => {
                            this.setState({
                                modalVisible: false
                            });
                        }}
                        dataSource={this.state.allDevices}
                        setPosition={{
                            top: this.state.deviceSelectMarginTop + (__isAndroid__ ? 30 : 0),
                            right: 10
                        }}
                    />}
                </View>
                <EnergyDateModal
                    visible={isDateModalVisible}
                    selectDateTypeIndex={selectDateTypeIndex}
                    selectDateCallback={this._selectDateCallBack}
                    onClose={() => this.setState({isDateModalVisible: false})}
                />
                <WKDatePicker
                    title={WK_T(wkLanguageKeys.date_range)}
                    visible={this.state.visible}
                    isSingle={false}
                    minDate={this.state.deviceBindTime}
                    pastScrollRange={0}
                    onClose={() => this.setState({visible: false})}
                    select={(res) => {
                        this.setState({
                            visible: false,
                            selectDateTypeIndex: DATE_TYPE.DATE_RANGE,
                            startDate: res[0],
                            endDate: res[1]
                        });
                        this._setParams(DATE_TYPE.DATE_RANGE, res[0], res[1]);
                    }}
                />
            </WKGeneralBackground>
        );
    }
}
