import React, {Component} from 'react';
import TimePicker from './TimePicker';
import PopupPicker from 'rmc-date-picker/lib/Popup';
import PropTypes from 'prop-types';
import styles from './Styles';
import moment from "moment";
import {locale_en_US} from "./Constants";

export default class WKTimePicker extends Component {

    static propTypes = {
        title: PropTypes.string, // Optional, title. Default is "Select Date".
        defaultTime: PropTypes.array, // Optional, time type. Default is [00, 00].
        time: PropTypes.array, // Optional, time type. Default is [00, 00].
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
        title: 'Select Time',
        defaultTime: ['00', '00'],
        time: ['05', '00'],
        locale: locale_en_US,
        dismissText: 'Cancel',
        okText: 'Confirm',
        popUpStyles: styles.popUp,
        actionTextUnderlayColor: styles.popUp.header.backgroundColor,
    };

    state = {
        selectedTime: this.props.time || this.props.defaultTime,
        visible: false,
    };

    _onOk = selectedTime => {
        __DEV__ && console.warn(selectedTime);
        this.setState({selectedTime});
        const {onOk} = this.props;
        onOk && onOk(selectedTime);
    };

    _onDismiss = () => {
        this.state = {selectedTime: ['00', '00']};
        const {onDismiss} = this.props;
        onDismiss && onDismiss();
    };

    // Control whether to set date picker modal as visible.
    setModalVisible = visible => this.setState({visible});

    render() {
        const {
            selectedTime,
            visible,
        } = this.state;
        const {
            title,
            defaultTime,
            time,
            children,
            locale,
            dismissText,
            okText,
            popUpStyles,
            actionTextUnderlayColor,
            multiPickerStyle,
        } = this.props;

        return (
            <PopupPicker
                picker={
                    <TimePicker
                        multiPickerStyle={multiPickerStyle}
                        locale={locale}
                    />
                }
                title={title}
                pickerValueProp={'time'}
                pickerValueChangeProp={'onTimeChange'}
                value={selectedTime}
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