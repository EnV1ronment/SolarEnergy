import React, {Component} from 'react';
import {ImageBackground, StyleSheet, Text, View, Image, TouchableOpacity} from "react-native";
import PropTypes from 'prop-types';
import deleteIcon from "../../../../../../Source/Common/delete.png";
import addIcon from "../../../../../../Source/Common/add.png";
import WKTimePicker from '../WKTimePicker/WKTimePicker';
import { t } from 'i18n-js';

class PeriodsView extends Component {
    state = {
        periods: [],
        time: ['00', '00'],
        type: '',
        index: 0
    };

    componentDidMount() {
    }

    _add = () =>{
        let periods = this.props.periods;
        periods.push({from: '00:00', to: '00:00'})
        this.props.onValueChange(periods);
    }

    _showPicker = (type, index) =>{
        this.popTimePicker.setModalVisible(true);
        this.setState({
            type,
            index
        });
    }

    _edit = (time) =>{
        let {type, index} = this.state;
        let periods = this.props.periods;
        periods[index][type] = `${time[0]}:${time[1]}`;
        this.props.onValueChange(periods);
    }

    _minus = (index) =>{
        let periods = [];
        this.props.periods.forEach((period, _index) => {
            if(index != _index){
                periods.push(period)
            }
        })
        this.props.onValueChange(periods);
    }
    _getPeriods = () =>{
        let periods = this.props.periods;
        let arr = [];
        if(typeof periods != 'undefined' && periods && periods.length > 0){
            arr = periods
        }
        return periods.map((period, index) => {
            return(
            <View style={styles.periodView}>
                <TouchableOpacity onPress={()=>{this._showPicker('from', index);}}>
                    <View style={styles.timeView}>
                        <Text style={styles.timeText}>{period.from}</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.splitView}>
                    <Text style={styles.timeText}>~</Text>
                </View>
                <TouchableOpacity onPress={()=>{this._showPicker('to', index);}}>
                    <View style={styles.timeView}>
                        <Text style={styles.timeText}>{period.to}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.minusView} onPress={()=>{this._minus(index);}}>
                    <Image source={deleteIcon} style={styles.deleteIcon}/>
                </TouchableOpacity>
            </View>
            )
        })
    }
    render() {
        const {
            time
        } = this.state;
        let periodsNodes = this._getPeriods();
        return (
            <View style={styles.container}>
                {periodsNodes}
                <TouchableOpacity onPress={()=>{this._add();}}>
                    <View style={styles.addView}>
                        <Image source={addIcon} style={styles.addIcon}/>
                        <Text style={styles.timeText}>{WK_T(wkLanguageKeys.add_periods)}</Text>
                    </View>
                </TouchableOpacity>
                <WKTimePicker
                    ref={ref => this.popTimePicker = ref}
                    time={time}
                    onOk={time => {this._edit(time)}}
                />
            </View>
        );
    }

}

PeriodsView.propTypes = {
    periods: PropTypes.array,
    onValueChange: PropTypes.func,
};

const styles = StyleSheet.create({
    container: {
        width: __SCREEN_WIDTH__ - 60,
        justifyContent:  'center',
    },
    periodView: {
        flexDirection: 'row',
        marginBottom: 10
    },
    timeView: {
        width: (__SCREEN_WIDTH__ - 160) / 2,
        alignItems: 'center',
        justifyContent:  'center',
        height: 40,
        borderWidth:1,
        borderColor: 'rgb(48,72,143)',
        borderRadius: 5,
    },
    timeText: {
        fontSize: 16,
        color: "#fff",
    },
    splitView: {
        width: 20,
        alignItems: 'center',
        justifyContent:  'center',
        height: 40,
        marginHorizontal: 10
    },
    minusView: {
        alignItems: 'center',
        justifyContent:  'center',
        height: 20,
        marginTop: 10,
        marginLeft: 20,
    },
    addView: {
        width: __SCREEN_WIDTH__ - 120,
        alignItems: 'center',
        justifyContent:  'center',
        height: 40,
        borderWidth:1,
        borderColor: 'rgb(48,72,143)',
        borderRadius: 5,  
        borderStyle: 'dashed',
        flexDirection: 'row',
    },
    deleteIcon: {
        resizeMode: 'cover',
        width: 20,
        height: 20
    },
    addIcon: {
        resizeMode: 'cover',
        width: 20,
        height: 20,
        marginRight: 20
    }
});

export default PeriodsView;