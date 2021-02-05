import React, {Component} from 'react';
import MultiPicker from 'rmc-picker/lib/MultiPicker';
import Picker from 'rmc-picker/lib/Picker';
import PropTypes from 'prop-types';
import {hourType} from "./Constants";
class DatePicker extends Component {

    static propTypes = {
        multiPickerStyle: PropTypes.object,
        defaultTime: PropTypes.array,
        selectedTime: PropTypes.array,
        locale: PropTypes.object.isRequired,
        onTimeChange: PropTypes.func,
        onValueChange: PropTypes.func,
    };

    static defaultProps = {
        disabled: false,
    };

    state = {
        selectedTime: this.props.time || this.props.defaultTime,
    };

    shouldComponentUpdate(nextProps) {
        const {time, defaultTime} = nextProps;
        if (time && time.length && this.state.selectedTime !== time) {
            this.setState({
                selectedTime: time || defaultTime,
            });
            return true;
        }
        return false;
    }

    getValue = () => this.state.selectedTime;

    _onValueChange = (values, column) => {
    //     if (!('time' in this.props)) {
    //         __DEV__ && console.warn('Hello: date field is not in props');
    //         this.setState({time: values});
    //     }
        const {onTimeChange, onValueChange} = this.props;
        onTimeChange && onTimeChange(values);
        onValueChange && onValueChange(values, column);
    };

    render() {
        let {selectedTime} = this.state;
        let time = hourType;
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
                selectedValue={selectedTime}
                onValueChange={this._onValueChange}
            >
                {
                    time.map(item => {
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
