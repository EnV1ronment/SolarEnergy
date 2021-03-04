import React, {Component} from 'react';
import {DeviceEventEmitter, StatusBar, ScrollView, RefreshControl, Linking, Alert} from 'react-native';
import WKGeneralBackground from "../../Common/Components/WKGeneralBackground";
// import JPushModule from 'jpush-react-native';
import {release, needPush} from "../../../app";
import {connect} from 'react-redux';
import SiteInfoView from "./Components/SiteInfoView";
import {SiteInfoMock} from "./Components/Mock/SiteInfoMock";
import SiteModal from "./Components/SiteModal";
import WKFetch from "../../Network/WKFetch";
import WKEmptyView from "../../Common/Components/WKEmptyView";
import AddSiteButton from "./Components/AddSiteButton";
import WKNavigationBarRightItem from "../../Common/Components/WKNavigationBarRightItem";
import add_site_btn from '../../Source/Me/me_search_icon.png';
import { Colors } from 'react-native/Libraries/NewAppScreen';
// Constants
const ADD_SITE = 'Add Site';
const NEW_SITE = 'New Site';
const RELOAD = 'Reload';
const EDIT_SITE = 'Edit Site';
const DELETE_SUCCESS = 'Success';
const DELETE_SITE_ALERT_MSG = 'Are you sure you want to delete this site?';
const CANCEL_BUTTON_TEXT = 'Cancel';
const CONFIRM_BUTTON_TEXT = 'Confirm';
const NO_DATA = 'No Data';
const PUSH_AUTHORIZATION = 'You have not enabled push permission, please open it in settings.';
const titleOfNavigation = 'My Sites';

class HomePage extends Component {

    static navigationOptions = ({navigation}) => {
        return {
            title: navigation.getParam('titleOfNavigation'),
            headerRight: <WKNavigationBarRightItem value={navigation.getParam('icon')} click={navigation.getParam('addSite')}/>,
        };
    };
    
    constructor(props) {
        super(props);
        const {navigation} = props;
        this.state = {
            data: [],
            errorMsg: '',
            isEmpty: false,
            reloadMsg: '',
            refreshing: false,
            stationId: null,
            deviceSN: null,
            siteTitle: null,
            siteAddress: null,
        };
    }


    componentDidMount() {
        __isAndroid__ && StatusBar.setBackgroundColor(Colors.theme);
        needPush && this._initPush();
        const {navigation} = this.props;
        navigation.setParams({addSite: null, titleOfNavigation: ' ', icon: null});
        this._loadData();
        this._addObserver();
        // this._pushAuthorization();
    }

    componentWillUnmount() {
        this._removeObserver();
    }

    _addObserver = () => {
        this.networkListener = DeviceEventEmitter.addListener(EmitterEvents.NETWORK_CONNECTION, this._recoverNetwork);
    };

    _removeObserver = () => {
        this.networkListener && this.networkListener.remove();
        // needPush && JPushModule.removeReceiveOpenNotificationListener(this._tabNotification);
        // needPush && JPushModule.removeReceiveNotificationListener(this._receiveRemoteNotification);
    };

    // Check if user opened then push notification in settings.
    _pushAuthorization = () => {
        JPushModule.hasPermission(hasPermission => {
            if (!hasPermission) {
                Linking.canOpenURL('app-settings:').then(supported => {
                    WKAlert.show(PUSH_AUTHORIZATION, 'Later', supported ? 'Go to Settings' : 'Ok', () => {
                        if (supported) {
                            return Linking.openURL('app-settings:');
                        }
                    });
                }).catch(err => __DEV__ && console.warn('An error occurred', JSON.stringify(err, null, 2)));
            }
        });
    };

    _loadData = (isRefreshing = false, msg) => {
        !isRefreshing && WKLoading.show();
        const {userId, navigation} = this.props;
        WKFetch('/station', {userId}).then(ret => {
            WKLoading.hide();
            const {ok, errorCode, errorMsg, result} = ret;
            if (ok) {
                this.setState({
                    data: result,
                    refreshing: false,
                    errorMsg: result.length ? '' : NO_DATA,
                    reloadMsg: result.length ? '' : ADD_SITE,
                });
                if(result.length){
                    this.setState({
                        isEmpty: false,
                    });
                    navigation.setParams({addSite: this._addSite, titleOfNavigation: titleOfNavigation, icon: add_site_btn});
                }else{
                    this.setState({
                        isEmpty: true,
                    });
                    navigation.setParams({addSite: null, titleOfNavigation: ' ', icon: null});
                }

                if (result && result.length && msg === DELETE_SUCCESS) {
                    this.carousel && this.carousel.resetCarousel(result.length - 1);
                }
                const isFromLogin = navigation.getParam('isFromLogin', false);
                if (result.length === 1 && isFromLogin && result[0].deviceSN) {
                    const {id, name, establishTime} = result[0];
                    this._getInto(id, name, establishTime);
                }
                // Necessary to do this. Or it will enter detail page automatically with deleting a site.
                if (navigation.state.params) {
                    navigation.state.params.isFromLogin = false;
                }
                WKToast.show(msg); // Delete site to toast.
            } else {
                this.setState({
                    data: [],
                    refreshing: false,
                    errorMsg,
                    reloadMsg: RELOAD,
                });
                WKToast.show(errorMsg, true);
            }
        });
    };

    _recoverNetwork = () => {
        this._loadData();
    };

    _initPush = () => {
        // JPushModule.initPush();
        // // Required on Android when logging in again After logging out. Otherwise, push won't be received.
        // JPushModule.resumePush();
        // if (__isAndroid__) {
        //     JPushModule.notifyJSDidLoad(resultCode => {
        //         if (resultCode === 0) {
        //         }
        //     });
        // }
        WKStorage.getItem(CacheKeys.systemInfo).then(result => {
            const _a = result.firmId;
            const _b = this.props.userName;
            const tags = release && !__DEV__ ? [`${_a}_${_b}`] : [`test_${_a}_${_b}`];
            this._setTags(tags);
        });

        // Tapped message in notification bar.
        // JPushModule.addReceiveOpenNotificationListener(this._tabNotification);
        // JPushModule.addReceiveNotificationListener(this._receiveRemoteNotification);
    };

    _receiveRemoteNotification = (map) => {
        const extras = __isIOS__ ? map.extras : JSON.parse(map.extras);
        extras.type === 'share' && this._loadData(false);
        DeviceEventEmitter.emit(EmitterEvents.RECEIVED_NOTIFICATION);
    };

    _tabNotification = map => {
        if (!map || typeof map !== 'object' || !Object.keys(map).length) return;
        // App is in foreground, appState only for iOS
        if (map.appState === 'active') return;
        DeviceEventEmitter.emit(EmitterEvents.HIDE_MODAL);
        WKLoading.hide();
        const extras = __isIOS__ ? map.extras : JSON.parse(map.extras);
        const {type} = extras;
        this.timeOut && clearTimeout(this.timeOut);
        this.timeOut = setTimeout(() => {
            this.timeOut && clearTimeout(this.timeOut);
            if (type === 'alarm') {
                this.props.navigation.navigate(RouteKeys.AlarmPage);
            }
            // else if (type === 'share') {
            //     this.props.navigation.navigate(RouteKeys.MessagePage);
            // } else {
            //     this.props.navigation.navigate(RouteKeys.MessagePage);
            // }
        }, 100);
    };

    _setTags = tags => {
        const callback = map => {
            const {errorCode} = map;
            if (errorCode === 0) {
                __DEV__ && console.warn('Jpush -> setTags success', tags);
            }
        };
        // JPushModule.setTags(tags, callback);
    };

    // Look up site details info
    _getInto = (id, name, establishTime) => {
        const {navigation} = this.props;
        navigation.navigate(RouteKeys.SiteInfoPage, {id, name, establishTime});
    };

    _addSite = () => {
        const {navigation} = this.props;
        const {
            stationId,
        } = this.state;
        navigation.navigate(RouteKeys.AddSitePage, {
            navigationTitle: NEW_SITE,
            stationId,
            deviceSN: '',
            siteTitle: '',
            siteAddress: '',
            isAddSite: true,
            callback: () => {
                this._loadData();
                const {data} = this.state;
                data && data.length && this.carousel && this.carousel.resetCarousel(0);
            },
        });
    };

    _editSite = () => {
        const {navigation} = this.props;
        const {
            stationId,
            deviceSN,
            siteTitle,
            siteAddress,
        } = this.state;
        navigation.navigate(RouteKeys.AddSitePage, {
            navigationTitle: EDIT_SITE,
            stationId,
            deviceSN,
            siteTitle,
            siteAddress,
            isAddSite: false,
            callback: () => {
                this._loadData();
                const {data} = this.state;
                data && data.length && this.carousel && this.carousel.resetCarousel(0);
            },
        });
    };

    _editOrDeleteSite = index => {
        if (index) { // Delete
            this.ref.hideWithoutAnimation(() => {
                WKAlert.show(
                    DELETE_SITE_ALERT_MSG,
                    CANCEL_BUTTON_TEXT,
                    CONFIRM_BUTTON_TEXT,
                    () => {
                        const {stationId} = this.state;
                        WKFetch('/station',
                            {stationId},
                            METHOD.DELETE,
                        ).then(ret => {
                            const {ok, errorMsg, errorCode} = ret;
                            if (ok) {
                                this._loadData(false, DELETE_SUCCESS);
                            } else {
                                WKToast.show(errorMsg);
                            }
                        });
                    });
            });
        } else { // Edit
            this._editSite();
        }
    };

    render() {
        // __DEV__ && console.warn('中间层内网地址： 192.168.2.35:4054 外网地址：39.108.124.91:8036');
        const {refreshing, data, errorMsg, reloadMsg, isEmpty} = this.state;
        return (<WKGeneralBackground backgroundColor={Colors.theme} showSunshine={false}>
            <ScrollView
                nestedScrollEnabled={true}
                contentContainerStyle={{flexGrow: 1}} // Be sure that subview can use "flex: 1" property to fill the whole screen.
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                            if (refreshing) return;
                            this.setState({
                                refreshing: true,
                            });
                            this._loadData(true);
                        }}
                    />
                }
            >
                {
                    !data.length ? (<WKEmptyView
                        emptyText={errorMsg}
                        reloadText={reloadMsg}
                        reload={this._addSite}
                        addSite={this._addSite}
                        isEmpty={isEmpty}
                    />) : (<SiteInfoView
                        ref={ref => this.carousel = ref}
                        data={data}
                        siteInfoLongPress={(stationId, deviceSN, siteTitle, siteAddress) => {
                            this.ref.show();
                            this.state.stationId = stationId;
                            this.state.siteTitle = siteTitle;
                            this.state.deviceSN = deviceSN;
                            this.state.siteAddress = siteAddress;
                        }}
                        getInto={this._getInto}
                    />)
                }
                
            </ScrollView>
            {/* <AddSiteButton addSite={() => this._addSite(ADD_SITE)}/> */}
            <SiteModal
                ref={ref => this.ref = ref}
                select={this._editOrDeleteSite}
            />
        </WKGeneralBackground>);
    }

}

const mapStateToProps = state => ({
    userName: state.userReducer.userName,
    userId: state.userReducer.userId,
});

export default connect(mapStateToProps)(HomePage);
