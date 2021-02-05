import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
} from 'react-native';

export default class DashSecondLine extends Component {
    render() {
        let len = parseInt(this.props.width / 7);
        let arr = [];
        for (let i = 0; i < len; i++) {
            arr.push(i);
        }
        return <View style={[styles.dashLine, {width: this.props.width}]}>
            {
                arr.map((item, index) => {
                    return <Text style={[styles.dashItem, {backgroundColor: this.props.backgroundColor}]}
                                 key={'dash' + index}> </Text>
                })
            }
        </View>
    }
}
const styles = StyleSheet.create({
    dashLine: {
        flexDirection: 'row',
    },
    dashItem: {
        height: 1,
        width: 4,
        marginRight: 3,
    }
})