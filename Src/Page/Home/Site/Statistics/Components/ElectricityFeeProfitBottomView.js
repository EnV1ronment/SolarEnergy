import React, {PureComponent} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import electricity_fee_profit from '../../../../../Source/Status/electricity_fee_profit.png';

// Constants
const bottomData = [
    'Electricity Fee',
    'Profit',
];

// Layout constants
const iconSize = 19;
const bottomWidth = (SCREEN_WIDTH - 15) / 2;

class ElectricityFeeProfitBottomView extends PureComponent {

    render() {
        return (
            <View style={styles.container}>
                {
                    bottomData.map((title, index) => {
                        const {data} = this.props;
                        let value = '--';
                        if (data && Array.isArray(data) && data.length > index) {
                            value = data[index];
                        }
                        return (
                            <View key={title} style={styles.bottom}>
                                <View
                                    style={{width: bottomWidth - iconSize - 20}}
                                >
                                    <Text style={styles.bottomWhiteText}>{value}</Text>
                                    <Text style={styles.bottomGrayText}>{title}</Text>
                                </View>
                                <Image source={electricity_fee_profit} style={styles.icon}/>
                            </View>
                        );
                    })
                }
            </View>
        );
    }
}

// Props
ElectricityFeeProfitBottomView.propTypes = {
    data: PropTypes.array.isRequired,
};

// Styles
const styles = StyleSheet.create({
    // bottom view
    container: {
        flexDirection: 'row',
    },
    bottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: bottomWidth,
        marginLeft: 5,
        marginTop: 15,
        marginBottom: iosSafeAreaBottomHeight,
        padding: 5,
        borderRadius: 3,
        borderWidth: 0.5,
        borderColor: '#0477c0', // '#00a6ff',
    },
    bottomWhiteText: {
        fontSize: 14,
        color: "#ffffff",
        marginBottom: 3,
    },
    bottomGrayText: {
        fontSize: 10,
        color: "#5b6483",
    },
    icon: {
        width: iconSize,
        height: iconSize,
        marginRight: 5,
        resizeMode: 'contain',
    },
});

export default ElectricityFeeProfitBottomView;

