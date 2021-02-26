import { MapView, MapTypes, Geolocation, Overlay, MapApp } from 'react-native-baidu-map'
import React, {Component} from 'react';
import {StyleSheet, View, Linking, Text, PermissionsAndroid} from 'react-native';
import WKBottomLine from "../../../../../Common/Components/WKBottomLine";
import MapCell from "./MapCell";
import axios from 'axios';
import {google_map_api_host, google_map_api_key} from '../googleMapsConfig';
import WKNavigationBarRightItem from "../../../../../Common/Components/WKNavigationBarRightItem";
import search_icon from "../../../../../Source/Me/me_search_icon.png";

const locationCellHeight = 65;
const titleOfNavigation = 'Select Location';

const GEOCODE_TYPE = {
    USER_LOCATION: 0,
    SELECT_LOCATION: 1,
};

const defaultDelta = {
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

class BaiduMapPage extends Component {

    static navigationOptions = ({navigation}) => {
        return {
            title: titleOfNavigation,
            headerRight: <WKNavigationBarRightItem value={search_icon} click={navigation.getParam('search')}/>,
        };
    };

    constructor(props) {
        super(props);
        const {navigation} = props;
        this.state = {
            mapBottom: 1,
        };
    }

    componentDidMount() {
        // Bind "_search" function to navigation bar.
        const {navigation} = this.props;
    }

    _search = () => {
        const {navigation} = this.props;
        navigation.navigate(RouteKeys.MapSearchPage, {
            ...this.currentCoordinate,
            callback: params => {
                this.marker && this.marker.hideCallout();
                const {name, address, latitude, longitude} = params;
                this.setState({
                    mapBottom: 2,
                    selectedMarkerCoordinate: {
                        latitude,
                        longitude,
                    },
                    region: {
                        latitudeDelta: 0.00375421,
                        longitudeDelta: 0.00312376,
                        latitude,
                        longitude,
                    },
                    selectedAddressName: name,
                    selectedAddressDetail: address,
                })
            },
        });
    };

    _geocode = (lat, lng, type) => {
        WKLoading.show();
        axios(`${google_map_api_host}/geocode/json?latlng=${lat},${lng}&language=en&key=${google_map_api_key}`).then(ret => {
            const {results} = ret.data;
            if (!results.length) {
                WKLoading.hide();
                return;
            }
            const {formatted_address} = results[0];
            if (type === GEOCODE_TYPE.USER_LOCATION) {
                this.setState({currentAddress: formatted_address}, () => WKLoading.hide());
            } else if (type === GEOCODE_TYPE.SELECT_LOCATION) {
                this.setState({selectedAddressDetail: formatted_address}, () => WKLoading.hide());
            }
        });
    };

    _clickCurrentLocation = () => {
        const {currentAddress} = this.state;
        const params = {...this.currentCoordinate, address: currentAddress};
        const {navigation} = this.props;
        const callback = navigation.getParam('callback');
        callback(params);
        navigation.goBack();
        __DEV__ && console.warn('Current Location: ' + JSON.stringify(params, null, 4));
    };

    _clickSelectedLocation = () => {
        const {
            selectedMarkerCoordinate,
            selectedAddressName,
            selectedAddressDetail,
        } = this.state;
        let address = selectedAddressDetail;
        // Add the address name  before address detail if detail doesn't contain name.
        if (selectedAddressDetail.indexOf(selectedAddressName) < 0) {
            address = `${selectedAddressName}, ${selectedAddressDetail}`;
        }
        const params = {...selectedMarkerCoordinate, address};
        const {navigation} = this.props;
        const callback = navigation.getParam('callback');
        callback(params);
        navigation.goBack();
        __DEV__ && console.warn('Selected Location: ' + JSON.stringify(params, null, 4));
    };

    _click = location => {
        const {nativeEvent} = location;
        const {name, coordinate} = nativeEvent;
        const {latitude, longitude} = coordinate;
        // 点击非兴趣点会没有name字段，直接返回就行了（Google地图点击非兴趣地点标记也是没反应）
        if (!name) return;
        this.setState({
            mapBottom: 2,
            selectedMarkerCoordinate: coordinate,
            selectedAddressName: name.replace(/\n/g, ''),
        });
        this._geocode(latitude, longitude, GEOCODE_TYPE.SELECT_LOCATION);
    };

    render() {
        const {mapBottom} = this.state;
        const isUserSelectedLocation = mapBottom > 1;
        const initialRegion = {...this.currentCoordinate, ...defaultDelta};
        return (
            <View style={styles.container}>
                <MapView style={[styles.map]}>
                    <Overlay.Marker rotate={45} location={{ longitude: 113.975453, latitude: 22.510045 }} />
                </MapView>
    
                <View style={styles.bottomView}>
                    
                <MapCell
                    detail={this.state.currentAddress}
                    click={this._clickCurrentLocation}
                        />
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    bottomView: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.theme,
    },
});

export default BaiduMapPage;