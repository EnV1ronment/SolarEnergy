import React, {PureComponent} from 'react';
import {
    View,
    Image,
    StyleSheet,
} from 'react-native';
import sunshine from "../../Source/Register/register_sunshine.png";
import PropTypes from 'prop-types';

export default class WKGeneralBackground extends PureComponent {

    static propTypes = {
        showSunshine: PropTypes.bool,
        backgroundColor: PropTypes.string, // BackgroundColor for container
    };

    static defaultProps = {
        showSunshine: true,
        backgroundColor: Colors.theme,
    };

    render() {
        const {
            backgroundColor,
            children,
            showSunshine,
        } = this.props;
        return (<View style={[styles.container, {backgroundColor}]}>
            {children}
            {showSunshine && <View
                style={styles.imageWrapper}
                pointerEvents={'none'} // Dispatch events to super components
            >
                <Image
                    source={sunshine}
                    style={styles.image}
                />
            </View>}
        </View>);
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageWrapper: {
        position: 'absolute',
        width: __SCREEN_WIDTH__,
        alignItems: 'center'
    },
    image: {
        width: adaptWidth(160),
        resizeMode: 'stretch',
        alignSelf: 'center'
    }
});
