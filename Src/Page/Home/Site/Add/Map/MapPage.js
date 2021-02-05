import MapView, {Marker, PROVIDER_GOOGLE, Callout} from 'react-native-maps';
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

class MapPage extends Component {

    static navigationOptions = ({navigation}) => {
        return {
            title: titleOfNavigation,
            headerRight: <WKNavigationBarRightItem value={search_icon} click={navigation.getParam('search')}/>,
        };
    };

    constructor(props) {
        super(props);
        const {navigation} = props;
        const currentCoordinate = navigation.getParam('currentCoordinate');
        const currentAddress = navigation.getParam('currentAddress');
        this.state = {
            mapBottom: 1,
            currentAddress: currentAddress,
            selectedMarkerCoordinate: currentCoordinate,
            selectedAddressName: '',
            selectedAddressDetail: '',
            region: {...defaultDelta, ...currentCoordinate},
        };
        this.currentCoordinate = currentCoordinate;
    }

    componentDidMount() {
        // Bind "_search" function to navigation bar.
        const {navigation} = this.props;
        navigation.setParams({search: this._search});

        // Geocode to get the address detail via coordinate.
        const {latitude, longitude} = this.currentCoordinate;
        const {currentAddress} = this.state;
        if (!currentAddress || !latitude || !longitude) {
            this._geocode(latitude, longitude, GEOCODE_TYPE.USER_LOCATION);
        }
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
                <MapView
                    style={[styles.map, {bottom: iosSafeAreaBottomHeight + 0.5 + locationCellHeight * mapBottom}]}
                    containerStyle={{backgroundColor: 'green', borderColor: 'green'}}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={initialRegion}
                    region={this.state.region}
                    showsUserLocation={true} // 显示定位当前位置按钮。Android现在有时候会显示，有时候不会显示（iOS需要在Info.plist中配置权限申请）
                    followsUserLocation={true} // Only iOS
                    maxZoomLevel={isAndroid ? 19 : 19.5} // Must set as 19, if not set, there is a great bug on Android when zooming the max level.
                    showsCompass={true}
                    showsScale={true} // iOS. A Boolean indicating whether the map shows scale information. Default value is `false`
                    showsBuildings={true} // A Boolean indicating whether the map displays extruded building information. Default value is `true`.
                    showsIndoors={true} // android. A Boolean indicating whether indoor maps should be enabled. Default value is `false`
                    showsIndoorLevelPicker={true} // android. A Boolean indicating whether indoor level picker should be enabled. Default value is `false`
                    onMapReady={() => {
                        if (isIOS) return;
                        // 权限检查还有问题，不管是否允许权限，一直返回granted
                        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then(granted => {
                            console.warn('permission: ' + granted);
                        });
                        PermissionsAndroid.request(
                            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                        ).then(granted => {
                            console.warn(granted);
                        });
                    }}
                    /// Moving the map finished.
                    onRegionChangeComplete={region => this.setState({region})}
                    onPress={this._click}
                    onPoiClick={this._click}
                    onCalloutPress={location => {
                        console.warn('onCalloutPress' + JSON.stringify(location.nativeEvent.coordinate, null, 4));
                    }}
                    onMarkerDragStart={location => {
                        console.warn('onMarkerDragStart: ' + JSON.stringify(location.nativeEvent.coordinate, null, 4));
                    }}
                    onMarkerDrag={location => {
                        console.warn('onMarkerDrag: ' + JSON.stringify(location.nativeEvent.coordinate, null, 4));
                    }}
                    onMarkerDragEnd={location => {
                        console.warn('onMarkerDragEnd: ' + JSON.stringify(location.nativeEvent.coordinate, null, 4));
                    }}
                    onIndoorLevelActivated={location => {
                        console.warn('onIndoorLevelActivated: ' + JSON.stringify(location.nativeEvent.coordinate, null, 4));
                    }}
                    onIndoorBuildingFocused={location => {
                        console.warn('onIndoorBuildingFocused: ' + JSON.stringify(location.nativeEvent.coordinate, null, 4));
                    }}
                >
                    {
                        isUserSelectedLocation && <Marker
                            coordinate={this.state.selectedMarkerCoordinate}
                            ref={ref => this.marker = ref}
                            onDragEnd={location => {
                                // this._click(location); // Google地图都没有这个，获取不到详细位置，所以直接将draggable为false，不可拖动光标
                            }}
                            draggable={false}
                        >
                            <Callout style={{width: SCREEN_WIDTH - 40}}>
                                <Text style={{
                                    fontWeight: 'bold',
                                    color: 'black'
                                }}>{this.state.selectedAddressName || ''}</Text>
                                <Text>{this.state.selectedAddressDetail || ''}</Text>
                            </Callout>
                        </Marker>}
                </MapView>
                <View style={styles.bottomView}>
                    <View>
                        <MapCell
                            height={locationCellHeight}
                            title={'Current Location'}
                            detail={this.state.currentAddress}
                            click={this._clickCurrentLocation}
                        />
                        {isUserSelectedLocation && <WKBottomLine/>}
                        {isUserSelectedLocation && <MapCell
                            height={locationCellHeight}
                            title={this.state.selectedAddressName}
                            detail={this.state.selectedAddressDetail}
                            click={this._clickSelectedLocation}
                        />}
                    </View>
                    <View style={{height: iosSafeAreaBottomHeight + 10}}/>
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

export default MapPage;