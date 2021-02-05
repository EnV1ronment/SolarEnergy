import React, {PureComponent} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

export default class EnergyTabTypeText extends PureComponent {

    static propTypes = {
        text: PropTypes.string,
        showRight: PropTypes.bool
    };

    static defaultProps = {
        text: '',
        showRight: true
    };

    render() {
        const extraDotStyle = {
            marginLeft: 21,
            backgroundColor: '#22ce39',
            shadowColor: '#22ce39'
        };
        return (<View>
            <View style={{height: 16}}/>
            <View style={styles.container}>
                <Text style={styles.text}>{this.props.text}</Text>
                {this.props.showRight && <View style={styles.container}>
                    <View style={styles.rightDot}/>
                    <Text style={styles.rightText}>
                        {WK_T(wkLanguageKeys.solar_for_energy_page)}
                    </Text>
                    <View style={[styles.rightDot, extraDotStyle]}/>
                    <Text style={styles.rightText}>
                        {WK_T(wkLanguageKeys.consumption_for_energy_page)}
                    </Text>
                </View>}
            </View>
        </View>);
    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 10,
    },
    text: {
        marginLeft: 11,
        fontSize: 15,
        color: Colors.buttonBgColor
    },
    rightDot: {
        backgroundColor: '#00a6ff',
        width: 10,
        height: 10,
        borderRadius: 5,
        shadowColor: '#00a6ff',
        shadowOpacity: 0.9,
        shadowOffset: {height: 1}
    },
    rightText: {
        fontSize: 12,
        color: Colors.placeholder,
        marginLeft: 5,
        marginRight: 7
    }
});
