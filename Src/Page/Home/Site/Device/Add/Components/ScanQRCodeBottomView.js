import React, {PureComponent} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image
} from "react-native";
import PropTypes from 'prop-types';
import me_manual_icon from '../../../../../../Source/Me/me_manual_icon.png';
import me_torch_icon from '../../../../../../Source/Me/me_torch_icon.png';

export default class ScanQRCodeBottomView extends PureComponent {

    static propTypes = {
        enterSNCode: PropTypes.func.isRequired,
        openTorch: PropTypes.func.isRequired
    };

    _enterSNCode = () => {
        const {enterSNCode} = this.props;
        enterSNCode && enterSNCode();
    };

    _openTorch = () => {
        const {openTorch} = this.props;
        openTorch && openTorch();
    };

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.7}
                    onPress={this._enterSNCode}
                >
                    <View  style={styles.iconBg}>
                        <Image source={me_manual_icon} style={styles.snIcon}/>
                    </View>
                    <Text style={styles.text}>{WK_T(wkLanguageKeys.enter_manually)}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.7}
                    onPress={this._openTorch}
                >
                    <View  style={styles.iconBg}>
                       <Image source={me_torch_icon} style={styles.torch}/>
                    </View>
                    <Text style={styles.text}>{WK_T(wkLanguageKeys.flashlight)}</Text>
                </TouchableOpacity>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        height: 80 + __iosSafeAreaBottomHeight__,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    button: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center'
    },
    snIcon: {
        width: 21,
        height: 21
    },
    iconBg:{
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.blue,
    },
    torch: {
        width: 15,
        height: 21
    },
    text: {
        marginTop: 10,
        color: Colors.white,
        fontSize: 16
    }
});
