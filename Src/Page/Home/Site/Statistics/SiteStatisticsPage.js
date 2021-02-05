import React, {Component} from 'react';
import {View, ScrollView, ActivityIndicator} from 'react-native';
import WKGeneralBackground from "../../../../Common/Components/WKGeneralBackground";
import StatisticsDateBar from "./Components/StatisticsDateBar";
import {addDay, addMonth, addYear, subtractDay, subtractMonth, subtractYear, today} from "../../../../Utils/WKTime";
import EnergyDateModal from "../../../Energy/Components/EnergyDateModal";
import WKDatePicker from "./WKDatePicker/WKDatePicker";
import {WKEchart} from '@shufengdong/wanke-echarts';
import moment from 'moment';
import EnergyStatisticsBottomView from "./Components/EnergyStatisticsBottomView";
import ElectricityFeeProfitBottomView from "./Components/ElectricityFeeProfitBottomView";
import ElectricityFeeProfitTopView from "./Components/ElectricityFeeProfitTopView";
import TitleView from "./Components/TitleView";
import {tooltipStyles, yAxisSplitLine} from "./styles";
import {electricityFeeMockData, energyStatisticsMockData} from "./Mock";
import WKAdvance from "../../../../Utils/WKAdvance";
import WKFetch from "../../../../Network/WKFetch";
import PropTypes from "prop-types";

const DATE_TYPE = {
    DAY: 0,
    MONTH: 1,
    YEAR: 2,
    LIFE_TIME: 3,
};

const DATE_TITLE = {
    YEAR: 'Select Year',
    MONTH: 'Select Month',
    DAY: 'Select Date',
};

const DATE_MODE = {
    YEAR: 'year',
    MONTH: 'month',
    DAY: 'date',
};

const dateTitles = ['DAY', 'MONTH', 'YEAR', 'LIFETIME'];

class SiteStatisticsPage extends Component {

    state = {
        isDateModalVisible: false,
        selectedDateType: DATE_TYPE.DAY,
        modalIndex: DATE_TYPE.DAY,
        deviceBindTime: this.props.establishTime.substr(0, 10),
        selectedDate: today(),
        showElectricityMask: true,
        showProfitMask: true,
        electricityFee: '--',
        currency: '',
        profit: '--',
        generator: '--kWh',
        consumption: '--kWh',
        feedIn: '--kWh',
        electricityOption: null,
        profitOption: null,
    };

    count = 4;

    componentDidMount() {
        this._loadData();
    }

    _loadData = (selectedDate = today()) => {
        this.setState({
            selectedDate,
        }, () => {
            this._loadElectricity();
            this._loadProfit();
        });
    };

    _getRequestDate = () => {
        const {selectedDateType, selectedDate} = this.state;
        switch (selectedDateType) {
            case DATE_TYPE.DAY:
                return {
                    type: 'day',
                    date: selectedDate,
                };
            case DATE_TYPE.MONTH:
                return {
                    type: 'month',
                    date: selectedDate.substr(0, 7),
                };
            case DATE_TYPE.YEAR:
                return {
                    type: 'year',
                    date: selectedDate.substr(0, 4),
                };
            case DATE_TYPE.LIFE_TIME:
                return {
                    type: 'lifeTime',
                };
        }
    };

    _getRequestParams = () => {
        const {stationId} = this.props;
        const {type, date} = this._getRequestDate();
        const params = {
            stationId,
            timeType: type,
        };
        if (date) {
            params.dateTime = date;
        }
        return params;
    };

    _hideElectricityMask = () => {
        this.electricityTimer && clearTimeout(this.electricityTimer);
        this.electricityTimer = setTimeout(() => {
            this.electricityTimer && clearTimeout(this.electricityTimer);
            this.setState({
                showElectricityMask: false,
            });
            this.count = 2;
        }, this.count * 300);
    };

    _loadElectricity = () => {
        WKLoading.show();
        const params = this._getRequestParams();
        WKFetch('/statistics/electricity', params).then(ret => {
            WKLoading.hide();
            const {result, ok, errorMsg, errorCode} = ret;
            if (!ok) {
                WKToast.show(errorMsg);
                this.setState({
                    generator: '--kWh',
                    consumption: '--kWh',
                    feedIn: '--kWh',
                    electricityOption: null,
                    showElectricityMask: true,
                }, () => this._hideElectricityMask());
                return;
            }
            const {
                xData,
                yData,
                generator,
                consumption,
                feedIn,
            } = result;
            this.setState({
                generator,
                consumption,
                feedIn,
                showElectricityMask: true,
                electricityOption: {
                    xData,
                    yData,
                    lineChartOption: {
                        series: [{
                            type: 'bar',
                            name: 'Generation',
                            unit: 'kWh',
                            color: '#00a6ff', // 可选，默认是主题色蓝色
                            step: 'start',// 可选，如果想要阶梯状的折线图就传这个属性
                        }, {
                            type: 'bar',
                            name: 'Consumption',
                            unit: 'kWh',
                            color: '#f59a23', // 可选，默认是主题色蓝色
                            step: 'start',// 可选，如果想要阶梯状的折线图就传这个属性
                        }, {
                            type: 'bar',
                            name: 'Feed-in',
                            unit: 'kWh',
                            color: '#d9001b', // 可选，默认是主题色蓝色
                            step: 'start',// 可选，如果想要阶梯状的折线图就传这个属性
                        }],
                    },
                }
            }, () => this._hideElectricityMask());
        });
    };

    _hideProfitMask = () => {
        this.profitTimer && clearTimeout(this.profitTimer);
        this.profitTimer = setTimeout(() => {
            this.profitTimer && clearTimeout(this.profitTimer);
            this.setState({
                showProfitMask: false,
            });
        }, this.count * 300);
    };

    _loadProfit = () => {
        WKLoading.show();
        const params = this._getRequestParams();
        WKFetch('/statistics/profit', params).then(ret => {
            WKLoading.hide();
            const {result, ok, errorMsg, errorCode} = ret;
            if (!ok) {
                WKToast.show(errorMsg);
                this.setState({
                    electricityFee: '--',
                    profit: '--',
                    currency: '',
                    profitOption: null,
                    showProfitMask: true,
                }, () => this._hideProfitMask());
                return;
            }
            const {
                xData,
                yData,
                electricityFee,
                profit,
                currency
            } = result;

            // Fix bug: subArr's length must be equal to xData.length. Otherwise tooltip time won't show any more.
            yData.forEach(itemArr => {
                const length = itemArr.length;
                for (let i = 0; i < xData.length - length; i++) {
                    itemArr.push('-');
                }
            });

            this.setState({
                showProfitMask: true,
                currency,
                electricityFee: `${electricityFee}${currency}`,
                profit: `${profit}${currency}`,
                profitOption: {
                    xData,
                    yData: yData.reverse(),
                    backgroundColor: Colors.theme,
                    lineChartOption: {
                        series: [{
                            type: 'bar',
                            name: 'Electricity Fee',
                            unit: currency,
                            color: '#00a6ff',
                        }, {
                            type: 'bar',
                            name: 'Profit',
                            unit: currency,
                            color: '#70b603',
                        }],
                    },
                }
            }, () => this._hideProfitMask());
        });
    };

    // Select date
    _dateClick = () => {
        this.setState({
            isDateModalVisible: true,
        });
    };

    // Select date call back
    _selectDateCallBack = index => {
        if (index === DATE_TYPE.LIFE_TIME) {
            this.setState({
                selectedDateType: index,
                modalIndex: index,
                isDateModalVisible: false,
            }, () => {
                this._loadElectricity();
                this._loadProfit();
            });
            return;
        }
        this.setState({
            modalIndex: index,
            isDateModalVisible: false,
        }, () => {
            this.popDatePicker.setModalVisible(true);
        });
    };

    _arrowClick = index => {
        const {
            selectedDateType,
            selectedDate,
        } = this.state;
        // 0 means left arrow is clicked. 1 means right arrow is clicked.
        const isLeftClicked = index === 0;
        switch (selectedDateType) {
            case DATE_TYPE.DAY:
                const day = isLeftClicked ? subtractDay(selectedDate) : addDay(selectedDate);
                this._loadData(day);
                break;
            case DATE_TYPE.MONTH:
                const month = isLeftClicked ? subtractMonth(selectedDate) : addMonth(selectedDate);
                this._loadData(month);
                break;
            case DATE_TYPE.YEAR:
                const year = isLeftClicked ? subtractYear(selectedDate) : addYear(selectedDate);
                this._loadData(year);
                break;
            case DATE_TYPE.LIFE_TIME:
                // Nothing to do.
                break;
        }
    };

    // Date title on DatePicker header
    _dateTitle = () => {
        const {modalIndex} = this.state;
        switch (modalIndex) {
            case DATE_TYPE.DAY:
                return DATE_TITLE.DAY;
            case DATE_TYPE.MONTH:
                return DATE_TITLE.MONTH;
            case DATE_TYPE.YEAR:
                return DATE_TITLE.YEAR;
            default:
                return DATE_TITLE.DAY;
        }
    };

    // Date mode to select
    _dateMode = () => {
        const {modalIndex} = this.state;
        switch (modalIndex) {
            case DATE_TYPE.DAY:
                return DATE_MODE.DAY;
            case DATE_TYPE.MONTH:
                return DATE_MODE.MONTH;
            case DATE_TYPE.YEAR:
                return DATE_MODE.YEAR;
            default:
                return DATE_MODE.DAY;
        }
    };

    render() {
        const {
            selectedDate,
            selectedDateType,
            isDateModalVisible,
            currency
        } = this.state;
        return (
            <WKGeneralBackground showSunshine={false}>
                <StatisticsDateBar
                    deviceBindTime={this.state.deviceBindTime}
                    selectedDate={selectedDate}
                    dateType={selectedDateType}
                    arrowClick={this._arrowClick}
                    dateClick={this._dateClick}
                />
                <EnergyDateModal
                    dateTitles={dateTitles}
                    visible={isDateModalVisible}
                    selectDateTypeIndex={selectedDateType}
                    selectDateCallback={this._selectDateCallBack}
                    onClose={() => this.setState({isDateModalVisible: false})}
                />
                <WKDatePicker
                    ref={ref => this.popDatePicker = ref}
                    title={this._dateTitle()}
                    mode={this._dateMode()}
                    minDate={new Date(this.state.deviceBindTime)}
                    onOk={date => {
                        this.setState({
                            selectedDate: date,
                            selectedDateType: this.state.modalIndex,
                        }, () => {
                            this._loadElectricity();
                            this._loadProfit();
                        });
                    }}
                />
                <ScrollView>
                    <TitleView title={'Energy Statistics'}/>
                    <View>
                        <WKEchart
                            yAxisUnit={'kWh'}
                            option={this.state.electricityOption} // energyStatisticsMockData
                            yAxisSplitLine={yAxisSplitLine}
                            bgColor={Colors.theme}
                            height={280}
                            tooltipStyles={tooltipStyles}
                            xAxisLineColor={'#676767'}
                            yAxisLineColor={'#676767'}
                        />
                        {
                            this.state.showElectricityMask && <View style={{
                                position: 'absolute',
                                width: SCREEN_WIDTH,
                                height: 280,
                                backgroundColor: Colors.theme,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            >
                                <ActivityIndicator/>
                            </View>

                        }
                    </View>
                    <EnergyStatisticsBottomView
                        data={[
                            this.state.generator,
                            this.state.consumption,
                            this.state.feedIn,
                        ]}
                    />
                    <View>
                        <TitleView title={'Electricity Fee & Profit'}/>
                        <ElectricityFeeProfitTopView/>
                        <View>
                            <WKEchart
                                yAxisUnit={currency}
                                option={this.state.profitOption} // electricityFeeMockData
                                yAxisSplitLine={yAxisSplitLine}
                                bgColor={Colors.theme}
                                height={280}
                                tooltipStyles={tooltipStyles}
                                xAxisLineColor={'#676767'}
                                yAxisLineColor={'#676767'}
                            />
                            {
                                this.state.showProfitMask && <View style={{
                                    position: 'absolute',
                                    width: SCREEN_WIDTH,
                                    height: 280,
                                    backgroundColor: Colors.theme,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                >
                                    <ActivityIndicator/>
                                </View>
                            }
                        </View>
                        <ElectricityFeeProfitBottomView data={[
                            this.state.electricityFee,
                            this.state.profit,
                        ]}/>
                    </View>
                    <View style={{height: 40}}/>
                </ScrollView>
            </WKGeneralBackground>
        );
    }
}

SiteStatisticsPage.propTypes = {
    stationId: PropTypes.number.isRequired,
    establishTime: PropTypes.string.isRequired,
};

export default SiteStatisticsPage;