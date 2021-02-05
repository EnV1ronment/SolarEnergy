import React, {Component} from 'react';
import {
    View,
    ScrollView,
} from 'react-native';
import EnergyBackground from "../Components/EnergyBackground";
import EnergyTabTypeText from "../Components/EnergyTabTypeText";
import Chart from "native-echarts";
import WKFetch from "../../../Network/WKFetch";
import PropTypes from 'prop-types';

export default class EnergyBillView extends Component {

    static propTypes = {
        params: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            option: this._getOption()
        };
    }

    componentDidMount() {
        this._loadData();
        this.timer = setTimeout(() => {
            this.timer && clearTimeout(this.timer);
            this.scrollViewRef && this.scrollViewRef.scrollTo({x: (__SCREEN_WIDTH__ - 50) / 2, y: 0, animated: false})
        }, 50);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.params !== this.props.params
            && JSON.stringify(nextProps.params) !== JSON.stringify(this.props.params)
        ) {
            this._loadData(nextProps.params);
        }
        return true;
    }

    _loadData = (params) => {
        const data = params || this.props.params;
        WKLoading.show();
        WKFetch('/energy/bill', data).then(ret => {
            WKLoading.hide();
            const {
                ok,
                data,
                errorMsg
            } = ret;
            if (!ok) {
                WKToast.show(errorMsg);
                this.setState({
                    option: this._getOption()
                });
                return;
            }
            if (data && typeof data === 'object' && Object.keys(data).length) {
                this.setState({
                    option: this._getOption(data.results)
                });
            } else {
                this.setState({
                    option: this._getOption()
                });
            }
        });
    };

    _getOption = (data = {}) => {
        const colors = [
            "#00a6ff",
            "#faa058",
            '#dbdbe3',
            '#22ce3a',
            "#ff5a60"
        ];
        const names = [
            WK_T(wkLanguageKeys.home),
            WK_T(wkLanguageKeys.battery),
            'On-grid',
            ` ${WK_T(wkLanguageKeys.battery)}`,
            ` ${WK_T(wkLanguageKeys.home)}`
        ];

        const isEmpty = Object.keys(data).length === 0;

        let values = [0, 0, 0, 0, 0];
        if (!isEmpty) {
            const {gridTo, solarTo} = data;
            values = [
                gridTo.battery,
                gridTo.consumption,
                solarTo.grid,
                solarTo.battery,
                solarTo.consumption
            ];
        }

        const innerPieData = [
            {
                value: isEmpty ? 0 : data['from'].grid,
                name: 'Grid',
                selected: true
            },
            {
                value: isEmpty ? 0 : data['from'].solar,
                name: 'Solar'
            }
        ];

        // Only Solar, no grid
        if (data['from'] && !data['from'].grid && data['from'].solar) {
            colors.splice(0, 2);
            names.splice(0, 2);
            values.splice(0, 2);
            innerPieData.splice(0, 1);
        }

        // Only Grid, no solar
        if (data['from'] && data['from'].grid && !data['from'].solar) {
            colors.splice(2);
            names.splice(2);
            values.splice(2);
            innerPieData.splice(1);
        }

        const outerPieData = [];
        colors.forEach((color, index) => {
            outerPieData.push({
                value: values[index],
                name: names[index],
                itemStyle: this._getItemStyle(color),
                labelLine: this._getLabelLine(color)
            });
        });

        return {
            tooltip: {
                trigger: 'item',
                alwaysShowContent: true, // Always show tooltip.
                backgroundColor: Colors.theme,
                borderWidth: 1,
                borderColor: Colors.buttonBgColor,
                padding: 6,
                textStyle: {
                    color: Colors.buttonBgColor
                },
                formatter: `{a} <br/>{b}: {c}kWh ({d}%)`
            },
            series: [
                {
                    name: WK_T(wkLanguageKeys.resource),
                    type: 'pie',
                    center: ['43%', '50%'],
                    radius: [0, '27%'],
                    color: ['#fff'],
                    label: {
                        normal: {
                            position: innerPieData.length === 1 ? 'center' : 'inside',
                            textStyle: {
                                color: '#00a6ff',
                                fontSize: 15,
                                fontStyle: 'bold'
                            }
                        }
                    },
                    selectedOffset: 3, // Inter circle's separator line distance
                    data: innerPieData
                },
                {
                    name: WK_T(wkLanguageKeys.destination),
                    type: 'pie',
                    center: ['43%', '50%'],
                    radius: ['27%', '50%'],
                    roseType: true,
                    color: colors,
                    avoidLabelOverlap: true, // Whether to avoid label to overlap.
                    label: { // Label on pie
                        normal: {
                            show: true, // Whether to show label
                            formatter: isChinese() ? function (params) {
                                return '去向' + '\nn' + params.name + ':' + params.value + 'kWh' + '(' + params.percent + '%' + ')'
                            } : function (params) {
                                return 'Destination' + '\nn' + params.name + ':' + params.value + 'kWh' + '(' + params.percent + '%' + ')'
                            },
                            textStyle: {
                                fontSize: 14
                            }
                        }
                    },
                    data: outerPieData
                }
            ]
        };
    };

    _getItemStyle = (color) => {
        return {
            normal: {
                shadowColor: color,
                shadowBlur: 50,
                shadowOffset: 5
            }
        };
    };

    _getLabelLine = (color) => {
        return {
            normal: {
                show: true,
                // length: 20,
                // length2: 12,
                lineStyle: {
                    color: color, // set label line color
                    // width: 1        // set label line width
                    // type: 'solid'   // 'dotted'  dashed  solid
                    shadowColor: color,
                    shadowBlur: 30,
                    shadowOffsetY: 10
                }
            }
        };
    };

    render() {
        return (
            <EnergyBackground>
                <ScrollView
                    ref={ref => this.scrollViewRef = ref}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                >
                    <View style={{width: __SCREEN_WIDTH__ * 2 - 100}}>
                        <Chart
                            width={__SCREEN_WIDTH__ * 2}
                            height={adaptHeight(360)}
                            option={this.state.option}
                        />
                    </View>
                </ScrollView>
            </EnergyBackground>
        );
    }

}
