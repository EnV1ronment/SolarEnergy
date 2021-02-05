import React, {PureComponent} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import feedInIcon from '../../../../../Source/Status/feedInIcon.png';
import consumptionIcon from '../../../../../Source/Status/consumptionIcon.png';
import generationIcon from '../../../../../Source/Status/generationIcon.png';

// Constants
const topData = [
    {
        title: 'Generation',
        color: '#00a6ff',
    }, {
        title: 'Consumption',
        color: '#f59a23',
    }, {
        title: 'Feed-in',
        color: '#d9001b',
    },
    // {
    //     title: 'Battery',
    //     color: '#70b603',
    // },
];

const bottomData = [
    {
        title: 'Generation',
        icon: generationIcon,
        iconStyle: {width: 22, height: 14, resizeMode: 'contain'},
    }, {
        title: 'Consumption',
        icon: consumptionIcon,
        iconStyle: {width: 14, height: 14, resizeMode: 'contain'},
    }, {
        title: 'Feed-in',
        icon: feedInIcon,
        iconStyle: {width: 14, height: 14, resizeMode: 'contain'},
    },
];

class EnergyStatisticsBottomView extends PureComponent {

    render() {
        return (
            <>
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
                <View style={styles.bottomContainer}>
                    {
                        bottomData.map((item, index) => {
                            const {title, icon, iconStyle} = item;
                            const {data} = this.props;
                            let value = '--';
                            if (data && Array.isArray(data) && data.length > index) {
                                value = data[index];
                            }
                            return (
                                <View key={title} style={styles.bottom}>
                                    <View
                                        style={{width: (SCREEN_WIDTH - 20) / 3 - item.iconStyle.width - 10}}
                                    >
                                        <Text style={styles.bottomWhiteText}>{value}</Text>
                                        <Text style={styles.bottomGrayText}>{title}</Text>
                                    </View>
                                    <Image source={icon} style={iconStyle}/>
                                </View>
                            );
                        })
                    }
                </View>
            </>
        );
    }
}

// Props
EnergyStatisticsBottomView.propTypes = {
    data: PropTypes.array.isRequired,
};

// Styles
const styles = StyleSheet.create({
    // top view
    top: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
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

    // bottom view
    bottomContainer: {
        flexDirection: 'row',
    },
    bottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: (SCREEN_WIDTH - 20) / 3,
        marginLeft: 5,
        marginTop: 27,
        marginBottom: 10,
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
});

export default EnergyStatisticsBottomView;

