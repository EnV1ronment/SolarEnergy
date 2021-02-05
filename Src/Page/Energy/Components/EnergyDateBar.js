import React, {PureComponent} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet, UIManager, findNodeHandle} from 'react-native';
import PropTypes from 'prop-types';

// Icons
import Energy_left_arrow from '../../../Source/Energy/Energy_left_arrow.png';
import Energy_right_arrow from '../../../Source/Energy/Energy_right_arrow.png';
import Energy_left_arrow_disabled from '../../../Source/Energy/Energy_left_arrow_disabled.png';
import Energy_right_arrow_disabled from '../../../Source/Energy/Energy_right_arrow_disabled.png';
import home_down_arrow from '../../../Source/Common/home_down_arrow.png';
import {
    endDateOfCurrentWeek,
    englishWordMonth,
    startDateOfCurrentWeek,
    startOfAheadTwoMonth,
    today
} from "../../../Utils/WKTime";
import moment from "moment";

const _height_ = 40;
const DATE_TYPE = {
    DAY: 0,
    WEEK: 1,
    MONTH: 2,
    DATE_RANGE: 3
};

class EnergyTouchableOpacity extends PureComponent {

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

export default class EnergyDateBar extends PureComponent {

    static propTypes = {
        allDevices: PropTypes.array.isRequired,
        selectedDevices: PropTypes.array.isRequired,
        deviceBindTime: PropTypes.string.isRequired,
        stationOrDevice: PropTypes.string.isRequired,
        startDate: PropTypes.string.isRequired,
        endDate: PropTypes.string.isRequired,
        dateType: PropTypes.number.isRequired,
        leftArrowClick: PropTypes.func.isRequired,
        leftArrowDisabled: PropTypes.bool,
        dateClick: PropTypes.func.isRequired,
        rightArrowClick: PropTypes.func.isRequired,
        rightArrowDisabled: PropTypes.bool,
        selectDevice: PropTypes.func.isRequired,
        getMarginTop: PropTypes.func.isRequired
    };

    static defaultProps = {
        leftArrowDisabled: false,
        rightArrowDisabled: false
    };

    componentDidMount() {
        this.timer = setTimeout(() => {
            this.timer && clearTimeout(this.timer);
            UIManager.measure(findNodeHandle(this.componentRef), (x, y, width, height, pageX, pageY) => {
                let top = 0;
                if (height && pageY) {
                    top = height + pageY - 10;
                } else {
                    top = __isIOS__ ? 155 : 140;
                }
                this.props.getMarginTop(top);
            });
        }, 500);
    }

    _leftArrowClick = () => {
        const {leftArrowClick} = this.props;
        leftArrowClick && leftArrowClick();
    };

    _dateClick = () => {
        const {dateClick} = this.props;
        dateClick && dateClick();
    };

    _rightArrowClick = () => {
        const {rightArrowClick} = this.props;
        rightArrowClick && rightArrowClick();
    };

    _selectDevice = () => {
        const {selectDevice} = this.props;
        selectDevice && selectDevice();
    };

    _getMonthWord = (month) => {
        // Safe check
        if (!Number(month)) return month;
        return englishWordMonth(Number(month));
    };

    render() {
        let {
            dateType,
            startDate,
            endDate,
            leftArrowDisabled,
            rightArrowDisabled,
            deviceBindTime,
            selectedDevices,
            allDevices,
        } = this.props;
        const isDay = dateType === DATE_TYPE.DAY;
        const isMonth = dateType === DATE_TYPE.MONTH;
        const isWeek = dateType === DATE_TYPE.WEEK;
        const isDateRange = dateType === DATE_TYPE.DATE_RANGE;
        const dateResult = startDate.split('-');
        const day = dateResult[2];
        const month = dateResult[1];
        const year = dateResult[0];

        // Day
        if (isDay) {
            if (startDate === today()) {
                rightArrowDisabled = true;
            }
            if (startDate === startOfAheadTwoMonth()
                || startDate === deviceBindTime
            ) {
                leftArrowDisabled = true;
            }
        }

        // Month
        if (isMonth) {
            if (month === today().split('-')[1]) {
                rightArrowDisabled = true;
            }
            if (month === startOfAheadTwoMonth().split('-')[1]
                || month === deviceBindTime.split('-')[1]
            ) {
                leftArrowDisabled = true;
            }
        }

        // Week
        if (isWeek) {
            if (endDate === endDateOfCurrentWeek()) {
                rightArrowDisabled = true;
            }
            if (startDate <= startOfAheadTwoMonth()
                || startDate <= deviceBindTime
            ) {
                leftArrowDisabled = true;
            }
            startDate = startDate.split('-').reverse().join('/') + ' - ';
            endDate = endDate.split('-').reverse().join('/');
        }

        // Date range
        if (isDateRange) {
            leftArrowDisabled = true;
            rightArrowDisabled = true;
            startDate = startDate.split('-').reverse().join('/') + ' - ';
            endDate = endDate.split('-').reverse().join('/');
        }

        let isDateRangeButtonDisabled = false;
        if (!selectedDevices.length) {
            leftArrowDisabled = true;
            rightArrowDisabled = true;
            isDateRangeButtonDisabled = true;
        }

        return (
            <View style={styles.container}>
                <View style={styles.leftContainer}>
                    <EnergyTouchableOpacity
                        style={styles.leftArrowBtn}
                        onPress={this._leftArrowClick}
                        disabled={leftArrowDisabled}
                    >
                        <Image
                            source={leftArrowDisabled ? Energy_left_arrow_disabled : Energy_left_arrow}
                            style={styles.left_rightArrowIcon}
                        />
                    </EnergyTouchableOpacity>
                    <EnergyTouchableOpacity
                        style={styles.dateBtn}
                        disabled={isDateRangeButtonDisabled}
                        onPress={this._dateClick}
                    >
                        {
                            isDay && <View style={styles.dateView}>
                                <Text style={[styles.day,
                                    {color: selectedDevices.length ? Colors.white : Colors.placeholder}
                                ]}>{day}</Text>
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
                            (isWeek || isDateRange) && <View style={styles.dateView}>
                                <Text style={styles.dateRangeText}>{startDate}</Text>
                                <Text style={styles.dateRangeText}>{endDate}</Text>
                            </View>
                        }
                    </EnergyTouchableOpacity>
                    <EnergyTouchableOpacity
                        style={styles.rightArrowBtn}
                        onPress={this._rightArrowClick}
                        disabled={rightArrowDisabled}
                    >
                        <Image
                            source={rightArrowDisabled ? Energy_right_arrow_disabled : Energy_right_arrow}
                            style={styles.left_rightArrowIcon}
                        />
                    </EnergyTouchableOpacity>
                </View>
                <View ref={ref => this.componentRef = ref} collapsable={false}>
                    <EnergyTouchableOpacity
                        style={styles.deviceBtn}
                        onPress={this._selectDevice}
                    >
                        <Text style={styles.device}>{this.props.stationOrDevice}</Text>
                        <Image source={home_down_arrow} style={styles.deviceDownArrow}/>
                    </EnergyTouchableOpacity>
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
        borderBottomWidth: 0.8,
        borderBottomColor: Colors.placeholder,
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
        fontSize: 30,
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
