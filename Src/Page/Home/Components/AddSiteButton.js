import React from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import add_site_btn from '../../../Source/Status/add_site_btn.png';

const AddSiteButton = ({addSite}) => {
    return <View style={styles.container}>
        <TouchableOpacity
            onPress={addSite}
            style={styles.btn}>
            <Image source={add_site_btn} style={styles.image}/>
        </TouchableOpacity>
    </View>;
};

AddSiteButton.propTypes = {
    addSite: PropTypes.func.isRequired,
};

export default AddSiteButton;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    btn: {
        alignSelf: 'flex-end',
        marginTop: 5,
        width: 50,
        height: 50,
        paddingLeft: 5,
        paddingBottom: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 35,
        height: 35,
    },
});
