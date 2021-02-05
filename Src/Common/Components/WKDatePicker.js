import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {CalendarList} from "react-native-calendars";
import moment from 'moment';
import {addDay, today, startOfAheadTwoMonth, subtractMonth} from "../../Utils/WKTime";
import WKGeneralBackground from "./WKGeneralBackground";
import QRCodeNavigationBar from "../../Page/Mine/Station/Device/Add/Components/QRCodeNavigationBar";
import WKModal from "./WKModal";

export default class WKDatePicker extends Component {

    static propTypes = {
        title: PropTypes.string, // Optional, Navigation bar title, default is 'Date Range'
        isSingle: PropTypes.bool, // Optional, date selection type, "true" is single date selection, "false" is double date range, default is false
        minDate: PropTypes.string, // Optional, the Minimum date that can be selected. For example: '2019-05-01'. Default is the beginning date of the first month three months ago
        maxDate: PropTypes.string, // Optional, the maximum date that can be selected. For example: '2019-07-19'. Default is today
        pastScrollRange: PropTypes.number, // Optional. Past scroll range for months. Default is 0 months -- 0
        futureScrollRange: PropTypes.number, // Optional. Future scroll range for months. Default is current month -- 0
        visible: PropTypes.bool.isRequired, // Required, whether the modal is visible, default is false.
        select: PropTypes.func.isRequired, // Required, date selection call back that contains date value array like ["2019-07-20", "2019-07-21"].
        onClose: PropTypes.func.isRequired, // Required, cancel
        selectedDateDiff: PropTypes.number, // Optional, default is 3 months
    };

    static defaultProps = {
        title: 'Date Range',
        isSingle: false,
        visible: false,
        minDate: startOfAheadTwoMonth(),
        maxDate: today(),
        pastScrollRange: 0,
        futureScrollRange: 0,
        selectedDateDiff: 3,
    };

    state = {
        markedDates: {}
    };

    _onClose = () => {
        this.state.markedDates = {};
        const {onClose} = this.props;
        onClose && onClose();
    };

    render() {

        let {
            visible,
            title,
            isSingle,
            select,
            minDate,
            maxDate,
            pastScrollRange,
            futureScrollRange,
            selectedDateDiff,
        } = this.props;

        let diffMonths = 0;
        if (maxDate.split('-')[2] >= minDate.split('-')[2]) {
            diffMonths = moment(maxDate, 'YYYY-MM-DD').diff(moment(minDate, 'YYYY-MM-DD'), 'M');
        } else {
            const tempMinDate = minDate.substr(0, 8) + maxDate.substr(8);
            diffMonths = moment(maxDate, 'YYYY-MM-DD').diff(moment(tempMinDate, 'YYYY-MM-DD'), 'M');
        }
        if (diffMonths > pastScrollRange) {
            pastScrollRange = diffMonths;
        }

        return (
            <WKModal
                visible={visible}
                transparent={true}
                animationType={'slide'}
                presentationStyle={'overFullScreen'}
                onRequestClose={this._onClose}
            >
                <QRCodeNavigationBar
                    title={title}
                    bgColor={Colors.theme}
                    leftItemClick={this._onClose}
                />
                <WKGeneralBackground>
                    <CalendarList
                        scrollEnabled={pastScrollRange > 0}
                        pastScrollRange={pastScrollRange}
                        futureScrollRange={futureScrollRange}
                        theme={{
                            'stylesheet.calendar-list.main': {
                                calendar: {
                                    paddingLeft: 0,
                                    paddingRight: 0
                                }
                            },
                            'stylesheet.calendar.header': {
                                header: {
                                    backgroundColor: '#0c2266',
                                    justifyContent: 'flex-start'
                                }
                            },
                            calendarBackground: Colors.theme,
                            textSectionTitleColor: Colors.placeholder,
                            dayTextColor: Colors.white,
                            textDisabledColor: Colors.placeholder,
                            todayTextColor: Colors.buttonBgColor,
                            monthTextColor: Colors.white
                        }}
                        markedDates={this.state.markedDates}
                        markingType={'period'}
                        minDate={minDate}
                        maxDate={maxDate}
                        onDayPress={({dateString}) => {

                            const {markedDates} = this.state;

                            const temObj = Object.assign({}, markedDates);
                            temObj[dateString] = {color: '#0c2266'};
                            const temArr = Object.keys(temObj).sort();

                            // Select the same day
                            if (!isSingle
                                && Object.keys(markedDates).length === 1
                                && dateString === Object.keys(markedDates)[0])
                            {
                                temArr.push(dateString)
                            }

                            if (temArr.length === 1) {

                                this.setState({
                                    markedDates: temObj
                                }, () => {
                                    if (isSingle) {
                                        this.state.markedDates = {};
                                        this.singleDateTimer = setTimeout(() => {
                                            this.singleDateTimer && clearTimeout(this.singleDateTimer);
                                            select && select([dateString]);
                                        }, 300);
                                    }
                                });

                            } else if (temArr.length === 2) {

                                let begin = temArr[0];
                                const end = temArr[1];

                                if (begin < subtractMonth(end, selectedDateDiff)) {
                                    WKToast.show(`${WK_T(wkLanguageKeys.date_range_not_longer_than)} ${selectedDateDiff} ${WK_T(wkLanguageKeys.months)}`);
                                    this.setState({
                                        markedDates: {}
                                    });
                                    return;
                                }

                                const obj = {};
                                obj[begin] = {color: '#0c2266'};
                                while (moment(begin).isBefore(moment(end))) {
                                    begin = addDay(begin);
                                    obj[begin] = {color: '#0c2266'};
                                }
                                this.setState({markedDates: obj}, () => {
                                    this.doubleDateTimer = setTimeout(() => {
                                        this.doubleDateTimer && clearTimeout(this.doubleDateTimer);
                                        this.state.markedDates = {};
                                        select && select([temArr[0], temArr[1]]);
                                    }, 300);
                                });

                            } else {

                                const obj = {};
                                obj[dateString] = {color: '#0c2266'};
                                this.setState({markedDates: obj});

                            }

                        }}
                        monthFormat={'MMM yyyy'}
                        hideArrows={true}
                        firstDay={7}
                    />
                </WKGeneralBackground>
            </WKModal>
        );
    }

}

