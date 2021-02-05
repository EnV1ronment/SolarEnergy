import React, {Component} from 'react';
import {ImageBackground, StyleSheet, Text, View, Image, TouchableOpacity} from "react-native";
import PropTypes from 'prop-types';

class ReserveView extends Component {
    state = {
        count: null,
    };

    componentDidMount() {
        this.setState({
            count: this.props.count
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
    render() {
        const {
            count,
        } = this.state;
        return (
            <View style={styles.container}>
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

ReserveView.propTypes = {
    count: PropTypes.number,
};

const styles = StyleSheet.create({
    container: {
        width: __SCREEN_WIDTH__ - 60,
        height: 40,
        alignItems: 'center',
    },
    ReserveView: {
        backgroundColor: 'rgb(31,54,121)',
        width: 160,
        alignItems: 'center',
        justifyContent:  'center',
        height: 40,
        borderRadius: 5,
        flexDirection: 'row'
    },
    text: {
        fontSize: 18,
        fontWeight:'bold',
        color: "#fff",
    },
});

export default ReserveView;