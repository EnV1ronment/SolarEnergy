import React, {Component} from 'react';
import DatePicker from './DatePicker';
import PopupPicker from 'rmc-date-picker/lib/Popup';
import PropTypes from 'prop-types';
import styles from './Styles';
import moment from "moment";
import {date_mode, locale_en_US, monthTypes} from "./Constants";

export default class WKDatePicker extends Component {

    static propTypes = {
        title: PropTypes.string, // Optional, title. Default is "Select Date".
        defaultDate: PropTypes.any, // Optional, Date type. Default is new Date().
        minDate: PropTypes.any, // Optional, Date type. Default is new Date(2018, 1, 1).
        maxDate: PropTypes.any, // Optional, Date type. Default is new Date().
        /**
         * Optional, date mode. Default is 'date', enum('date', 'year', 'month').
         * date: YYYY MM DD
         * year: YYYY
         * month: YYYY MM
         */
        mode: PropTypes.string,
        dateFormat: PropTypes.string, // Optional, date format. Default is 'YYYY-MM-DD'.
        monthTypes: PropTypes.array, // Optional, month type. Default is ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        locale: PropTypes.object, // Optional, default is {year: '', month: '', day: '', hour: '', minute: '', am: 'AM', pm: 'PM'}
        dismissText: PropTypes.string, // Optional, default is "Cancel"
        okText: PropTypes.string, // Optional, default is "Confirm"
        onOk: PropTypes.func, // Optional, ok handler.
        onDismiss: PropTypes.func, // Optional, dismiss handler.
        popUpStyles: PropTypes.object, // Optional, default is styles in file path -- './Styles'.
        actionTextUnderlayColor: PropTypes.string, // Optional, the activeOpacity effect for both cancel and ok button. Default is background color for header.
        multiPickerStyle: PropTypes.object, // Optional, bottom view styles.
    };

    static defaultProps = {
        title: 'Select Date',
        defaultDate: new Date(2019, 10, 1),
        minDate: new Date(2019, 8, 1),
        maxDate: new Date(),
        mode: date_mode.date,
        dateFormat: 'YYYY-MM-DD',
        monthTypes: monthTypes,
        locale: locale_en_US,
        dismissText: 'Cancel',
        okText: 'Confirm',
        popUpStyles: styles.popUp,
        actionTextUnderlayColor: styles.popUp.header.backgroundColor,
    };

    state = {
        selectedDate: null,
        visible: false,
    };

    _onOk = selectedDate => {
        __DEV__ && console.warn(selectedDate.toDateString());
        this.setState({selectedDate});
        const dateStr = this._dateToString(selectedDate);
        const {onOk} = this.props;
        onOk && onOk(dateStr);
    };

    _dateToString = date => moment(date).format(this.props.dateFormat);

    _onDismiss = () => {
        this.state = {selectedDate: null};
        const {onDismiss} = this.props;
        onDismiss && onDismiss();
    };

    // Control whether to set date picker modal as visible.
    setModalVisible = visible => this.setState({visible});

    render() {
        const {
            selectedDate,
            visible,
        } = this.state;
        const {
            title,
            defaultDate,
            minDate,
            maxDate,
            mode,
            children,
            monthTypes,
            locale,
            dismissText,
            okText,
            popUpStyles,
            actionTextUnderlayColor,
            multiPickerStyle,
        } = this.props;

        if (Object.values(date_mode).every(dateMode => dateMode !== mode)) {
            __DEV__ && console.error('Sorry! Just year、month and date types are supported so far. File: WKDatePicker, line: 94');
        }

        return (
            <PopupPicker
                picker={
                    <DatePicker
                        multiPickerStyle={multiPickerStyle}
                        defaultDate={defaultDate}
                        minDate={minDate}
                        maxDate={maxDate}
                        mode={mode}
                        formatMonth={month => monthTypes[month]}
                        locale={locale}
                    />
                }
                title={title}
                value={selectedDate}
                visible={visible}
                onVisibleChange={visible => this.setModalVisible(visible)} // onDismiss、onOk、onClickingMask to hide modal.
                styles={popUpStyles}
                actionTextUnderlayColor={actionTextUnderlayColor} // Remove the activeOpacity effect for both cancel and ok button.
                dismissText={dismissText}
                okText={okText}
                onOk={this._onOk}
                onDismiss={this._onDismiss}
            >
                {children}
            </PopupPicker>
        );
    }
}