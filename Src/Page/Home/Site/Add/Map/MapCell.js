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
            title,
            detail,
            click,
        } = this.props;
        return (
            <TouchableOpacity style={[styles.container, {height}]} activeOpacity={0.8} onPress={click}>
                <View style={styles.titleView}>
                    <Image source={site_location} resizeMode='contain'/>
                    <Text style={styles.title} numberOfLines={1}>{title}</Text>
                </View>
                <Text style={styles.detail} numberOfLines={2}>{detail}</Text>
            </TouchableOpacity>
        );
    }
}

MapCell.propTypes = {
    height: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    detail: PropTypes.string.isRequired,
    click: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        paddingLeft: 15,
    },
    titleView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        marginLeft: 5,
        marginRight: 10,
        fontSize: 14,
        color: Colors.buttonBgColor,
    },
    detail: {
        marginLeft: 15,
        fontSize: 12,
        marginRight: 10,
        color: Colors.placeholder,
        marginTop: 4,
    },
});

export default MapCell;