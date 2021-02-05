import React, {Component} from 'react';
import {ScrollView, View} from 'react-native';
import WKGeneralBackground from "../../../../Common/Components/WKGeneralBackground";
import TopView from "./Components/TopView";
import PropTypes from 'prop-types';
import BottomView from "./Components/BottomView";
import WKFetch from "../../../../Network/WKFetch";
import WKAdvance from "../../../../Utils/WKAdvance";

// Constants
const Constants = {
    pv: 'PV',
    grid: 'Grid',
    home: 'Home',
    battery: 'Battery',
};

class SiteStatusPage extends Component {

    state = {
        energyData: {},
        summaryData: {},
    };

    componentDidMount() {
        this._loadEnergy();
        this._loadSummary();
    }

    _loadEnergy = () => {
        const {stationId} = this.props;
        WKFetch('/status/energy-flow', {stationId}).then(ret => {
            const {ok, errorCode, errorMsg, result} = ret;
            if (ok) {
                this.setState({
                    energyData: result,
                });
            } else {
                WKToast.show(errorMsg);
            }
        });
    };

    _loadSummary = () => {
        WKLoading.show();
        const {stationId} = this.props; // number type in whole project,
        WKFetch('/status/summary', {stationId}).then(ret => {
            WKLoading.hide();
            const {ok, errorCode, errorMsg, result} = ret;
            if (ok) {
                this.setState({
                    summaryData: result,
                });
            } else {
                WKToast.show(errorMsg);
            }
        });
    };

    _formatData = obj => {
        if (!obj && typeof obj !== 'object') return `--kW`;
        const {power} = obj;
        if (typeof power === 'string') return power;
        if (typeof power === 'number') {
            return WKAdvance(power, 'kW').formattedValue;
        } else {
            return `--kW`;
        }
    };

    render() {
        const {
            energyData,
            summaryData,
        } = this.state;
        const {
            battery,
            pv,
            grid,
            load,
        } = energyData;
        const batteryValue = this._formatData(battery);
        const pvValue = this._formatData(pv);
        const gridValue = this._formatData(grid);
        const homeValue = this._formatData(load);
        return (
            <WKGeneralBackground showSunshine={false}>
                <ScrollView indicatorStyle='white'>
                    <TopView
                        pvValue={pvValue}
                        pvTitle={Constants.pv}
                        gridValue={gridValue}
                        gridTitle={Constants.grid}
                        homeValue={homeValue}
                        homeTitle={Constants.home}
                        batteryValue={batteryValue}
                        batteryTitle={Constants.battery}
                        data={energyData}
                    />
                    <BottomView data={summaryData}/>
                    <View style={{height: 40}}/>
                </ScrollView>
            </WKGeneralBackground>
        );
    }
}

SiteStatusPage.propTypes = {
    stationId: PropTypes.number.isRequired,
};

export default SiteStatusPage;