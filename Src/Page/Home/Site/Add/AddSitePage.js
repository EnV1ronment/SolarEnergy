import React, {Component} from 'react';
import WKGeneralBackground from "../../../../Common/Components/WKGeneralBackground";
import AddSiteView from "./Components/AddSiteView";
import Geolocation from '@react-native-community/geolocation';
import {connect} from 'react-redux';
import {google_map_api_host, google_map_api_key} from './googleMapsConfig';
import axios from "axios";
import WKFetch from "../../../../Network/WKFetch";

const EMPTY_TITLE = 'Site title cannot be empty';
const EMPTY_SN = 'Device SN cannot be empty';
const EMPTY_ADDRESS = 'Address cannot be empty';
const NETWORK_DISCONNECTED = 'Network Disconnected!';

class AddSitePage extends Component {

    static navigationOptions = ({navigation}) => ({title: navigation.getParam('navigationTitle')});

    constructor(props) {
        super(props);
        const {
            isAddSite,
            stationId,
            deviceSN,
            siteTitle,
            siteAddress,
        } = this._navigationState();
        this.state = {
            isAddSite,
            stationId,
            currentDeviceSN: deviceSN,
            currentSiteTitle: siteTitle,
            currentAddress: siteAddress,
            currentCoordinate: {},
            hasAuthorized: false,
            // 换设备sn AL2002017100021试一下
            // currentDeviceSN: 'AL2002017100021',
            // currentSiteTitle: 'chenlong station111',
            // currentAddress: 'test address by langke',
            // currentCoordinate: {longitude: 10.12345, latitude: 123.56738},
        };
    }

    _navigationState = () => {
        const {navigation} = this.props;
        const {state} = navigation;
        const {params} = state;
        return params;
    };

    componentDidMount() {
        //this._loadCurrentLocation();
    }

    // Get user's current location coordination converted into detail address.
    // _loadCurrentLocation = (startLocationClicked = false) => {
    //     WKLoading.show();
    //     // Android cannot get current location with options on some devices.
    //     const options = isIOS ? {
    //         enableHighAccuracy: true,
    //         timeout: 20000,
    //         maximumAge: 1000,
    //     } : null;
    //     Geolocation.getCurrentPosition(position => {
    //             this.state.hasAuthorized = true;
    //             const {coords} = position;
    //             const {latitude, longitude} = coords || {};
    //             this.state.currentCoordinate = {latitude, longitude};
    //             this._geocode(latitude, longitude, startLocationClicked);
    //         }, error => {
    //             const {message, code} = error || {};
    //             // code: 3 -> Location request timed out.
    //             if (code === 2 || code === 3) {
    //                 this.state.hasAuthorized = false;
    //             }
    //             WKLoading.hide();
    //             WKToast.show(__DEV__ ? `${message} (${code}) ` : message);
    //         },
    //         options,
    //     );
    // };

    _geocode = (lat, lng, startLocationClicked) => {
        const {isAddSite} = this.state;
        if (!isAddSite) {
            WKLoading.hide();
            return;
        }
        axios(`${google_map_api_host}/geocode/json?latlng=${lat},${lng}&language=en&key=${google_map_api_key}`).then(ret => {
            const {results} = ret.data;
            if (!results.length) {
                WKLoading.hide();
                return;
            }
            const {formatted_address} = results[0];
            this.setState({currentAddress: formatted_address}, () => {
                WKLoading.hide();
                if (startLocationClicked) {
                    this._startLocation();
                }
            });
        }).catch(error => {
            __DEV__ && console.warn('error ' + JSON.stringify(error, null, 4))
        });
    };

    _scanQRCode = () => {
        const {navigation} = this.props;
        navigation.navigate(RouteKeys.AddDevicePage, {
            stationId: '',
            stationCode: '',
            callback: sn => this.setState({currentDeviceSN: sn}),
        });
    };

    _startLocation = () => {
        if (!this.props.hasNetwork) {
            WKToast.show(NETWORK_DISCONNECTED);
            return;
        }
        const {
            currentCoordinate,
            currentAddress,
            hasAuthorized,
        } = this.state;
        // if (!hasAuthorized) {
        //     WKAlert.show('To continue, turn on your location settings in Google Maps. If you have authorized in settings, please click "Ok" to continue.',
        //         'CANCEL',
        //         'OK', () => {
        //             this._loadCurrentLocation(true);
        //         });
        //     return;
        // }
        if (currentCoordinate && Object.keys(currentCoordinate).length) {
            const {navigation} = this.props;
            // navigation.navigate(RouteKeys.MapPage, {
            //     currentCoordinate,
            //     currentAddress,
            //     callback: params => {
            //         const {
            //             address,
            //             latitude,
            //             longitude,
            //         } = params;
            //         this.setState({
            //             currentAddress: address,
            //             currentCoordinate: {
            //                 latitude,
            //                 longitude,
            //             },
            //         });
            //     },
            // });
        } else {
            const {navigation} = this.props;
            navigation.navigate(RouteKeys.donghua);
            //this._loadCurrentLocation();
        }
    };

    _save = () => {
        const {
            isAddSite,
            currentAddress,
            currentSiteTitle,
            currentDeviceSN,
        } = this.state;
        const {hasNetwork} = this.props;
        if (!hasNetwork) {
            WKToast.show(NETWORK_DISCONNECTED);
            return;
        }
        if (!currentSiteTitle.trim()) {
            WKToast.show(EMPTY_TITLE);
            return;
        }
        if (!currentDeviceSN.trim()) {
            WKToast.show(EMPTY_SN);
            return;
        }
        if (!currentAddress.trim()) {
            WKToast.show(EMPTY_ADDRESS);
            return;
        }
        if (isAddSite) { // Add site.
            this._addSite(currentSiteTitle, currentDeviceSN, currentAddress);
        } else { // Edit Site
            this._editSite();
        }
    };

    _addSite = (title, deviceSN, address) => {
        const {currentCoordinate} = this.state;
        const {latitude, longitude} = currentCoordinate;
        WKLoading.show();
        WKFetch('/station', {
            title,
            deviceSN,
            address,
            longitude: longitude.toFixed(5),
            latitude: latitude.toFixed(5),
            isWebUser: false,
        }, METHOD.POST).then(ret => {
            WKLoading.hide();
            const {
                ok,
                errorCode,
                errorMsg,
            } = ret;
            if (ok) {
                const {navigation} = this.props;
                navigation.getParam('callback')();
                navigation.goBack();
            } else {
                WKToast.show(errorMsg);
            }
        });
    };

    _editSite = () => {
        const {
            currentAddress,
            currentSiteTitle,
            currentDeviceSN,
        } = this.state;

        const {
            deviceSN,
            siteTitle,
            siteAddress,
        } = this._navigationState();

        // Nothing changed.
        if (deviceSN === currentDeviceSN
            && siteTitle === currentSiteTitle
            && siteAddress === currentAddress) {
            this.props.navigation.goBack();
            return;
        }

        // Change device sn.
        if (deviceSN !== currentDeviceSN) {
            this._modifyDeviceSN();
        } else {
            this._modifyTitleOrAddress();
        }
    };

    _modifyDeviceSN = () => {
        const {
            stationId,
            currentAddress,
            currentSiteTitle,
            currentDeviceSN,
        } = this.state;

        const {
            siteTitle,
            siteAddress,
        } = this._navigationState();
        WKLoading.show();
        WKFetch('/station/deviceSN',
            {
                stationId,
                deviceSN: currentDeviceSN,
            },
            METHOD.PUT,
        ).then(ret => {
            const {ok, errorMsg, errorCode} = ret;
            if (ok) {
                if (siteTitle === currentSiteTitle && siteAddress === currentAddress) {
                    WKLoading.hide();
                    const {navigation} = this.props;
                    navigation.getParam('callback')();
                    navigation.goBack();
                } else {
                    this._modifyTitleOrAddress(false);
                }
            } else {
                WKLoading.hide();
                WKToast.show(errorMsg);
            }
        });
    };

    _modifyTitleOrAddress = (loading = true) => {
        const {
            stationId,
            currentAddress,
            currentSiteTitle,
        } = this.state;

        const {
            siteTitle,
            siteAddress,
        } = this._navigationState();
        const params = {};
        // firmId has been in http request header.
        params.stationId = stationId;

        // Site title changed.
        if (siteTitle !== currentSiteTitle) {
            params.title = currentSiteTitle;
        }

        // Address changed.
        if (siteAddress !== currentAddress) {
            params.address = currentAddress;
            const {currentCoordinate} = this.state;
            const {latitude, longitude} = currentCoordinate;
            if (latitude && longitude) {
                params.longitude = longitude.toFixed(5);
                params.latitude = latitude.toFixed(5);
            }
        }
        loading && WKLoading.show();
        WKFetch('/station', params, METHOD.PATCH).then(ret => {
            WKLoading.hide();
            const {
                ok,
                errorCode,
                errorMsg,
            } = ret;
            if (ok) {
                const {navigation} = this.props;
                navigation.getParam('callback')();
                navigation.goBack();
            } else {
                WKToast.show(errorMsg);
            }
        });
    };

    render() {
        const {
            currentSiteTitle,
            currentDeviceSN,
            currentAddress,
        } = this.state;
        return (
            <WKGeneralBackground>
                <AddSiteView
                    sn={currentDeviceSN}
                    title={currentSiteTitle}
                    address={currentAddress}
                    scanQRCode={this._scanQRCode}
                    startLocation={this._startLocation}
                    save={this._save}
                    onChangeText={title => this.state.currentSiteTitle = title}
                />
            </WKGeneralBackground>
        );
    }

}

const mapStateToProps = state => ({
    hasNetwork: state.netReducer.hasNetwork,
});

export default connect(mapStateToProps)(AddSitePage);

