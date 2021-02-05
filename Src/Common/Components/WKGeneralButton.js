import React, {Component} from 'react';
import {
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';

export default class WKGeneralButton extends Component {

    static propTypes = {
        title: PropTypes.string.isRequired, // button title
        click: PropTypes.func.isRequired, // button click event
        disabled: PropTypes.bool, // default is false
        marginTop: PropTypes.number // default is 30
    };

    static defaultProps = {
        marginTop: 30,
        disabled: false
    };

    _onPress = () => {
        const {click} = this.props;
        click && click();
    };

    render() {
        const {
            title,
            marginTop,
            disabled
        } = this.props;
        const bgColor = disabled ? Colors.placeholder : Colors.buttonBgColor;
        const borderWidth = disabled ? 0 : 1;
        return (
            <TouchableOpacity
                style={[styles.container, {
                    marginTop: marginTop,
                    backgroundColor: bgColor,
                    borderWidth: borderWidth,
                }]}
                activeOpacity={0.8}
                onPress={this._onPress}
                disabled={disabled}
            >
                <Text style={styles.title}>{title}</Text>
            </TouchableOpacity>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        marginLeft: 5,
        marginRight: 5,
        height: 50,
        borderRadius: 3,
        borderStyle: "solid",
        borderColor: Colors.buttonBgColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 12,
        color: Colors.white
    }
});