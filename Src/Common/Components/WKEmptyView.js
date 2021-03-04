import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

export default class WKEmptyView extends Component {

    static propTypes = {
        containerStyles: PropTypes.object, // Optional. Styles for view container.
        emptyText: PropTypes.string.isRequired, // Required, empty text.
        emptyTextStyles: PropTypes.object, // Optional. Styles for empty text.
        reloadText: PropTypes.string, // Optional, default is 'Reload'.
        reloadTextStyles: PropTypes.object, // Optional. Styles for reload button text.
        reloadTextButtonStyles: PropTypes.object, // Optional. Styles for reload button.
        reload: PropTypes.func, // Optional, default is () => {}
        reloadText: PropTypes.string,
        addSite: PropTypes.func,
        showReloadButton: PropTypes.bool, // Optional, default is true.
    };

    static defaultProps = {
        reloadText: 'Reload',
        showReloadButton: true,
    };

    render() {
        const {
            containerStyles,
            reload,
            textStyles,
            buttonStyles,
            textButtonStyles,
            emptyText,
            reloadText,
            addSite,
            isEmpty
        } = this.props;
        return (<View style={[styles.container, containerStyles]}>
            <Text style={[styles.textButton, textStyles]}>
                {emptyText}
            </Text>
            <TouchableOpacity
                    style={[styles.button, buttonStyles]}
                    activeOpacity={0.7}
                    onPress={() => isEmpty ? addSite() : reload()}
                >
                    <Text style={[styles.textButton, textButtonStyles]}>
                        {reloadText}
                    </Text>
                </TouchableOpacity>
        </View>);
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: '#959595',
        textAlign: 'center',
        margin: 15,
    },
    button: {
        backgroundColor: Colors.buttonBgColor,
        borderRadius: 3,
        height: 50,
        width: 240,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 100
    },
    textButton: {
        color: Colors.white,
        fontSize:16,
    }
});