import React, {PureComponent} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import site_location from '../../../../../Source/Status/site_location.png';

class MapCell extends PureComponent {
    render() {
        const {
            height,
            click,
        } = this.props;
        return (
            <TouchableOpacity style={[styles.container, {height}]} activeOpacity={0.8} onPress={click}>
                <View style={styles.view}>
                    <Image style={styles.imageView} source={site_location} resizeMode='contain'/>
                </View>
            </TouchableOpacity>
        );
    }
}

MapCell.propTypes = {
    height: PropTypes.number.isRequired,
    click: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
    container: {
        width: 60,
        height: 60,
        marginLeft: 30,
        marginBottom: 30,
        borderRadius: 5,
        backgroundColor: Colors.theme
    },
    view: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
    },
    imageView: {
        width: 30,
        height: 30,
    }
});

export default MapCell;