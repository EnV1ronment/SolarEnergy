import React, {Component} from 'react';
import {FlatList, View, Text, StyleSheet, ImageBackground, Linking, RefreshControl} from "react-native";
import moment from 'moment';
import WKEmptyView from "../../Common/Components/WKEmptyView";

export default class TabPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            startDate: moment().format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD'),
            page: 0,
            refreshing: false
        };
    }

    componentDidMount() {
        this.setState({dataSource: this.props.dataSource});
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps && (nextProps.dataSource !== this.props.dataSource)) {
            this.setState({dataSource:
                nextProps.dataSource,
                refreshing: false,
            });
        }
    }

    _call = () => {
        const telLink = 'tel://15757175096';
        if (Linking.canOpenURL(telLink)) {
            Linking.openURL(telLink);
        }
    };

    // Call customer service
    _customerService = () => {
        return <Text
            style={styles.service}
            onPress={this._call}>
            customer service
        </Text>;
    };

    _renderItem = ({item}) => {

        let attribute = ['Site', 'Time', 'Description', 'Level', 'Status'];
        let type = ['stationTitle', 'startTime', 'records', 'alarmLevelName', 'abnormalStatusName'];
        console.warn(item)
        let _dom = type.map((v, i) => {
            let text;
            if (v !== "Slight" && v !== "Moderate" && v !== "Serious") {
                text = <Text multiline={true} style={{flex: 3, fontSize: 12, color: '#ffffff'}}>{item[v]}</Text>
            } else {
                if (v === 'Slight') {
                    text = <Text multiline={true} style={{flex: 3, fontSize: 13, color: '#ffffff'}}>
                        Please contact the {this._customerService()} for more support
                    </Text>
                } else {
                    text = <Text multiline={true} style={{flex: 3, fontSize: 13, color: '#ffffff'}}>
                        Please check section 2 of the
                        <Text style={{color: Colors.buttonBgColor, textDecorationLine: 'underline'}} onPress={() => {
                            console.warn('进入到操作手册页面，操作手册由产品提供');
                        }}> Operation Manual </Text>
                        for solution or contact the {this._customerService()} for more support
                    </Text>
                }
            }
            return <View key={i} style={{flex: 1, flexDirection: 'row', marginBottom: 5}}>
                <Text style={{flex: 1, fontSize: 12, color: '#5b6483'}}>{attribute[i]}:</Text>
                {text}
            </View>;
        });

        return (
            <ImageBackground style={{margin: 5, padding: 5}} resizeMode={'stretch'}
                             source={require('../../Source/Alarm/alarm_item.png')}>
                <View style={{padding: 7, marginRight: 5}}>
                    {_dom}
                </View>
            </ImageBackground>
        );
    };

    _formatDateString = date => date.split('-').reverse().join('/');

    // Render header date string
    _headerDate = () => {
        const {
            startDate,
            endDate,
        } = this.props;
        return <View>
            {startDate ? <Text style={styles.listHeaderText}>
                {this._formatDateString(startDate)}~{this._formatDateString(endDate)}
            </Text> : null}
        </View>;
    };

    // Render empty view without data
    _empty = () => <WKEmptyView
        emptyText={WK_T(wkLanguageKeys.no_data)}
        containerStyles={{backgroundColor: Colors.theme}}
        emptyTextStyles={{marginTop: 200}}
        showReloadButton={false}/>;

    render() {
        const {dataSource, refreshing} = this.state;
        const {refresh} = this.props;
        return (
            <View style={{flex: 1}}>
                <FlatList
                    style={{marginTop: 20}}
                    ref="flatList"
                    extraData={this.state}
                    keyExtractor={(item, index) => index.toString()}
                    data={dataSource}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => {
                                if (refreshing) return;
                                this.setState({
                                    refreshing: true,
                                });
                                refresh(false);
                            }}
                            tintColor="#cfcfcf"
                        />
                    }
                    refreshing={false}
                    renderItem={this._renderItem}
                    ListHeaderComponent={this._headerDate}
                    ListEmptyComponent={this._empty}
                />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    listHeaderText: {
        alignItems: 'center',
        textAlign: 'center',
        fontSize: 12,
        color: '#5b6483',
        marginBottom: 12
    },
    service: {
        color: Colors.buttonBgColor,
        textDecorationLine: 'underline',
    },
});
