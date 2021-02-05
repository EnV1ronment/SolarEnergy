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
        showReloadButton: PropTypes.bool, // Optional, default is true.
    };

    static defaultProps = {
        reloadText: 'Reload',
        showReloadButton: true,
    };

    render() {
        const {
            containerStyles,
            emptyTextStyles,
            reload,
            reloadTextStyles,
            reloadTextButtonStyles,
            emptyText,
            reloadText,
            showReloadButton,
        } = this.props;
        const isEmpty = !!!emptyText.length;
        if (isEmpty) return null;
        return (<View style={[styles.container, containerStyles]}>
            {
                showReloadButton && <TouchableOpacity
                    style={[styles.reloadBtn, reloadTextButtonStyles]}
                    activeOpacity={0.7}
                    onPress={() => reload && reload()}
                >
                    <Text style={[styles.reloadText, reloadTextStyles]}>
                        {reloadText}
                    </Text>
                </TouchableOpacity>
            }
            <Text style={[styles.emptyText, emptyTextStyles]}>
                {emptyText}
            </Text>
        </View>);
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f2f4',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: '#959595',
        textAlign: 'center',
        margin: 15,
    },
    reloadBtn: {
        backgroundColor: '#00a6ff',
        borderRadius: 3,
    },
    reloadText: {
        color: Colors.white,
        padding: 10,
        paddingLeft: 18,
        paddingRight: 18,
    }
});