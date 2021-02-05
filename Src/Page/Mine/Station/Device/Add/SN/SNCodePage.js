import React, {Component} from 'react';
import {
    Keyboard,
    StyleSheet,
    TouchableOpacity,
    Text,
    DeviceEventEmitter
} from "react-native";
import WKGeneralBackground from "../../../../../../Common/Components/WKGeneralBackground";
import WKNavigationBarRightItem from "../../../../../../Common/Components/WKNavigationBarRightItem";
import RegisterItem from "../../../../../Login/Register/Components/RegisterItem";
import register_password_icon from "../../../../../../Source/Register/register_password_icon.png";
import WKFetch from "../../../../../../Network/WKFetch";
import WKNavigationBarLeftItem from "../../../../../../Common/Components/WKNavigationBarLeftItem";

export default class SNCodePage extends Component {

    constructor(props) {
        super(props);
        const {navigation} = props;
        const {state} = navigation;
        const {params} = state;
        const {
            stationId,
            stationCode
        } = params;
        this.state = {
            snCode: '',
            stationId: stationId,
            stationCode: stationCode
        };
    }

    static navigationOptions = ({navigation}) => {
        return {
            title: WK_T(wkLanguageKeys.sn_code),
            gesturesEnabled: false,
            headerLeft: <WKNavigationBarLeftItem click={navigation.getParam('goBack')}/>,
            headerRight: <WKNavigationBarRightItem
                value={WK_T(wkLanguageKeys.done)}
                click={navigation.getParam('finish')}
            />
        };
    };

    componentDidMount() {
        const {navigation} = this.props;
        navigation.setParams({finish: this._finish});
        navigation.setParams({goBack: this._goBack})
    }

    _hideKeyboard = () => {
        Keyboard.dismiss();
    };

    _goBack = () => {
        const {navigation} = this.props;
        const callback = navigation.getParam('callback');
        callback && callback();
        navigation.goBack();
    };

    _finish = () => {
        this._hideKeyboard();
        const {navigation} = this.props;
        const callback = navigation.getParam('callback');
        const {snCode} = this.state;
        if (!snCode) {
            WKToast.show(WK_T(wkLanguageKeys.enter_snCode));
            return;
        }
        callback && callback(snCode);
        navigation.navigate(RouteKeys.AddSitePage);

        // const {
        //     snCode,
        //     stationId,
        //     stationCode
        // } = this.state;
        //
        // if (!snCode) {
        //     WKToast.show(WK_T(wkLanguageKeys.enter_snCode));
        //     return;
        // }
        //
        // const data = {
        //     stationId,
        //     stationCode
        // };
        // WKLoading.show(WK_T(wkLanguageKeys.adding));
        // WKFetch(`/station/device/${snCode}`, data, METHOD.POST).then(ret => {
        //     WKLoading.hide();
        //     if (!ret.ok) {
        //         WKToast.show(ret.errorMsg);
        //         return;
        //     }
        //     WKToast.show(WK_T(wkLanguageKeys.add_successfully));
        //     DeviceEventEmitter.emit(EmitterEvents.ADD_DEVICE_SUCCESS);
        //     const {navigation} = this.props;
        //     const isFromHomePage = navigation.getParam('isFromHomePage', false);
        //     if (isFromHomePage) {
        //         navigation.popToTop();
        //     } else {
        //         navigation.navigate(RouteKeys.DevicePage);
        //     }
        // });
    };

    _onChangeText = (snCode) => {
        this.setState({
            snCode: snCode.trim(),
        });
    };

    render() {
        return (
            <WKGeneralBackground>
                <TouchableOpacity
                    style={styles.container}
                    activeOpacity={1}
                    onPress={this._hideKeyboard}
                >
                    <RegisterItem
                        marginTop={25}
                        leftValue={register_password_icon}
                        autoFocus={true}
                        value={this.state.snCode}
                        placeholderText={WK_T(wkLanguageKeys.enter_snCode)}
                        onChangeText={this._onChangeText}
                    />
                    <Text style={{
                        margin: 10,
                        fontSize: 12,
                        color: Colors.placeholder
                    }}>{WK_T(wkLanguageKeys.confirm_snCode)}</Text>
                </TouchableOpacity>
            </WKGeneralBackground>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
