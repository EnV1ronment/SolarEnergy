import React, {Component} from 'react';
import {
    TouchableOpacity,
    Image,
    StyleSheet,
    Text
} from 'react-native';
import PropTypes from 'prop-types';

export default class WKNavigationBarRightItem extends Component {

    static propTypes = {
        value: PropTypes.any.isRequired, // Icon or text are supported
        style: PropTypes.object, // text or icon styles
        click: PropTypes.func
    };

    _click = () => {
        const {click} = this.props;
        click && click();
    };

    render() {
        const {value, style} = this.props;
        const isIcon = typeof value !== 'string';
        return (
            <TouchableOpacity
                style={styles.container}
                onPress={this._click}
                activeOpacity={1}
            >
                {isIcon ?
                    <Image source={value} style={[styles.image, style]}/>
                    :
                    <Text style={[styles.text, style]}>{value}</Text>}
            </TouchableOpacity>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        padding: 10,
        paddingLeft: 25
    },
    image: {
        width: 15,
        height: 15
    },
    text: {
        color: Colors.white
    }
});