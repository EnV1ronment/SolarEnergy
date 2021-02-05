import React, {Component} from 'react';
import {
    View,
    TouchableOpacity,
    ScrollView,
    Image,
    Text,
    DeviceEventEmitter,
} from 'react-native';
import WKGeneralBackground from "../../../../Common/Components/WKGeneralBackground";
import Languages from '../../../../Common/MultiLanguage/Languages';
import check_mark from '../../../../Source/Me/check_mark.png';
import LanguageCache from "../../../../Common/MultiLanguage/Model/LanguageCache";
import styles from './styles';

export default class LanguagePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedLanguage: WK_GetCurrentLocale(),
        };
    }

    static navigationOptions = () => ({title: WK_T(wkLanguageKeys.language)});

    componentWillUnmount() {
        this._clearTimerOut();
    }

    _clearTimerOut = () => {
        this.timer && clearTimeout(this.timer);
    };

    _setLanguage = (key) => {
        const {selectedLanguage} = this.state;
        const hasNoChange = selectedLanguage === key;
        if (hasNoChange) {
            return;
        }
        this.setState({selectedLanguage: key});
        WKLoading.show();
        this.timer = setTimeout(() => {
            this._clearTimerOut();
            LanguageCache.setLanguageCache(key);
            WK_SL(key);
            WKLoading.hide();
            DeviceEventEmitter.emit(EmitterEvents.MULTI_LANGUAGE);
        }, 300);
    };

    _renderSubviews = () => {
        const {selectedLanguage} = this.state;
        const languages = Object.keys(Languages).reverse();
        return languages.map(key => {
            const showCheckMark = selectedLanguage === key;
            return (<View key={key}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => this._setLanguage(key)}
                >
                    <Text style={styles.text}>{Languages[key]}</Text>
                    {showCheckMark && <Image source={check_mark} style={styles.checkMark}/>}
                </TouchableOpacity>
                <View style={styles.bottomLine}/>
            </View>);
        });
    };

    render() {
        return (<WKGeneralBackground>
            <ScrollView style={styles.container}>
                {this._renderSubviews()}
            </ScrollView>
        </WKGeneralBackground>);
    }
}
