import React, {PureComponent} from 'react';
import {Image, StyleSheet, Text, View} from "react-native";
import PropTypes from 'prop-types';
import socIcon from '../../../../../Source/Status/soc.png';
import siteConsumptionIcon from '../../../../../Source/Status/site-consumption.png';
import electricityFeeIcon from '../../../../../Source/Status/electricity-fee.png';
import feedInIcon from '../../../../../Source/Status/feed-in.png';
import profitIcon from '../../../../../Source/Status/profit.png';
import WKAdvance from "../../../../../Utils/WKAdvance";

const icons = [
    {
        title: 'SOC',
        icon: socIcon,
        iconStyle: {width: 26, height: 19},
    },
    {
        title: 'Daily Generation',
        icon: siteConsumptionIcon,
        iconStyle: {width: 28, height: 28},
    },
    {
        title: 'Daily Consumption',
        icon: siteConsumptionIcon,
        iconStyle: {width: 28, height: 28},
    },
    {
        title: 'Daily Feed-in',
        icon: feedInIcon,
        iconStyle: {width: 27, height: 27},
    },
    {
        title: 'Daily Electricity Fee',
        icon: electricityFeeIcon,
        iconStyle: {width: 22, height: 22},
    },
    {
        title: 'Daily Profit',
        icon: profitIcon,
        iconStyle: {width: 27, height: 26},
    },
];

class BottomView extends PureComponent {

    _isNumberType = value => typeof value === "number";

    _isStringType = value => typeof value === 'string';

    _getData = value => {
        if (this._isStringType(value)) return value;
        if (this._isNumberType(value)) {
            return WKAdvance(value, 'kWh').formattedValue;
        }
        return `${value || '--'}kWh`;
    };

    _soc = soc => {
        if (this._isStringType(soc)) return soc;
        if (this._isNumberType(soc)) {
            return `${parseFloat(soc.toFixed(2))}%`;
        }
        return `${soc || '--'}%`;
    };

    _money = (money, isProfit, currency = 'CNY') => {
        if (this._isStringType(money)) return money;
        if (this._isNumberType(money)) {
            return isProfit ? `${parseFloat(money.toFixed(2))}${currency}` : `${parseFloat(money.toFixed(2))}${currency}`;
        }
        return isProfit ? `${money || '--'}${currency}` : `${money || '--'}${currency}`;
    };

    _formatData = () => {
        const {data} = this.props;
        const {
            SOC,
            generation,
            consumption,
            feedIn,
            electricityFee,
            profit,
            currency
        } = data;
        return [
            this._soc(SOC),
            this._getData(generation),
            this._getData(consumption),
            this._getData(feedIn),
            this._money(electricityFee, false, currency),
            this._money(profit, true, currency),
        ];
    };

    render() {
        const arr = this._formatData();
        return (
            <View style={styles.container}>
                {
                    icons.map((item, index) => {
                        const {
                            title,
                            icon,
                            iconStyle,
                        } = item;
                        let value = '--';
                        if (arr.length > index) {
                            value = arr[index];
                        }
                        return (<View key={index} style={styles.contentView}>

                            {
                                <View style={styles.topContainer}>
                                    <View style={styles.valueView}>
                                        <Text style={styles.value}>{value}</Text>
                                    </View>
                                    <View style={styles.iconView}>
                                        <Image style={iconStyle} source={icon} resizeMode='contain'/>
                                    </View>
                                </View>
                            }

                            {
                                <View style={styles.bottomContainer}>
                                    <Text style={styles.title}>{title}</Text>
                                </View>
                            }

                        </View>);
                    })
                }
            </View>
        );
    };

}

BottomView.propTypes = {
    data: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    contentView: {
        marginLeft: 5,
        width: (SCREEN_WIDTH - 15) / 2,
        height: 75,
        borderWidth: 0.5,
        marginTop: 5,
        borderColor: '#1a5578',
        // borderColor: '#07296d',
    },
    topContainer: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    valueView: {
        flex: 3,
    },
    value: {
        fontSize: 18,
        marginLeft: 12,
        color: "#ffffff",
    },
    iconView: {
        flex: 1,
    },
    bottomContainer: {
        flex: 1.2,
        paddingLeft: 13,
    },
    title: {
        marginTop: 5,
        fontSize: 12,
        color: "#576080",
    },
});

export default BottomView;