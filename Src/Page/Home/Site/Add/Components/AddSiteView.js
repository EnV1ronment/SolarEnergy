import React, {Component} from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import PropTypes from 'prop-types';
import site_qr_code_scan from '../../../../../Source/Status/site_qr_code_scan.png';
import site_location from '../../../../../Source/Status/site_location.png';
import site_title_delete from '../../../../../Source/Status/site_title_delete.png';

const titles = [
    'Site Name :',
    'Site Address :',
    'Solar Capacity :',
    'Time zone :',
    'Photo :',
];

const icons = [
    site_qr_code_scan,
    site_title_delete,
    site_location,
];

class AddSiteView extends Component {

    static propTypes = {
        sn: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
        scanQRCode: PropTypes.func.isRequired,
        startLocation: PropTypes.func.isRequired,
        save: PropTypes.func.isRequired,
        onChangeText: PropTypes.func.isRequired,
        selectTimeZone: PropTypes.func.isRequired,
    };

    state = {
        title: this.props.title,
        address: this.props.address,
        capacity: this.props.capacity,
        timezone: this.props.timezone ?? '',
    };

    _save = () => {
        const {address, save} = this.props;
        const {title, capacity, timezone} = this.state;
        const params = {
            title,
            address,
            capacity,
            timezone
        };
        save(params);
    };

    _onChangeText = (value, key) => {
        const t = value.substr(0, 64);
        this.setState({[key]: t});
        this.props.onChangeText({[key]: t});
    };

    _getTimeZone = (timezone) => {
        if (timezone !== ''){
            const t = timezone.replaceAll("/","_") ;
            if(typeof WK_T(wkLanguageKeys[t]) !== 'undefined'){
                return WK_T(wkLanguageKeys[t]);
            }
        }
        return '';
    };

    // Fix bug: the whitespace doesn't show until entering another character.
    _replaceSpace = str => str.replace(/\u0020/, '\u00a0');

    _addUnit = str => this.setState({capacity: str.length ? str + ' kWp' : str});

    _removeUnit = str => this.setState({capacity: str.replace(/ kWp/g, "")});
    
    render() {
        return (
            <>
                    <View style={[styles.container, {paddingTop: 0, paddingBottom: 0}]}>
                    <Text style={[styles.title, {alignSelf: 'center'}]}>{titles[0]}</Text>
                    <View style={[styles.scanButton, {
                        paddingTop: 0,
                        paddingBottom: 0,
                        paddingRight: 0,
                    }]}>
                        <TextInput
                             keyboardType={'default'}
                             placeholderTextColor={Colors.placeholder}
                             selectionColor={Colors.white}
                             autoFocus={false}
                             style={styles.textInput}
                             maxLength={10000}
                             value={this._replaceSpace(this.state.title)}
                             placeholder={'Please enter site name'}
                             autoCapitalize={'none'}
                             autoCorrect={false}
                             secureTextEntry={false}
                             returnKeyType={'done'}
                             // contextMenuHidden={true} // Disable copy and paste
                            onChangeText={(e) => this._onChangeText(e, 'title')}
                        />
                        {!!this.state.title.length && <TouchableOpacity
                            style={styles.clearButton}
                            disabled={!!!this.state.title}
                            onPress={() => this.setState({title: ''})}
                        >
                            <Image source={icons[1]} resizeMode='contain'/>
                        </TouchableOpacity>}
                    </View>
                </View>
                <View style={styles.container}>
                    <Text style={styles.title}>{titles[1]}</Text>
                    <TouchableOpacity
                        style={styles.scanButton}
                        activeOpacity={0.8}
                        onPress={this.props.startLocation}
                    >
                        <Text style={[styles.scanText]} numberOfLines={1}>
                            {this.props.address}
                        </Text>
                        <Image source={icons[2]} resizeMode='contain'/>
                    </TouchableOpacity>
                </View>
                <View style={[styles.container, {paddingTop: 0, paddingBottom: 0}]}>
                    <Text style={[styles.title, {alignSelf: 'center'}]}>{titles[2]}</Text>
                    <View style={[styles.scanButton, {
                        paddingTop: 0,
                        paddingBottom: 0,
                        paddingRight: 0,
                    }]}>
                        <TextInput
                            keyboardType={'default'}
                            placeholderTextColor={Colors.placeholder}
                            selectionColor={Colors.white}
                            autoFocus={false}
                            value={this.state.capacity}
                            style={styles.textInput}
                            maxLength={10000}
                            onFocus={() => this._removeUnit(this.state.capacity)}
                            onBlur={() => this._addUnit(this.state.capacity)}
                            placeholder={'Please enter solar capacity'}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            secureTextEntry={false}
                            returnKeyType={'done'}
                            // contextMenuHidden={true} // Disable copy and paste
                            onChangeText={(e) => this._onChangeText(e, 'capacity')}
                        />
                       {!!this.state.capacity.length && <TouchableOpacity
                            style={styles.clearButton}
                            disabled={!!!this.state.capacity}
                            onPress={() => this.setState({capacity: ''})}
                        >
                            <Image source={icons[1]} resizeMode='contain'/>
                        </TouchableOpacity>}
                    </View>
                </View>
                <View style={styles.container}>
                    <Text style={styles.title}>{titles[3]}</Text>
                    <TouchableOpacity
                        style={styles.scanButton}
                        activeOpacity={0.8}
                        onPress={this.props.selectTimeZone}
                    >
                        <Text style={[styles.scanText]} numberOfLines={1}>
                            {this._getTimeZone(this.props.timezone)}
                        </Text>
                        <Image source={icons[2]} resizeMode='contain'/>
                    </TouchableOpacity>
                </View>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={{height: 300}}/>
                </TouchableWithoutFeedback>
                <View style={styles.bottomButtonContainer}>
                    <TouchableOpacity
                        style={styles.bottomButton}
                        onPress={this._save}
                        activeOpacity={0.5}
                    >
                        <Text style={styles.bottomButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
        margin: 10,
        marginBottom: 5,
        marginTop: 10,
        paddingTop: 12,
        paddingBottom: 12,
    },

    // Device SN and Site Location styles
    title: {
        width: 120,
        fontSize: 16,
        color: Colors.cellFontColor,
    },
    scanButton: {
        flex: 1,
        paddingRight: 15,
        flexDirection: 'row',
        paddingLeft: 15,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    scanText: {
        fontSize: 16,
        color: "#999999",
        marginRight: 5,
    },

    // Site title row styles
    textInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
        marginLeft: 5,
        color: Colors.white,
        marginRight: 5,
        paddingVertical: 0, // make text show whole on Android
    },
    clearButton: {
        paddingRight: 15,
        height: 40,
        justifyContent: 'center',
    },

    // Bottom button
    bottomButtonContainer: {
        height: 150,
        width: SCREEN_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 81 + iosSafeAreaBottomHeight,
    },
    bottomButton: {
        backgroundColor: Colors.buttonBgColor,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        width: 240,
    },
    bottomButtonText: {
        color: Colors.white,
        fontSize:16,
    },
});

export default AddSiteView;