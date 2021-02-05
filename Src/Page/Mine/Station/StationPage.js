import React, {Component} from 'react';
import {DeviceEventEmitter} from 'react-native';
import WKGeneralBackground from "../../../Common/Components/WKGeneralBackground";
import StationView from "./Components/StationView";
import WKSearchBar from "../../../Common/Components/WKSearchBar";
import WKRegExp from "../../../Utils/WKRegExp";

// Icons
import me_station_add from '../../../Source/Me/me_station_add.png';
import WKNavigationBarRightItem from "../../../Common/Components/WKNavigationBarRightItem";
import WKFetch from "../../../Network/WKFetch";
import WKPresenter from "../../../Common/Components/WKPresenter";

export default class StationPage extends Component {

    state = {
        data: [],
        originData: [],
        emptyText: '',
        visible: false,
        deletedIndex: 0,
        savedSearchText: ''
    };

    static navigationOptions = ({navigation}) => {
        return {
            title: WK_T(wkLanguageKeys.stations),
            headerRight: <WKNavigationBarRightItem
                value={me_station_add}
                click={navigation.getParam('add')}
            />
        };
    };

    componentDidMount() {
        const {navigation} = this.props;
        navigation.setParams({add: this._add});
        this._loadStationsList();
    }

    _loadStationsList = (loading = true, tipMsg = '') => {
        loading && WKLoading.show();
        WKFetch('/station').then(ret => {
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
                const {results} = data;
                this._setOriginData(results);
                this.setState({
                    data: results.map(item => {
                        item.editable = false;
                        return item;
                    })
                }, () => {
                    if (this.state.savedSearchText.trim()) {
                        this._search(this.state.savedSearchText);
                    }
                });
            } else {
                this._setOriginData();
                this.setState({
                    data: [],
                    emptyText: `${WK_T(wkLanguageKeys.no_station)}_`
                });
            }
        });
    };

    _setOriginData = (data = []) => {
        this.state.originData = data;
    };

    // Add station
    _add = () => {
        const {navigation} = this.props;
        const {data} = this.state;
        const params = {
            stations: data,
            callback: this._loadStationsList
        };
        navigation.push(RouteKeys.AddStationPage, params);
    };

    // Device Page
    _didSelectCell = (index) => {
        const {data} = this.state;
        const {id, code} = data[index];
        const params = {id, code};
        const {navigation} = this.props;
        navigation.navigate(RouteKeys.DevicePage, params);
    };

    _searchText = (text) => WKRegExp.trimWhiteSpace(text).toLocaleLowerCase();

    _search = (text) => {
        this.state.savedSearchText = text;
        const {originData} = this.state;
        const searchedText = this._searchText(text);
        this.setState({
            data: originData.filter(item => this._searchText(item.title).indexOf(searchedText) >= 0)
        });
        this.state.emptyText = `${WK_T(wkLanguageKeys.no_station)}_`;
    };

    _editFinish = (text, index) => {
        if (!WKRegExp.trimWhiteSpace(text)) {
            this._loadStationsList(true, WK_T(wkLanguageKeys.empty_station_name));
            return;
        }
        /** Removes the leading and trailing white space and line terminator characters from a string. */
        text = text.trim();
        const {data, originData} = this.state;
        const {id, code} = data[index];
        const tempData = data.filter(item => item.id !== id && item.code !== code);
        const hasExist = tempData.findIndex(item => item.title === text) >= 0;
        if (hasExist) {
            this._loadStationsList(true, WK_T(wkLanguageKeys.station_already_exists));
            return;
        }
        const unchanged = originData[index].title === text;
        if (unchanged) {
            this.setState({
                data: data.map(item => {
                    item.editable = false;
                    return item;
                })
            });
            return;
        }
        const params = {
            title: text,
            stationId: id,
            stationCode: code
        };
        WKLoading.show();
        WKFetch('/station', params, METHOD.PATCH).then(ret => {
            if (ret.ok) {
                DeviceEventEmitter.emit(EmitterEvents.ADD_STATION_SUCCESS);
                this._loadStationsList(false, WK_T(wkLanguageKeys.modify_success));
            } else {
                this._loadStationsList(false, ret.errorMsg);
            }
        });
    };

    _editTextChange = (text, index) => {
        const temArr = [];
        const {data} = this.state;
        data.forEach((item, i) => {
            const obj = Object.assign({}, item);
            if (index === i) {
                obj.title = text;
            }
            temArr.push(obj);
        });
        this.setState({
            data: temArr
        });
    };

    _editBegin = (index) => {
        const data = this.state.data.slice();
        data[index].editable = true;
        this.setState({
            data: data
        });
    };

    _deleteItem = (index) => {
        this.setState({
            visible: true,
            deletedIndex: index
        });
    };

    _delete = () => {
        this._hideModal();
        const {data, deletedIndex} = this.state;
        const {id, code} = data[deletedIndex];
        WKLoading.show();
        WKFetch('/station', {
            stationId: id,
            stationCode: code
        }, METHOD.DELETE).then(ret => {
            if (ret.ok) {
                DeviceEventEmitter.emit(EmitterEvents.ADD_STATION_SUCCESS);
                this._loadStationsList(false);
            } else {
                WKLoading.hide();
                WKToast.show(ret.errorMsg);
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
                pageRoute={RouteKeys.StationPage}
                data={this.state.data}
                didSelectCell={this._didSelectCell}
                editItem={this._editBegin}
                deleteItem={this._deleteItem}
                onChangeText={this._editTextChange}
                onEndEditing={this._editFinish}
                emptyText={this.state.emptyText}
                reload={this._loadStationsList}
            />
            <WKPresenter
                visible={this.state.visible}
                message={WK_T(wkLanguageKeys.sure_to_delete_station)}
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




