import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

// Icons
import Energy_left_arrow from '../../../../../Source/Energy/Energy_left_arrow.png';
import Energy_right_arrow from '../../../../../Source/Energy/Energy_right_arrow.png';
import Energy_left_arrow_disabled from '../../../../../Source/Energy/Energy_left_arrow_disabled.png';
import Energy_right_arrow_disabled from '../../../../../Source/Energy/Energy_right_arrow_disabled.png';
import {
    englishWordMonth,
    today,
} from "../../../../../Utils/WKTime";

const _height_ = 45;
const DATE_TYPE = {
    DAY: 0,
    MONTH: 1,
    YEAR: 2,
    LIFE_TIME: 3,
};

class SiteTouchableOpacity extends Component {

    static propTypes = {
        disabled: PropTypes.bool,
        onPress: PropTypes.func,
        style: PropTypes.object
    };

    static defaultProps = {
        disabled: false
    };

    _onPress = () => {
        const {onPress} = this.props;
        onPress && onPress();
    };

    render() {
        return (<TouchableOpacity
            style={[{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                height: _height_
            }, this.props.style]}
            activeOpacity={0.8}
            onPress={this._onPress}
            disabled={this.props.disabled}
        >
            {this.props.children}
        </TouchableOpacity>)
    }

}

export default class EnergyDateBar extends Component {

    static propTypes = {
        selectedDate: PropTypes.string.isRequired,
        dateType: PropTypes.number.isRequired,
        deviceBindTime: PropTypes.string.isRequired,
        dateClick: PropTypes.func.isRequired,
        arrowClick: PropTypes.func.isRequired,
    };

    _leftArrowClick = () => {
        const {arrowClick} = this.props;
        arrowClick && arrowClick(0);
    };

    _dateClick = () => {
        const {dateClick} = this.props;
        dateClick && dateClick();
    };

    _rightArrowClick = () => {
        const {arrowClick} = this.props;
        arrowClick && arrowClick(1);
    };

    _getMonthWord = (month) => {
        // Safe check
        if (!Number(month)) return month;
        return englishWordMonth(Number(month));
    };

    render() {
        let {
            dateType,
            selectedDate,
            deviceBindTime,
        } = this.props;

        let leftArrowDisabled = false;
        let rightArrowDisabled = false;

        const isDay = dateType === DATE_TYPE.DAY;
        const isMonth = dateType === DATE_TYPE.MONTH;
        const isYear = dateType === DATE_TYPE.YEAR;
        const isLifetime = dateType === DATE_TYPE.LIFE_TIME;

        const dateResult = selectedDate.split('-');
        const day = dateResult[2];
        const month = dateResult[1];
        const year = dateResult[0];

        // 日：列表选择
        // 月：列表选择
        // 年：列表选择
        // lifetime: 不可以选择

        // Day
        if (isDay) {
            if (selectedDate === today()) {
                rightArrowDisabled = true;
            }
            if (selectedDate === deviceBindTime) {
                leftArrowDisabled = true;
            }
        }

        // Month
        if (isMonth) {
            if (month === today().split('-')[1]
                && year === today().split('-')[0]) {
                rightArrowDisabled = true;
            }
            if (month === deviceBindTime.split('-')[1]
                && year === deviceBindTime.split('-')[0]) {
                leftArrowDisabled = true;
            }
        }

        const lifetimeStartYear = deviceBindTime.split('-')[0];
        const lifetimeThisYear = today().split('-')[0];

        // Year
        if (isYear) {
            rightArrowDisabled = year === lifetimeThisYear;
            leftArrowDisabled = year === lifetimeStartYear;
        }

        // Lifetime
        if (isLifetime) {
            leftArrowDisabled = true;
            rightArrowDisabled = true;
        }

        const lifetimeYear = lifetimeStartYear === lifetimeThisYear ? lifetimeThisYear : `${lifetimeStartYear}-${lifetimeThisYear}`;

        return (
            <View style={styles.container}>
                <View style={styles.leftContainer}>

                    <SiteTouchableOpacity
                        style={styles.leftArrowBtn}
                        onPress={this._leftArrowClick}
                        disabled={leftArrowDisabled}
                    >
                        <Image
                            source={leftArrowDisabled ? Energy_left_arrow_disabled : Energy_left_arrow}
                            style={styles.left_rightArrowIcon}
                        />
                    </SiteTouchableOpacity>

                    <SiteTouchableOpacity
                        style={styles.dateBtn}
                        onPress={this._dateClick}
                    >
                        {
                            isDay && <View style={styles.dateView}>
                                <Text style={styles.day}>{day}</Text>
                                <View>
                                    <Text style={styles.year_month}>{this._getMonthWord(month)}</Text>
                                    <Text style={styles.year_month}>{year}</Text>
                                </View>
                            </View>
                        }
                        {
                            isMonth && <View style={styles.dateView}>
                                <Text style={[styles.day, {fontSize: 24}]}>{this._getMonthWord(month)}</Text>
                                <View style={{height: 25, justifyContent: 'flex-end'}}>
                                    <Text style={[styles.year_month, {marginLeft: 3}]}>{year}</Text>
                                </View>
                            </View>
                        }
                        {
                            isYear && <View style={styles.dateView}>
                                <Text style={styles.day}>{year}</Text>
                            </View>
                        }
                        {
                            isLifetime && <View style={styles.dateView}>
                                <Text
                                    style={[styles.day, {fontSize: 20}]}>{lifetimeYear}</Text>
                            </View>
                        }
                    </SiteTouchableOpacity>

                    <SiteTouchableOpacity
                        style={styles.rightArrowBtn}
                        onPress={this._rightArrowClick}
                        disabled={rightArrowDisabled}
                    >
                        <Image
                            source={rightArrowDisabled ? Energy_right_arrow_disabled : Energy_right_arrow}
                            style={styles.left_rightArrowIcon}
                        />
                    </SiteTouchableOpacity>

                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        height: _height_,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.theme,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    leftArrowBtn: {
        paddingLeft: 10,
        paddingRight: 8,
    },
    dateBtn: {
        paddingLeft: 8,
        paddingRight: 8
    },
    dateView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    day: {
        fontSize: 26,
        color: Colors.white,
    },
    year_month: {
        fontSize: 12,
        color: Colors.placeholder
    },
    dateRangeText: {
        color: Colors.white,
        fontSize: 12
    },
    rightArrowBtn: {
        paddingLeft: 8,
        paddingRight: 20,
    },
    left_rightArrowIcon: {
        width: 7,
        height: 10
    },
    deviceBtn: {
        paddingLeft: 25,
        paddingRight: 6
    },
    device: {
        fontSize: 12,
        color: Colors.buttonBgColor
    },
    deviceDownArrow: {
        marginLeft: 6,
        width: 10,
        height: 6
    }
});
