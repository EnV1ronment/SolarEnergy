import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ScrollView
} from 'react-native';

import Chart from "native-echarts";

export default class PieEcharts extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    componentDidMount() {
        let option = this.setOption(this.props.dataSource);
        this.setState({option:option})
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.dataSource) {
           let option = this.setOption(nextProps.dataSource);
           this.setState({option:option})
        }
    }
    setOption = (dataSource) =>{
        let color = ["#00a6ff", "#2cef2e", "#fb603f"];
        let hasData = false;
        let data = dataSource.map((item, index) => {
            let value = 0;
            if (item.val !== '— —'&&item.val !== '--') {
                hasData = true;
                value = item.val;
            }else{
                value = 0;
            }
            return {
                value: value, name: item.name, itemStyle: {
                    normal: {
                        shadowColor: color[index],
                        shadowBlur: 20,
                        shadowOffset: 10
                    }
                }
            }
        });
        if (hasData) {
            return {
                    legend: {show: false},
                    color: color,
                    series: [
                        {
                            type: 'pie',
                            radius: ['63%', '70%'],
                            roseType: 'radius',
                            hoverAnimation: false,
                            legendHoverLink: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center',
                                    textStyle: {
                                        fontSize: '30',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            data: data
                        }
                    ]
                }
        } else {
            return this.init();
        }
    }
    init = () => {
        return {
                    legend: {show: false},
                    color: ["rgb(8,22,67)"],
                    series: [
                        {
                            type: 'pie',
                            radius: ['63%', '70%'],
                            roseType: 'radius',
                            hoverAnimation: false,
                            legendHoverLink: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center',
                                    textStyle: {
                                        fontSize: '30',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            data: [{
                                value: 1, name: 'home', itemStyle: {
                                    normal: {
                                        shadowColor: "#00a6ff",
                                        shadowBlur: 20,
                                        shadowOffset: 10
                                    }
                                }
                            }]
                        }
                    ]
            }
    };
    getEchart = (option) => {
        return option && (<Chart
            width={2 * __SCREEN_WIDTH__ / 3}
            height={2 * __SCREEN_WIDTH__ / 3}
            option={option}
        />)
    };
    render() {
        let {option} = this.state;
        const chart = this.getEchart(option);
        return (
            <View style={{width: __SCREEN_WIDTH__, height: 2 * __SCREEN_WIDTH__ / 3,position:'absolute'}}>
                {chart}
            </View>
        );
    }

}
