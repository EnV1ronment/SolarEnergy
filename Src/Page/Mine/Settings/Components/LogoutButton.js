import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    ImageBackground,
    TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

// Icons
import me_logout_icon from "../../../../Source/Me/me_logout_icon.png";

const logoutButton = ({height, click}) => (
    <View style={[styles.container, {height}]}>
        <TouchableOpacity
            onPress={click}
            activeOpacity={0.6}
        >
            <ImageBackground
                resizeMode='stretch'
                style={styles.bg}
                source={me_logout_icon}
            >
                <Text style={styles.text}>
                    {WK_T(wkLanguageKeys.log_out)}
                </Text>
            </ImageBackground>
        </TouchableOpacity>
    </View>
);

logoutButton.propTypes = {
    click: PropTypes.func.isRequired,
    height: PropTypes.number.isRequired,
};

export default logoutButton;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: iosSafeAreaBottomHeight + 130,
    },
    bg: {
        width: 250,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: Colors.white,
        fontSize: 14,
    }
});
