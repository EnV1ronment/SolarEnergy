import React, {Component} from 'react';
import {Text, StyleSheet} from 'react-native';
import WKGeneralBackground from "../../../../Common/Components/WKGeneralBackground";
import {online} from '../../../../../app';
import {WebView} from 'react-native-webview';

export default class PrivacyPage extends Component {

    static navigationOptions = {
        headerTitle: <Text style={{color: Colors.white, fontSize: 16}}>
            {WK_T(wkLanguageKeys.wanke_policy_title)}
        </Text>,
    };

    render() {
        return (
            <WKGeneralBackground showSunshine={false}>
                <WebView
                    style={styles.webview}
                    useWebKit={true}
                    // startInLoadingState={true} // If true, bug: vertical scroll indicator is displayed in the middle on iPhone X.
                    source={{uri: online + '/login/privacy/policy'}}
                />
            </WKGeneralBackground>
        );
    }

};

const styles = StyleSheet.create({
    webview: {
        flex: 1,
        backgroundColor: Colors.white,
    },
});