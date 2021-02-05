import React, {Component} from 'react';
import {ImageBackground, StyleSheet, Text, View, Image, TouchableOpacity} from "react-native";
import PropTypes from 'prop-types';

class ChooseSettingView extends Component {
    state = {
        count: null,
        isBalanced: true
    };

    componentDidMount() {
        this.setState({
            count: this.props.count,
            isBalanced: this.props.isBalanced
        });
    }

    _add = () =>{
        let count = this.state.count + 1;
        if (count <= 100){
            this.setState({
                count
            });
        }
    }

    _minus = () =>{
        let count = this.state.count - 1;
        if (count >= 0){
            this.setState({
                count
            });
        }
    }
    _onchange = () =>{
        const {
            isBalanced
        } = this.state;
        this.setState({
            isBalanced: !isBalanced
        });
    }
    render() {
        const {
            count,
            isBalanced
        } = this.state;
        let balancedStyly = isBalanced ? styles.selectedView : styles.unselectedView;
        let costSavingStyly = !isBalanced ? styles.selectedView : styles.unselectedView;
        let selected_dec = isBalanced ? WK_T(wkLanguageKeys.balanced_dec) : WK_T(wkLanguageKeys.cost_saving_dec);
        return (
            <View style={styles.container}>
                <View style={styles.ChooseSettingView}>
                    <TouchableOpacity onPress={()=>{!isBalanced && this._onchange();}}>
                        <View style={balancedStyly}>
                            <Text style={styles.boldText}>{WK_T(wkLanguageKeys.balanced)}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{isBalanced && this._onchange();}}>
                        <View style={costSavingStyly}>
                            <Text style={styles.boldText}>{WK_T(wkLanguageKeys.cost_saving)}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.descriptionView}>
                    <Text style={styles.description}>{selected_dec}</Text>
                </View>
                <View style={styles.descriptionView}>
                    <Text style={styles.boldText}>{WK_T(wkLanguageKeys.advanced_reserve)}</Text>
                </View>
                <View style={styles.ReserveView}>
                    <TouchableOpacity onPress={()=>{this._minus();}}>
                        <View style={{width: 30, alignItems: 'center'}}>
                            <Text style={styles.text}>-</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{flex: 1, alignItems: 'center'}}>
                        <Text style={styles.text}>{count}%</Text>
                    </View>

                    <TouchableOpacity onPress={()=>{this._add();}}>
                        <View style={{width: 30, alignItems: 'center'}}>
                            <Text style={styles.text}>+</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

}

ChooseSettingView.propTypes = {
    count: PropTypes.number,
    isBalanced: PropTypes.bool,
};

const styles = StyleSheet.create({
    container: {
        width: __SCREEN_WIDTH__ - 60,
        alignItems: 'center',
    },
    ChooseSettingView: {
        width: (__SCREEN_WIDTH__ - 60),
        height: 40,
        borderWidth:1,
        borderColor: 'rgb(48,72,143)',
        borderRadius: 5,  
        flexDirection: 'row',
    },
    selectedView: {
        width: (__SCREEN_WIDTH__ - 60) / 2,
        height: 40,
        alignItems: 'center',
        justifyContent:  'center',
        backgroundColor: 'rgb(31,54,121)',
    },
    unselectedView: {
        width: (__SCREEN_WIDTH__ - 60) / 2,
        height: 40,
        alignItems: 'center',
        justifyContent:  'center',
    },
    ReserveView: {
        backgroundColor: 'rgb(31,54,121)',
        width: 160,
        alignItems: 'center',
        marginTop: 20,
        justifyContent:  'center',
        height: 40,
        borderRadius: 5,
        flexDirection: 'row'
    },
    boldText: {
        fontSize: 18,
        fontWeight:'bold',
        color: "#fff",
    },
    text: {
        fontSize: 18,
        color: "#fff",
    },

    descriptionView: {
        width: (__SCREEN_WIDTH__ - 60),
        marginTop: 20,
        paddingRight: 20,
    },
    description: {
        fontSize: 16,
        color: "#fff",
    },
});

export default ChooseSettingView;