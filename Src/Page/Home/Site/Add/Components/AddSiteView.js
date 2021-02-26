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
    'Site Name:',
    'Site Address:',
    'Solar Capacity:',
    'TimeZone:',
    'Photo:',
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
    };

    state = {
        title: this.props.title,
    };

    _save = () => {
        const {sn, address, save} = this.props;
        const {title} = this.state;
        const params = {
            sn,
            title,
            address,
        };
        save(params);
    };

    _onChangeText = title => {
        const t = title.substr(0, 64);
        this.setState({title: t});
        this.props.onChangeText(t);
    };

    // Fix bug: the whitespace doesn't show until entering another character.
    _replaceSpace = str => str.replace(/\u0020/, '\u00a0');

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
                            placeholder={'Please enter site title'}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            secureTextEntry={false}
                            returnKeyType={'done'}
                            // contextMenuHidden={true} // Disable copy and paste
                            onChangeText={this._onChangeText}
                        />
                        <TouchableOpacity
                            style={styles.clearButton}
                            disabled={!!!this.state.title}
                            onPress={() => this.setState({title: ''})}
                        >
                            <Image source={icons[1]} resizeMode='contain'/>
                        </TouchableOpacity>
                    </View>
                </View>
                
                <View style={styles.container}>
                    <Text style={styles.title}>{titles[1]}</Text>
                    <TouchableOpacity
                        style={styles.scanButton}
                        activeOpacity={0.8}
                        onPress={this.props.startLocation}
                    >
                        <Text style={[styles.scanText]} numberOfLines={5}>
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
                            style={styles.textInput}
                            maxLength={10000}
                            value={this._replaceSpace(this.state.title)}
                            placeholder={'Please enter site title'}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            secureTextEntry={false}
                            returnKeyType={'done'}
                            // contextMenuHidden={true} // Disable copy and paste
                            onChangeText={this._onChangeText}
                        />
                        <TouchableOpacity
                            style={styles.clearButton}
                            disabled={!!!this.state.title}
                            onPress={() => this.setState({title: ''})}
                        >
                            <Image source={icons[1]} resizeMode='contain'/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[styles.container, {paddingTop: 0, paddingBottom: 0}]}>
                    <Text style={[styles.title, {alignSelf: 'center'}]}>{titles[3]}</Text>
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
                            placeholder={'Please enter site title'}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            secureTextEntry={false}
                            returnKeyType={'done'}
                            // contextMenuHidden={true} // Disable copy and paste
                            onChangeText={this._onChangeText}
                        />
                        <TouchableOpacity
                            style={styles.clearButton}
                            disabled={!!!this.state.title}
                            onPress={() => this.setState({title: ''})}
                        >
                            <Image source={icons[1]} resizeMode='contain'/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[styles.container, {paddingTop: 0, paddingBottom: 0}]}>
                    <Text style={[styles.title, {alignSelf: 'center'}]}>{titles[4]}</Text>
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
                            placeholder={'Please enter site title'}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            secureTextEntry={false}
                            returnKeyType={'done'}
                            // contextMenuHidden={true} // Disable copy and paste
                            onChangeText={this._onChangeText}
                        />
                        <TouchableOpacity
                            style={styles.clearButton}
                            disabled={!!!this.state.title}
                            onPress={() => this.setState({title: ''})}
                        >
                            <Image source={icons[1]} resizeMode='contain'/>
                        </TouchableOpacity>
                    </View>
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
        borderRadius: 3,
        borderWidth: 0.5,
        borderColor: "#00a6ff",
        paddingTop: 12,
        paddingBottom: 12,
    },

    // Device SN and Site Location styles
    title: {
        fontSize: 14,
        color: "#ffffff",
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
        fontSize: 13,
        color: "#999999",
        marginRight: 5,
    },

    // Site title row styles
    textInput: {
        flex: 1,
        height: 40,
        fontSize: 12,
        marginLeft: 5,
        color: Colors.white,
        marginRight: 5,
        textAlign: 'right',
        paddingVertical: 0, // make text show whole on Android
    },
    clearButton: {
        paddingRight: 15,
        height: 40,
        justifyContent: 'center',
    },

    // Bottom button
    bottomButtonContainer: {
        position: 'absolute',
        height: 150,
        width: SCREEN_WIDTH,
        bottom: 81 + iosSafeAreaBottomHeight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomButton: {
        borderRadius: 100,
        backgroundColor: "#237cfe",
    },
    bottomButtonText: {
        fontSize: 13,
        color: "#ffffff",
        padding: 100,
        paddingTop: 13,
        paddingBottom: 13,
    },
});

export default AddSiteView;