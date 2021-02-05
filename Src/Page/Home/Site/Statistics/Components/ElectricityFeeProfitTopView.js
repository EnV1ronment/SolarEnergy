import React, {PureComponent} from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

// Constants
const topData = [
    {
        title: 'Electricity Fee',
        color: '#00a6ff',
    }, {
        title: 'Profit',
        color: '#70b603',
    },
];
class ElectricityFeeProfitTopView extends PureComponent {

    render() {
        return (
            <View style={styles.top}>
                {topData.map(item => <View
                    key={item.title}
                    style={styles.row}>
                    <View style={[styles.dot,
                        {backgroundColor: item.color}]}
                    />
                    <Text style={styles.text}>
                        {item.title}
                    </Text>
                </View>)}
            </View>
        );
    }
}

// Styles
const styles = StyleSheet.create({
    // top view
    top: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    text: {
        marginLeft: 5,
        fontSize: 12,
        color: "#5b6483",
    },
});

export default ElectricityFeeProfitTopView;

