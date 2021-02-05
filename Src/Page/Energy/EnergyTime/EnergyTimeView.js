import React, {Component} from 'react';
import {View} from 'react-native';
import EnergyBackground from "../Components/EnergyBackground";
import EnergyTabTypeText from "../Components/EnergyTabTypeText";
import Chart from "native-echarts";
import WKFetch from "../../../Network/WKFetch";
import PropTypes from 'prop-types';

export default class EnergyTimeView extends Component {

    static propTypes = {
        params: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            option: this._getOption(),
            visible: true,
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
        const data = params || this.props.params;
        WKLoading.show();
        WKFetch('/energy/history', data).then(ret => {
            const {
                ok,
                data,
                errorMsg
            } = ret;
            if (!ok) {
                this.setState({
                    option: this._getOption(),
                });
                this._hideMask(errorMsg);
                return;
            }
            if (data && typeof data === 'object' && Object.keys(data).length) {
                this.setState({
                    option: this._getOption(data.results),
                });
                this._hideMask();
            } else {
                this.setState({
                    option: this._getOption(),
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

    _getOption = (data = {}) => {

        let xData = [WK_T(wkLanguageKeys.no_data)];
        let yData = [[], []];
        let showToolTip = false;

        if (data
            && typeof data === 'object'
            && data.xData
            && Array.isArray(data.xData)
            && data.xData.length
            && data.yData
            && Array.isArray(data.yData)
            && data.yData.length === 2
            && data.yData.some(subArr => subArr.length > 0)
            && Array.isArray(data.yData[0])
            && Array.isArray(data.yData[1])
            && data.xData.length === data.yData[0].length
            && data.xData.length === data.yData[1].length
        ) {
            xData = data.xData;
            yData = data.yData;
            showToolTip = true;
        }

        return {
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
            dataZoom: [{
                type: 'inside',
                throttle: 50,
            }],
            grid: {
                top: '8%',
                left: '9%',
                right: '3%'
            },
            barMaxWidth: 50,
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
                    name: 'kWh',
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
            series: [
                {
                    name: WK_T(wkLanguageKeys.solar_for_energy_page),
                    type: 'bar',
                    showSymbol: false,
                    itemStyle: {
                        normal: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    {offset: 0, color: '#00a6ff'},
                                    {offset: 1, color: '#0b2d47'}
                                ],
                                global: false // 缺省为 false
                            },
                            shadowColor: "#00a6ff",
                            shadowBlur: 3,
                            shadowOffsetY: -2,
                        },
                    },
                    data: yData[0]
                },
                {
                    name: WK_T(wkLanguageKeys.consumption_for_energy_page),
                    type: 'bar',
                    showSymbol: false,
                    itemStyle: {
                        normal: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    {offset: 0, color: '#22ce39'},
                                    {offset: 1, color: '#072758'}
                                ],
                                global: false // 缺省为 false
                            },
                            shadowColor: "#22ce39",
                            shadowBlur: 3,
                            shadowOffsetY: -2,
                        },
                    },
                    data: yData[1]
                }
            ]
        }
    };

    _getTooltipFormatter = () => {
        return function (params) {
            let htmlStr = '<div>' + params[0].name + '<br/>';
            for (let i = 0, l = params.length; i < l; i++) {
                htmlStr += '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' + params[i].color.colorStops[0].color + ';"></span>';
                const value = params[i].data !== undefined && params[i].data !== null && params[i].data !== '' ? params[i].data : '-';
                htmlStr += params[i].seriesName + ':' + value + 'kWh' + '<br/>';
            }
            htmlStr += '</div>';
            return htmlStr;
        }
    };

    render() {
        return (
            <EnergyBackground>
                <EnergyTabTypeText/>
                <Chart option={this.state.option} width={__SCREEN_WIDTH__} height={adaptHeight(360)}/>
                {this.state.visible && <View style={{top: 35, position: 'absolute', width: __SCREEN_WIDTH__, height: __SCREEN_HEIGHT__, backgroundColor: Colors.theme}}/>}
            </EnergyBackground>
        );
    }

}
