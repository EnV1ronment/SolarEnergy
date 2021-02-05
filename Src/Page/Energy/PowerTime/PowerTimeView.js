import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import EnergyBackground from "../Components/EnergyBackground";
import EnergyTabTypeText from "../Components/EnergyTabTypeText";
import Chart from "native-echarts";
import WKFetch from "../../../Network/WKFetch";
import PropTypes from 'prop-types';
import PowerTimeViewEchartLegend from "./PowerTimeViewEchartLegend";

export default class PowerTimeView extends Component {

    static propTypes = {
        params: PropTypes.object.isRequired,
        devices: PropTypes.array.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            option: this._getOption({}, props.params),
            visible: true,
            selectedDevices: [],
        };
        this.firstLoaded = true;
    }

    componentDidMount() {
        this._loadData();
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.params !== this.props.params
            && JSON.stringify(nextProps.params) !== JSON.stringify(this.props.params)
        ) {
            this.state.visible = true;
            this._loadData(nextProps.params);
        }
        return true;
    }

    _loadData = (params) => {
        const requestParams = params || this.props.params;
        WKLoading.show();
        WKFetch('/energy/power/history', requestParams).then(ret => {
            const {
                ok,
                data,
                errorMsg
            } = ret;
            if (!ok) {
                this.setState({
                    option: this._getOption({}, requestParams)
                });
                this._hideMask(errorMsg);
                return;
            }
            if (data && typeof data === 'object' && Object.keys(data).length) {
                this.setState({
                    option: this._getOption(data.results, requestParams)
                });
                this._hideMask();
            } else {
                this.setState({
                    option: this._getOption({}, requestParams)
                });
                this._hideMask();
            }
        });
    };

    _hideMask = (errorMsg) => {
        const timeout = this.firstLoaded ? 1500 : 600;
        this.firstLoaded = false;
        this.timer = setTimeout(() => {
            this.timer && clearTimeout(this.timer);
            this.setState({
                visible: false
            });
            WKLoading.hide();
            WKToast.show(errorMsg);
        }, timeout);
    };

    _getOption = (data = {}, requestParams) => {

        const {devCode, stationId} = requestParams;
        const {devices} = this.props;
        const selectedDevices = PowerTimeViewEchartLegend(devCode, stationId, devices);

        let xData = [WK_T(wkLanguageKeys.no_data)];
        let yData = [[], []]; // [[Solar], [Consumption]...]  ZhenHan said on Aug 22, 2019
        let showToolTip = false;

        if (data
            && typeof data === 'object'
            && data.xData
            && Array.isArray(data.xData)
            && data.xData.length
            && data.yData
            && Array.isArray(data.yData)
            && data.yData.length
            && data.yData.some(subArr => subArr.length > 0)
        ) {
            xData = data.xData;
            yData = data.yData;
            showToolTip = true;
        }

        const series = yData.map((itemArr, index) => ({
            name: index % 2 ? WK_T(wkLanguageKeys.consumption_for_energy_page) : WK_T(wkLanguageKeys.solar_for_energy_page), // selectedDevices.length ? selectedDevices[index] : (index % 2 ? 'Solar1' : 'Consumption1'),
            type: 'line',
            smooth: true,
            showSymbol: false,
            lineStyle: {
                normal: {
                    shadowColor: ['#00a6ff', "#22ce39"][index], // powerConstants.shadowColors[index],
                    shadowBlur: 30
                }
            },
            data: itemArr,
        }));

        if (this.state && this.state.selectedDevices) {
            this.state.selectedDevices = showToolTip && yData.length > 2 ? selectedDevices : [];
        }

        return {
            color: ['#00a6ff', "#22ce39"],// powerConstants.lineColors,
            // legend: {
            //     show: showToolTip && yData.length > 2,
            //     inactiveColor: Colors.placeholder,
            //     textStyle: {
            //         color: Colors.buttonBgColor,
            //     },
            //     type: 'scroll',
            //     icon: 'circle',
            //     itemWidth: 10,
            //     itemHeight: 10,
            //     top: 'bottom',
            //     data: selectedDevices
            // },
            dataZoom: [{
                type: 'inside',
                throttle: 50,
                minValueSpan: 20,
            }],
            tooltip: {
                trigger: 'axis',
                backgroundColor: Colors.theme,
                borderWidth: 1,
                borderColor: Colors.buttonBgColor,
                confine: true,
                padding: 6,
                textStyle: {
                    color: Colors.buttonBgColor,
                    fontSize: 12
                },
                formatter: this._getTooltipFormatter(),
                show: showToolTip,
                position: function (point, params, dom) {
                    const posDisX = window.innerWidth - dom.offsetWidth;
                    const posDisY = 250 - dom.offsetHeight;
                    if (posDisX < point[0]) {
                        if (posDisY < point[1]) {
                            // Bottom-right
                            return [posDisX - 10, '25%'];
                        }
                        // Top-right
                        return [posDisX - 15, '40%'];
                    } else {
                        // Bottom-left
                        if (posDisY < point[1]) {
                            return [point[0] - 10, '30%'];
                        }
                        // Top-left
                        if (point[0] > window.innerWidth / 3.0) {
                            return ['20%', '50%'];
                        }
                        return [point[0] - 30, '50%'];
                    }
                },
                axisPointer: {
                    lineStyle: {
                        color: '#293f82', // Set indicator color when clicking tooltip
                        width: 1 // Set indicator width
                    }
                },
            },
            grid: {
                top: '9%',
                left: '9%',
                right: '3%',
                // bottom: '6%',
            },
            xAxis: [
                {
                    axisLine: {
                        show: true,
                        lineStyle: {
                            width: 0.5,
                            color: Colors.placeholder
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: Colors.placeholder,  // x轴单位颜色
                            fontSize: 9        // x轴单位字体大小
                        },
                        formatter: '{value}'  // x轴模板
                    },
                    type: 'category',
                    boundaryGap: true, // 必须得设置为true，否则当第一天有数据时，柱状图会偏移到坐标系外面
                    data: xData,
                    axisPointer: {
                        snap: true
                    },
                    axisTick: {
                        show: false // 隐藏X轴数值的分割线
                    },
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: 'kW',
                    position: 'left',
                    axisPointer: {
                        snap: true
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            width: 0.5,
                            color: Colors.placeholder
                        }
                    },
                    axisTick: {
                        show: false // 隐藏y轴数值的分割线
                    },
                    splitLine: {
                        show: true,// 是否显示y轴分割线(区域内的分割线，跟X轴平行）
                        lineStyle: {
                            width: 0.3,
                            color: Colors.placeholder
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: Colors.placeholder, // y轴值的颜色
                            fontSize: 9       // y轴值的字体大小
                        },
                        formatter: '{value}'// y轴模板
                    },
                    nameTextStyle: {
                        color: Colors.placeholder, // y轴单位颜色
                        fontSize: 9      // y轴单位字体大小
                    },
                    nameGap: 10 // y轴单位距离y轴顶部距离
                }
            ],
            series: series,
        }
    };

    _getTooltipFormatter = () => {
        return function (params) {
            const xAxisValue = params[0].name;
            let htmlStr = '<div>' + xAxisValue + '<br/>';
            for (let i = 0, l = params.length; i < l; i++) {
                htmlStr += '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' + params[i].color + ';"></span>';
                const value = params[i].data !== undefined && params[i].data !== null && params[i].data !== '' ? params[i].data : '-';
                htmlStr += params[i].seriesName + ':' + value + 'kW' + '<br/>';
            }
            htmlStr += '</div>';
            return htmlStr;
        };
    };

    render() {

        return (<EnergyBackground>
            {/*<ScrollView showsVerticalScrollIndicator={false}>*/}
                <EnergyTabTypeText/>
                <Chart
                    width={__SCREEN_WIDTH__}
                    height={adaptHeight(360)}
                    option={this.state.option}
                />
                {/*<View style={styles.container}>*/}
                    {/*{*/}
                        {/*this.state.selectedDevices.length > 2 && this.state.selectedDevices.map((deviceName, index) => (*/}
                            {/*index % 2 === 0 &&*/}
                            {/*<View style={styles.deviceView}>*/}
                                {/*<View style={[styles.deviceDot, {*/}
                                    {/*backgroundColor: powerConstants.shadowColors[index],*/}
                                    {/*shadowColor: powerConstants.shadowColors[index],*/}
                                {/*}]}/>*/}
                                {/*<Text style={[styles.deviceName,*/}
                                    {/*{color: powerConstants.shadowColors[index]}*/}
                                {/*]}>{deviceName.trim()}</Text>*/}
                            {/*</View>))*/}
                    {/*}*/}
                {/*</View>*/}
                {this.state.visible && <View style={{
                    marginTop: 40,
                    position: 'absolute',
                    width: __SCREEN_WIDTH__,
                    height: __SCREEN_HEIGHT__,
                    backgroundColor: Colors.theme
                }}/>}
                <View style={{height: this.state.selectedDevices.length > 2 ? 50 : 100}}/>
            {/*</ScrollView>*/}
        </EnergyBackground>);
    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        margin: 15,
        marginLeft: 16,
    },
    deviceView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        marginLeft: 8,
    },
    deviceDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        shadowOpacity: 0.8,
        shadowOffset: {height: 1},
    },
    deviceName: {
        marginLeft: 6,
        fontSize: 13,
    },
});
