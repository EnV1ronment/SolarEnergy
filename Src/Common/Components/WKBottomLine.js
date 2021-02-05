import React, {PureComponent} from 'react';
import {
    View,
    StyleSheet
} from 'react-native';

export default class WKBottomLine extends PureComponent {

    render() {
        return <View style={[styles.line, this.props.style]}/>;
    }
}

const styles = StyleSheet.create({
    line: {
        height: 0.5,
        marginLeft: 15,
        marginRight: 15,
        backgroundColor: Colors.placeholder
    }
});