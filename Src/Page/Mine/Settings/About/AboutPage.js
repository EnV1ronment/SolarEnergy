import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
} from 'react-native';
import WKGeneralBackground from "../../../../Common/Components/WKGeneralBackground";
import app_icon_60 from '../../../../Source/Common/app_icon_60.png';
import {appVersion} from '../../../../../app';

export default class AboutPage extends Component {

    static navigationOptions = () => ({title: WK_T(wkLanguageKeys.about)});

    render() {
        return (<WKGeneralBackground>
            <View style={styles.top}>
                <Image
                    source={app_icon_60}
                    style={styles.appIcon}
                />
                <Text style={styles.version}>
                    {WK_T(wkLanguageKeys.version)} {appVersion}
                </Text>
            </View>
            <View style={styles.bottom}>
                <Text style={styles.copyright}>
                    Copyright © 2018 Wanke Energy Technology Co. LTD All Rights Reserved.
                </Text>
            </View>
        </WKGeneralBackground>);
    }

}

const styles = StyleSheet.create({
    top: {
        flex: 1,
        alignItems: 'center',
        marginTop: 100,
    },
    appIcon: {
        width: 60,
        height: 60,
    },
    version: {
        color: 'white',
        marginTop: 15
    },
    bottom: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    copyright: {
        color: 'white',
        marginTop: 15,
        marginBottom: 65,
        marginLeft: 15,
        marginRight: 15,
        textAlign: 'center',
    },
});
