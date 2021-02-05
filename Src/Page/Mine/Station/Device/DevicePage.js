import React, {Component} from 'react';
import {DeviceEventEmitter} from 'react-native';
import WKGeneralBackground from "../../../../Common/Components/WKGeneralBackground";
import StationView from "../Components/StationView";
import WKSearchBar from "../../../../Common/Components/WKSearchBar";
import WKRegExp from "../../../../Utils/WKRegExp";
import me_station_add from "../../../../Source/Me/me_station_add.png";
import WKNavigationBarRightItem from "../../../../Common/Components/WKNavigationBarRightItem";
import WKFetch from "../../../../Network/WKFetch";
import WKPresenter from "../../../../Common/Components/WKPresenter";

export default class DevicePage extends Component {

    constructor(props) {
        super(props);
        const {navigation} = props;
        const {state} = navigation;
        const {params} = state;
        const {id, code} = params;
        this.state = {
            data: [],
            originData: [],
            emptyText: '',
            stationId: id,
            stationCode: code,
            visible: false,
            deletedIndex: 0,
            savedSearchText: ''
        };
    }

    static navigationOptions = ({navigation}) => {
        return {
            title: WK_T(wkLanguageKeys.device),
            headerRight: <WKNavigationBarRightItem
                value={me_station_add}
                click={navigation.getParam('addDevice')}
            />
        };
    };

    componentDidMount() {
        const {navigation} = this.props;
        navigation.setParams({addDevice: this._addDevice});
        this._loadDeviceList();
        this._addObserver();
    }

    componentWillUnmount() {
        this._removeObserver();
    }

    _addObserver = () => {
        this.listener = DeviceEventEmitter.addListener(EmitterEvents.ADD_DEVICE_SUCCESS, () => this._loadDeviceList(false));
    };

    _removeObserver = () => this.listener && this.listener.remove();

    _loadDeviceList = (loading = true, tipMsg = '') => {
        const {
            stationId,
            stationCode
        } = this.state;
        const data = {
            stationId,
            stationCode
        };
        loading && WKLoading.show();
        WKFetch('/station/device', data).then(ret => {
            WKLoading.hide();
            const {ok, errorMsg, data} = ret;
            if (!ok) {
                this.setState({
                    data: [],
                    emptyText: errorMsg
                });
                this._setOriginData();
                return;
            }
            if (data
                && data.results
                && Array.isArray(data.results)
                && data.results.length
            ) {
                WKToast.show(tipMsg);
                this._setOriginData(data.results);
                this.setState({
                    data: data.results
                }, () => {
                    if (this.state.savedSearchText.trim()) {
                        this._search(this.state.savedSearchText);
                    }
                });
            } else {
                this._setOriginData();
                this.setState({
                    data: [],
                    emptyText: `${WK_T(wkLanguageKeys.no_device)}_`
                });
            }
        });
    };

    _setOriginData = (data = []) => {
        this.state.originData = data;
    };

    _addDevice = () => {
        const {navigation} = this.props;
        navigation.navigate(RouteKeys.AddDevicePage, this.state);
    };

    _searchText = (text) => WKRegExp.trimWhiteSpace(text).toLocaleLowerCase();

    _search = (text) => {
        this.state.savedSearchText = text;
        const {originData} = this.state;
        const searchedText = this._searchText(text);
        this.setState({
            data: originData.filter(item => this._searchText(item.title).indexOf(searchedText) >= 0)
        });
        this.state.emptyText = `${WK_T(wkLanguageKeys.no_device_found)}_`;
    };

    _deleteItem = (index) => {
       this.setState({
           visible: true,
           deletedIndex: index
       });
    };

    _delete = () => {
        this._hideModal();
        const {
            data,
            stationId,
            stationCode,
            deletedIndex
        } = this.state;
        const {id} = data[deletedIndex];
        const requestData = {
            stationId,
            stationCode
        };
        WKLoading.show();
        WKFetch(`/station/device/${id}`, requestData, METHOD.DELETE).then(ret => {
            if (ret.ok) {
                DeviceEventEmitter.emit(EmitterEvents.ADD_STATION_SUCCESS); // To refresh home page
                this._loadDeviceList(false);
            } else {
                this._loadDeviceList(false, ret.errorMsg);
            }
        });
    };

    _hideModal = () => {
        this.setState({
            visible: false
        });
    };

    render() {
        return <WKGeneralBackground>
            {this.state.originData.length > 0 && <WKSearchBar
                onChangeText={this._search}
            />}
            <StationView
                pageRoute={RouteKeys.DevicePage}
                data={this.state.data}
                needEditButton={false}
                deleteItem={this._deleteItem}
                emptyText={this.state.emptyText}
                reload={this._loadDeviceList}
            />
            <WKPresenter
                visible={this.state.visible}
                message={WK_T(wkLanguageKeys.sure_to_delete_device)}
                messageAttributes={[WK_T(wkLanguageKeys.delete)]}
                messageAttributeColors={['#db030a']}
                leftButtonClick={this._hideModal}
                leftButtonText={WK_T(wkLanguageKeys.cancel)}
                defaultButtonText={WK_T(wkLanguageKeys.confirm)}
                defaultButtonClick={this._delete}
            />
        </WKGeneralBackground>;
    }

}




