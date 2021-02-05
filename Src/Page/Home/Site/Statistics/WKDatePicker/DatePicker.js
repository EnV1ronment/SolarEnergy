import React, {Component} from 'react';
import MultiPicker from 'rmc-picker/lib/MultiPicker';
import Picker from 'rmc-picker/lib/Picker';
import PropTypes from 'prop-types';
import {date_mode} from "./Constants";

function getDaysInMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function cloneDate(date) {
    return new Date(+date);
}

function setMonth(date, month) {
    date.setDate(Math.min(date.getDate(), getDaysInMonth(new Date(date.getFullYear(), month))));
    date.setMonth(month);
}

const ONE_DAY = 24 * 60 * 60 * 1000;

class DatePicker extends Component {

    static propTypes = {
        multiPickerStyle: PropTypes.object,
        defaultDate: PropTypes.any.isRequired,
        minDate: PropTypes.any.isRequired,
        maxDate: PropTypes.any.isRequired,
        mode: PropTypes.string.isRequired,
        locale: PropTypes.object.isRequired,
        formatMonth: PropTypes.func,
        formatDay: PropTypes.func,
        onDateChange: PropTypes.func,
        onValueChange: PropTypes.func,
    };

    static defaultProps = {
        disabled: false,
    };

    state = {
        date: this.props.date || this.props.defaultDate,
    };

    shouldComponentUpdate(nextProps) {
        const {date, defaultDate} = nextProps;
        if (date && this.state.date.toDateString() !== date.toDateString()) {
            this.setState({
                date: date || defaultDate,
            });
            return true;
        }
        return false;
    }

    _onValueChange = (values, column) => {
        const props = this.props;
        const newDate = this._getNewDate(values, column);
        // values: ["2020", "0", "15"]  column: 1  newDate: "2020-01-15T07:21:24:461Z"
        if (!('date' in props)) {
            __DEV__ && console.warn('Hello: date field is not in props');
            this.setState({date: newDate});
        }
        const {onDateChange, onValueChange} = this.props;
        onDateChange && onDateChange(newDate);
        onValueChange && onValueChange(values, column);
    };

    _getNewDate = (values, index) => {
        const value = parseInt(values[index], 10);
        const props = this.props;
        const {mode} = props;
        let newValue = cloneDate(this.getDate());
        if (Object.values(date_mode).some(item => item === mode)) {
            switch (index) {
                case 0:
                    newValue.setFullYear(value);
                    break;
                case 1:
                    // Note: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setMonth
                    // e.g. from 2017-03-31 to 2017-02-28
                    setMonth(newValue, value);
                    break;
                case 2:
                    newValue.setDate(value);
                    break;
                default:
                    break;
            }
        }
        return this._clipDate(newValue);
    };

    _getDefaultMinDate = () => new Date(2000, 1, 1, 0, 0, 0);

    _getDefaultMaxDate = () => new Date(2030, 1, 1, 23, 59, 59);

    getDate = () => this._clipDate(this.state.date || this._getDefaultMinDate());

    /**
     * This function, which is used in node_modules/rmc-picker/lib/PopupMixin.js, must be accomplished,
     * @returns {*}
     */
    getValue = () => this.getDate();

    _getMinYear = () => this._getMinDate().getFullYear();

    _getMaxYear = () => this._getMaxDate().getFullYear();

    _getMinMonth = () => this._getMinDate().getMonth();

    _getMaxMonth = () => this._getMaxDate().getMonth();

    _getMinDay = () => this._getMinDate().getDate();

    _getMaxDay = () => this._getMaxDate().getDate();

    _getMinDate = () => this.props.minDate || this._getDefaultMinDate();

    _getMaxDate = () => this.props.maxDate || this._getDefaultMaxDate();

    _getDateData = () => {
        const {
            locale,
            formatMonth,
            formatDay,
            mode,
        } = this.props;
        const date = this.getDate();
        const selYear = date.getFullYear();
        const selMonth = date.getMonth();
        const minDateYear = this._getMinYear();
        const maxDateYear = this._getMaxYear();
        const minDateMonth = this._getMinMonth();
        const maxDateMonth = this._getMaxMonth();
        const minDateDay = this._getMinDay();
        const maxDateDay = this._getMaxDay();

        // Years
        const years = [];
        for (let year = minDateYear; year <= maxDateYear; year++) {
            const obj = {value: year, label: year + locale.year};
            years.push(obj);
        }
        const yearData = {key: date_mode.year, data: years};
        // Date type: "year"
        if (mode === date_mode.year) return [yearData];

        // Months
        const months = [];
        let minMonth = 0;
        let maxMonth = 11;
        if (minDateYear === selYear) {
            minMonth = minDateMonth;
        }
        if (maxDateYear === selYear) {
            maxMonth = maxDateMonth;
        }
        for (let month = minMonth; month <= maxMonth; month++) {
            const label = formatMonth ? formatMonth(month, date) : (month + 1 + locale.month);
            months.push({value: month, label});
        }
        const monthData = {key: date_mode.month, data: months};
        if (mode === date_mode.month) return [yearData, monthData];

        // Days
        const days = [];
        let minDay = 1;
        let maxDay = getDaysInMonth(date);
        if (minDateYear === selYear && minDateMonth === selMonth) {
            minDay = minDateDay;
        }
        if (maxDateYear === selYear && maxDateMonth === selMonth) {
            maxDay = maxDateDay;
        }
        for (let day = minDay; day <= maxDay; day++) {
            const label = formatDay ? formatDay(day, date) : (day + locale.day);
            days.push({value: day, label});
        }
        const dayData = {key: date_mode.date, data: days};
        return [yearData, monthData, dayData];
    };

    _clipDate = date => {
        const {mode} = this.props;
        const minDate = this._getMinDate();
        const maxDate = this._getMaxDate();
        if (Object.values(date_mode).some(item => item === mode)) {
            // compare-two-dates: https://stackoverflow.com/a/14629978/2190503
            if (+date + ONE_DAY <= minDate) {
                return cloneDate(minDate);
            }
            if (date >= +maxDate + ONE_DAY) {
                return cloneDate(maxDate);
            }
        }
        return date;
    };

    _getData = () => {
        const date = this.getDate();
        const values = [
            date.getFullYear().toString(),
            date.getMonth().toString(),
            date.getDate().toString(),
        ];
        const dateData = this._getDateData();
        switch (this.props.mode) {
            case date_mode.year:
                return {dateData, selectedValue: values.slice(0, 1)};
            case date_mode.month:
                return {dateData, selectedValue: values.slice(0, 2)};
            case date_mode.date:
                return {dateData, selectedValue: values.slice(0, 3)};
        }
    };

    render() {
        const {dateData, selectedValue} = this._getData();
        const {disabled, multiPickerStyle} = this.props;
        const multiStyle = {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#081643', // backgroundColor for bottom view below header.
            ...multiPickerStyle,
        };
        return (
            <MultiPicker
                style={multiStyle}
                selectedValue={selectedValue}
                onValueChange={this._onValueChange}
            >
                {
                    dateData.map(item => {
                        const {key, data} = item;
                        return (<Picker
                            style={{flex: 1}}
                            key={key}
                            disabled={disabled}
                            itemStyle={{color: 'white'}} // fontSize is supported for item on each row.
                        >
                            {
                                data.map(item => {
                                    const {label, value} = item;
                                    return (<Picker.Item key={value} value={value}>
                                        {label}
                                    </Picker.Item>);
                                })
                            }
                        </Picker>);
                    })
                }
            </MultiPicker>
        );
    }
}

export default DatePicker;
