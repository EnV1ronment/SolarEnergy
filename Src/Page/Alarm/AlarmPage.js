import React, {Component} from 'react';
import WKGeneralBackground from "../../Common/Components/WKGeneralBackground";
import TabPage from "./TabPage";
import alarm_time_pick from '../../Source/Alarm/alarm_time_pick.png';
import WKNavigationBarRightItem from "../../Common/Components/WKNavigationBarRightItem";
import WKDatePicker from "../../Common/Components/WKDatePicker";
import {today} from '../../Utils/WKTime';
import WKFetch from "../../Network/WKFetch";
import WKToast from "../../Common/Components/WKToast";
import {connect} from 'react-redux';
import mockData from "./Mock";

// Only used to debug
const useMockData = false;

class AlarmPage extends Component {

    state = {
        visible: false,
        alarmLevelCode: '4,3,2',
        startDate: today(),
        endDate: today(),
        historyDataSource: [],
        deviceBindTime: '2020-03-01',
    };

    static navigationOptions = ({navigation}) => {
        const hide = navigation.getParam('hideRightItem', false);
        return {
            title: WK_T(wkLanguageKeys.alarm),
            headerRight: !hide &&
                <WKNavigationBarRightItem value={alarm_time_pick} click={navigation.getParam('time_pick')}/>
        };
    };

    componentDidMount() {
        const {navigation} = this.props;
        navigation.setParams({time_pick: this.time_pick});
        this._loadData();
    }

    _loadData = (showLoading = true) => {

        const {
            startDate,
            endDate,
            alarmLevelCode,
        } = this.state;

        if (!alarmLevelCode) return;

        showLoading && WKLoading.show();
        WKFetch('/alarm/history', {
            startDate, endDate,
            alarmLevelId: alarmLevelCode,
        }).then(ret => {
            showLoading && WKLoading.hide();
            const {ok, errorMsg, data} = ret;
            const dataSource = useMockData ? mockData : data;
            const {results} = dataSource;
            if (ok && results) {
                this.setState({historyDataSource: results});
            } else {
                WKToast.show(errorMsg);
            }
        });
    };

    // Select date to show modal
    time_pick = () => this.setState({visible: true});

    render() {
        const {
            startDate,
            endDate,
            historyDataSource,
            deviceBindTime,
        } = this.state;
        return (
            <WKGeneralBackground>
                <TabPage
                    startDate={startDate}
                    endDate={endDate}
                    dataSource={historyDataSource}
                    refresh={this._loadData}
                />
                <WKDatePicker
                    title={WK_T(wkLanguageKeys.date_range)}
                    visible={this.state.visible}
                    minDate={deviceBindTime}
                    isSingle={false}
                    onClose={() => this.setState({visible: false})}
                    select={(res) => {
                        this.setState({
                            visible: false,
                            startDate: res[0],
                            endDate: res[1]
                        }, () => {
                            this._loadData();
                        });
                    }}
                />
            </WKGeneralBackground>
        );
    }

}


const mapStateToProps = state => ({
    userId: state.userReducer.userId,
});

export default connect(mapStateToProps)(AlarmPage);
