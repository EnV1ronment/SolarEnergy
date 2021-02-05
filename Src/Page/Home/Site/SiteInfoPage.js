import React, {Component} from 'react';
import {View, TouchableOpacity} from 'react-native';

import WKGeneralBackground from "../../../Common/Components/WKGeneralBackground";
import WKNavigationBarLeftItem from "../../../Common/Components/WKNavigationBarLeftItem";
import WKNavigationBarRightItem from "../../../Common/Components/WKNavigationBarRightItem";
import SegmentedControlTab from "react-native-segmented-control-tab";
import AlarmTabBar from "../../Alarm/Components/AlarmTabBar";
import SiteStatusPage from "./Status/SiteStatusPage";
import SiteStatisticsPage from "./Statistics/SiteStatisticsPage";
import settingIcon from "../../../Source/Me/me_setting_icon.png";
import styles from './Style';

// Constants
const Constants = {
    siteNameKey: 'name',
    status: 'Status',
    statistics: 'Statistics',
};

export default class SiteInfoPage extends Component {

    static navigationOptions = ({navigation}) => {
        return {
            title: navigation.getParam(Constants.siteNameKey),
            headerRight: <WKNavigationBarRightItem
                value={settingIcon}
                click={navigation.getParam('done')}
            />
        };
    }

    state = {
        selectedSegmentedIndex: 0,
        enabled: false,
    };
    componentDidMount() {
        const {navigation} = this.props;
        navigation.setParams({done: this._goSetting});
    }
    // ok
    _handleSegmentedIndexChange = index => {
        if (this.state.enabled) return;
        this.setState({
            enabled: true,
            selectedSegmentedIndex: index,
        });
        this.tabBarRef._goToTab(index);
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.timer && clearTimeout(this.timer);
            this.setState({
                enabled: false,
            });
        }, 400);
    };
    _goSetting = () => {
        const {navigation} = this.props;
        navigation.navigate(RouteKeys.CustomizePage, {});
    };
    render() {
        const {selectedSegmentedIndex} = this.state;
        const {navigation} = this.props;
        const stationId = navigation.getParam('id');
        const establishTime = navigation.getParam('establishTime', '2020-03-01');
        return (
            <WKGeneralBackground showSetting={true} goSetting={this._goSetting}>
                <View style={styles.topPlaceholderView}/>
                <AlarmTabBar
                    ref={ref => this.tabBarRef = ref}
                    tabs={[{title: ''}, {title: ''}]}
                    hideSlider={true}
                >
                    <SiteStatusPage stationId={stationId}/>
                    <SiteStatisticsPage
                        stationId={stationId}
                        establishTime={establishTime}
                    />
                </AlarmTabBar>
                <View style={styles.segmentContainer}>
                    <SegmentedControlTab
                        tabsContainerStyle={styles.tabsContainerStyle}
                        borderRadius={3}
                        tabTextStyle={styles.tabTextStyle}
                        tabStyle={styles.tabStyle}
                        activeTabStyle={{backgroundColor: Colors.buttonBgColor}}
                        values={[Constants.status, Constants.statistics]}
                        selectedIndex={selectedSegmentedIndex}
                        onTabPress={this._handleSegmentedIndexChange}
                    />
                    {this.state.enabled && <TouchableOpacity
                        activeOpacity={1}
                        style={styles.placeholderButton}
                    />}
                </View>
            </WKGeneralBackground>
        );
    }
}
