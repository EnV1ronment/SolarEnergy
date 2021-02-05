import React, {PureComponent} from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';

export default class EnergyBackground extends PureComponent {

    static propTypes = {
        backgroundColor: PropTypes.string // Optional, set background color for current page.
    };

    render() {
        return (<View style={{marginTop: 40, backgroundColor: this.props.backgroundColor}}>
            {this.props.children}
        </View>);
    }
}