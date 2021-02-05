import React, {PureComponent} from 'react';
import {ImageBackground, StyleSheet, Text, View} from "react-native";
import PropTypes from 'prop-types';
import site_status_bgImage1 from '../../../../../Source/Status/site_status_bgImage1.png';
import site_status_bgImage2 from '../../../../../Source/Status/site_status_bgImage2.png';
import site_status_bgImage3 from '../../../../../Source/Status/site_status_bgImage3.png';
import site_status_bgImage4 from '../../../../../Source/Status/site_status_bgImage4.png';
import site_status_bgImage5 from '../../../../../Source/Status/site_status_bgImage5.png';
import site_status_bgImage6 from '../../../../../Source/Status/site_status_bgImage6.png';
import site_status_bgImage7 from '../../../../../Source/Status/site_status_bgImage7.png';
import site_status_bgImage8 from '../../../../../Source/Status/site_status_bgImage8.png';
import site_status_bgImage9 from '../../../../../Source/Status/site_status_bgImage9.png';

class TopView extends PureComponent {

    _getBgImage = () => {
        const {
            batteryValue,
            gridValue,
        } = this.props;

        if (typeof gridValue !== 'string'
            || typeof batteryValue !== 'string'
            || !gridValue.length
            | !batteryValue.length) {
            return site_status_bgImage1;
        }
        const gridFirstCharacter = gridValue.substr(0, 1);
        const batteryFirstCharacter = batteryValue.substr(0, 1);
        switch (gridFirstCharacter) {
            case '-': // < 0
                switch (batteryFirstCharacter) {
                    case '-':
                        return site_status_bgImage2;
                    case '0':
                        return site_status_bgImage3;
                    default:
                        return site_status_bgImage1;
                }
            case '0': // = 0
                switch (batteryFirstCharacter) {
                    case '-':
                        return site_status_bgImage8;
                    case '0':
                        return site_status_bgImage9;
                    default:
                        return site_status_bgImage7;
                }
            default: // > 0
                switch (batteryFirstCharacter) {
                    case '-':
                        return site_status_bgImage5;
                    case '0':
                        return site_status_bgImage6;
                    default:
                        return site_status_bgImage4;
                }
        }
    };

    render() {
        const {
            pvTitle,
            gridTitle,
            homeTitle,
            batteryTitle,
            batteryValue,
            pvValue,
            gridValue,
            homeValue,
        } = this.props;
        return (
            <ImageBackground
                source={this._getBgImage()}
                style={styles.bgImage}
                resizeMode='contain'
            >
                <View style={styles.topContainer}>
                    <View style={styles.topView}>
                        <Text
                            style={styles.pvWhiteText}
                            numberOfLines={2}>
                            {pvValue}
                        </Text>
                        <Text style={styles.pvGrayText}>{pvTitle}</Text>
                    </View>
                    <View style={styles.bottomView}>
                        <Text
                            style={styles.pvWhiteText}
                            numberOfLines={2}>
                            {gridValue}
                        </Text>
                        <Text style={styles.pvGrayText}>{gridTitle}</Text>
                    </View>
                </View>
                <View style={styles.bottomContainer}>
                    <View style={styles.topView}>
                        <Text
                            style={styles.pvWhiteText}
                            numberOfLines={2}>
                            {homeValue}
                        </Text>
                        <Text style={styles.pvGrayText}>{homeTitle}</Text>
                    </View>
                    <View style={styles.bottomView}>
                        <Text
                            style={styles.pvWhiteText}
                            numberOfLines={2}>
                            {batteryValue}
                        </Text>
                        <Text style={styles.pvGrayText}>{batteryTitle}</Text>
                    </View>
                </View>
            </ImageBackground>
        );
    }

}

TopView.propTypes = {
    pvValue: PropTypes.string.isRequired,
    pvTitle: PropTypes.string.isRequired,
    gridValue: PropTypes.string.isRequired,
    gridTitle: PropTypes.string.isRequired,
    homeValue: PropTypes.string.isRequired,
    homeTitle: PropTypes.string.isRequired,
    batteryValue: PropTypes.string.isRequired,
    batteryTitle: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
    bgImage: {
        margin: 5,
        marginBottom: 0,
        height: __isIphoneX__ ? 320 : 264,
        borderWidth: 0.5,
        borderColor: '#1a5578',
        // borderColor: '#07296d',
    },
    topContainer: {
        flexDirection: 'row',
        marginTop: __isIphoneX__ ? 90 : 60,
        marginLeft: SCREEN_WIDTH * 0.16,
        maxWidth: SCREEN_WIDTH * 0.68,
    },
    bottomContainer: {
        position: 'absolute',
        flexDirection: 'row',
        marginTop: __isIphoneX__ ? 200 : 170,
        marginLeft: SCREEN_WIDTH * 0.16,
        maxWidth: SCREEN_WIDTH * 0.68,
    },
    topView: {
        flex: 1,
    },
    bottomView: {
        flex: 1,
        alignItems: 'flex-end',
        paddingRight: 10,
    },
    pvWhiteText: {
        fontSize: 15,
        color: "#fff",
    },
    pvGrayText: {
        fontSize: 12,
        color: "#576080",
    },
});

export default TopView;