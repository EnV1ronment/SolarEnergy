import React, {Component} from 'react';
import {
    TouchableOpacity,
    Image,
    StyleSheet,
    Text
} from 'react-native';
import PropTypes from 'prop-types';
import back_icon from "../../Source/Common/back_icon.png";

export default class WKNavigationBarLeftItem extends Component {

    static propTypes = {
        value: PropTypes.any, // Icon or text are supported
        style: PropTypes.object, // text or icon styles
        click: PropTypes.func
    };

    static defaultProps = {
        value: back_icon
    };

    _back = () => {
        const {click} = this.props;
        click && click();
    };

    render() {
        const {value, style} = this.props;
        const isIcon = typeof value !== 'string';
        return (
            <TouchableOpacity
                style={styles.container}
                onPress={this._back}
                activeOpacity={1}
            >
                {
                    isIcon ?
                        <Image source={value} style={[styles.image, style]}/>
                        :
                        <Text style={[styles.text, style]}>{value}</Text>
                }
            </TouchableOpacity>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        paddingLeft: 12,
        paddingRight: 15,
        height: __iosNavigationBarHeight__
    },
    image: {
        width: 7,
        height: 13
    },
    text: {
        color: Colors.white
    }
});