import React, {Component} from 'react';
import {Keyboard, TouchableOpacity, DeviceEventEmitter} from 'react-native';
import WKGeneralBackground from "../../../../Common/Components/WKGeneralBackground";
import RegisterItem from "../../../Login/Register/Components/RegisterItem";
import WKNavigationBarRightItem from "../../../../Common/Components/WKNavigationBarRightItem";
import WKFetch from "../../../../Network/WKFetch";
import WKPresenter from "../../../../Common/Components/WKPresenter";
import WKNavigationBarLeftItem from "../../../../Common/Components/WKNavigationBarLeftItem";

export default class AddStationPage extends Component {

    state = {
        stationName: '',
        visible: false
    };

    static navigationOptions = ({navigation}) => {
        return {
            title: WK_T(wkLanguageKeys.new_station),
            headerLeft: <WKNavigationBarLeftItem
                click={navigation.getParam('goBack')}
            />,
            headerRight: <WKNavigationBarRightItem
                value={WK_T(wkLanguageKeys.done)}
                click={navigation.getParam('done')}
            />
        };
    };

    componentDidMount() {
        const {navigation} = this.props;
        navigation.setParams({goBack: this._pop});
        navigation.setParams({done: this._done});
    }

    _hideKeyboard = () => Keyboard.dismiss();

    _pop = () => {
        const {stationName} = this.state;
        const {navigation} = this.props;
        if (!stationName.trim()) {
            navigation.goBack();
            return;
        }
        this.setState({
            visible: true
        });
    };

    _done = () => {
        this._hideKeyboard();
        let {stationName} = this.state;
        stationName = stationName.trim();

        const {navigation} = this.props;
        const {state} = navigation;
        const {params} = state;
        const {stations, callback} = params;

        if (stations.some(({title}) => title === stationName)) {
            WKToast.show(WK_T(wkLanguageKeys.station_already_exists));
            return;
        }

        if (!stationName) {
            WKToast.show(WK_T(wkLanguageKeys.empty_station_name));
            return;
        }

        const data = {
            title: stationName
        };
        WKLoading.show();
        WKFetch('/station', data, METHOD.POST).then(ret => {
            WKLoading.hide();
            if (!ret.ok) {
                WKToast.show(ret.errorMsg);
                return;
            }
            DeviceEventEmitter.emit(EmitterEvents.ADD_STATION_SUCCESS);
            callback();
            navigation.goBack();
        });
    };

    _onChangeText = (text) => {
        this.setState({stationName: text});
    };

    _hideModal = () => {
        this.setState({
            visible: false
        });
    };

    _goBack = () => {
        this._hideKeyboard();
        this._hideModal();
        const {navigation} = this.props;
        navigation && navigation.goBack();
    };

    render() {
        const {stationName} = this.state;
        return (<WKGeneralBackground>
            <TouchableOpacity
                style={{flex: 1}}
                activeOpacity={1}
                onPress={this._hideKeyboard}
            >
                <RegisterItem
                    autoFocus={true}
                    marginTop={25}
                    leftValue={WK_T(wkLanguageKeys.station_name)}
                    value={stationName}
                    placeholderText={WK_T(wkLanguageKeys.enter_station_name)}
                    onChangeText={this._onChangeText}
                    leftValueWidth={100}
                    leftValueBorderRightWidth={0}
                    hideAsterisk={false}
                />
            </TouchableOpacity>
            <WKPresenter
                visible={this.state.visible}
                message={WK_T(wkLanguageKeys.quit_not_save)}
                leftButtonClick={this._hideModal}
                leftButtonText={WK_T(wkLanguageKeys.cancel)}
                defaultButtonText={WK_T(wkLanguageKeys.confirm)}
                defaultButtonClick={this._goBack}
            />
        </WKGeneralBackground>);
    }

}
