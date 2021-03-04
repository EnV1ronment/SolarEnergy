import { MapView, MapTypes, Geolocation, Overlay, MapApp } from 'react-native-baidu-map'
import React, {Component} from 'react';
import {StyleSheet, View, FlatList, Text, TouchableOpacity, Image, PanResponder, Animated,} from 'react-native';
import MapCell from "./MapCell";
import axios from 'axios';
import WKNavigationBarLeftItem from "../../../../../Common/Components/WKNavigationBarLeftItem";
import WKSearchBar from "../../../../../Common/Components/WKSearchBar";
import search_icon from "../../../../../Source/Me/me_search_icon.png";
import { get } from 'react-native/Libraries/Utilities/PixelRatio';

let _animateInfoHandler;
let _animateInfoHideHandler;
let _animateListHandler;
let _animateListHideHandler;

class BaiduMapPage extends Component {

    static navigationOptions = ({navigation}) => {
        return {
            header: null
        };
    };

    constructor(props) {
        super(props);
        const {navigation} = props;
        
        this.state = {
            dataSource: [],
            showList: false, 
            title: '',
            address: '',
            centerLongitude: null,
            centerLatitude: null, 
            markerLongitude: null, 
            markerLatitude: null,
            distanceTop : new Animated.Value(-500),
            distanceBoottom : new Animated.Value(-240)
        };
    }

    panTop = new Animated.ValueXY();
    panTopResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        this.panTop.setOffset({
          y: this.panTop.y._value
        });
      },
      onPanResponderMove:(evt, gestureState) => {
        // 最近一次的移动距离为gestureState.move{X,Y}
        // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
        if(gestureState.dy < 0) {
            this.refs.topref.setNativeProps({
                style: {
                    transform: [
                        {translateY: gestureState.dy}
                    ],
                }
            });
        }else{
            this.refs.topref.setNativeProps({
                style: {
                    transform: [
                        {translateY: 0}
                    ],
                }
            });
        }
    },
      onPanResponderRelease: () => {
        this._onListUp();
      },
    });
    panBottom = new Animated.ValueXY();
    panBottomResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        this.panBottom.setOffset({
          y: this.panBottom.y._value
        });
      },
      onPanResponderMove:(evt, gestureState) => {
        // 最近一次的移动距离为gestureState.move{X,Y}
        // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
        if(gestureState.dy > 0) {
            this.refs.bottomref.setNativeProps({
                style: {
                    transform: [
                        {translateY: gestureState.dy}
                    ],
                }
            });
        }else{
            this.refs.bottomref.setNativeProps({
                style: {
                    transform: [
                        {translateY: 0}
                    ],
                }
            });
        }
    },
      onPanResponderRelease: () => {
        this._onInfoDown();
      },
    });

    componentDidMount() {
        const {navigation} = this.props;
        const {currentCoordinate, currentAddress} = navigation.state.params;
        const {longitude, latitude} = currentCoordinate;
        this.setState({
            centerLongitude: longitude ?? null,
            centerLatitude: latitude ?? null, 
            markerLongitude: longitude ?? null, 
            markerLatitude: latitude ?? null,
            address: currentAddress ?? '',
            title: currentAddress ?? '',
        },() => {

        });
        // this._clickCurrentLocation()
        _animateListHandler = Animated.timing(this.state.distanceTop, {
            toValue: 0,  
            duration: 1000,   
        })
        _animateListHideHandler = Animated.spring(this.state.distanceTop, {
            toValue: -500,  
            duration: 500,   
        })
        _animateInfoHandler = Animated.spring(this.state.distanceBoottom, {
            toValue: 0,  
            duration: 1000,   
        })
        _animateInfoHideHandler = Animated.timing(this.state.distanceBoottom, {
            toValue: -240,  
            duration: 500,   
        })
    }
    _onListDown() {
        _animateListHandler.start && _animateListHandler.start()
    }

    _onListUp() {
        _animateListHideHandler.start && _animateListHideHandler.start(({ finished }) => {
            /* 动画完成的回调函数 */
            this.refs.topref.setNativeProps({
                style: {
                    transform: [
                        {translateY: 0}
                    ],
                }
            },()=>{this.setState({
                showList: false
            });});
          });
          
    }
    _onInfoUp() {
        _animateInfoHandler.start && _animateInfoHandler.start()
    }

    _onInfoDown() {
        _animateInfoHideHandler.start && _animateInfoHideHandler.start(({ finished }) => {
            /* 动画完成的回调函数 */
            this.refs.bottomref.setNativeProps({
                style: {
                    transform: [
                        {translateY: 0}
                    ],
                }
            });
          });
    }

    _search = query => {
        if (query !== ''){
            axios(`http://api.map.baidu.com/place/v2/suggestion?query=45${query}&region=*&output=json&ak=vFbPgoPVMKv3F49X55P74FEfGYSW5gKo`).then(ret => {
                const {result} = ret.data;
                if (result.length) {
                    console.warn(result)
                }
                this._onListDown();
                this.setState({
                    dataSource: result,
                    showList: true
                });
            });
        }
        if (query === ''){
            this.setState({
                dataSource: [],
                showList: false,
            });
        }
    };
    
    _geodetail = (uid) => {
        WKLoading.show();
        axios(`http://api.map.baidu.com/place/v2/detail?uid=${uid}&output=json&scope=1&ak=vFbPgoPVMKv3F49X55P74FEfGYSW5gKo`).then(ret => {
            const {result} = ret.data;
            const {location, name, address} = result;
            const {lat, lng} = location;
            WKLoading.hide();
                this.setState({
                    markerLongitude: lng, 
                    markerLatitude: lat,
                    address: address,
                    title: name
                });
                return;
        });
    }

    _geocode = (lat, lng) => {
        WKLoading.show();
        axios(`http://api.map.baidu.com/reverse_geocoding/v3/?ak=vFbPgoPVMKv3F49X55P74FEfGYSW5gKo&output=json&coordtype=bd09ll&location=${lat},${lng}&extensions_road=true&language=zh-CN`).then(ret => {
            const {result} = ret.data;
            const {location, formatted_address} = result;
            const {lat, lng} = location;
            if (!result.length) {
                WKLoading.hide();
                this.setState({
                    markerLongitude: lng, 
                    markerLatitude: lat,
                    title: formatted_address,
                    address: formatted_address
                });
                return;
            }
        });
    };

    _clickCurrentLocation = () => {
        let location = Geolocation.getCurrentPosition();
        const {longitude, latitude, errmsg} = location;
        longitude && latitude && this.setState({
            centerLongitude: longitude,
            centerLatitude: latitude, 
        });
    };

    _clickMaskerLocattion = (location) => {
        const {uid, name} = location;
        this._geodetail(uid, name);
    };

    _clickEmptyLocattion = (location) => {
        const {latitude, longitude} = location;
        this._geocode(latitude, longitude);
    };

    _save = () => {
        const {markerLatitude, markerLongitude, address} = this.state;
        const {navigation} = this.props;
        navigation.getParam('callback')({address,
            latitude: markerLatitude,
            longitude: markerLongitude,});
            navigation.goBack();
    };
    
    _clickItem = (item) => {
        const {location, name, address} = item;
        const {lat, lng} = location;
        this.setState({
            centerLongitude: lng,
            centerLatitude: lat, 
            markerLongitude: lng, 
            markerLatitude: lat,
            title: name,
            address: address,
            showList: false
        });
    };

    _renderItem = ({item, index}) => {
        const {name} = item;
        let address = item.address.replaceAll("省-","省")
        .replaceAll("市-","市")
        .replaceAll("县-","县")
        .replaceAll("区-","区");
        item.address = address;
        return (
            <TouchableOpacity
                style={[styles.cell, {
                    borderTopWidth: index ? 2 : 0,
                    borderTopColor: "rgb(34, 44, 63)",
                }]}
                activeOpacity={0.8}
                onPress={() => this._clickItem(item)}
            >
                <Image source={search_icon} style={styles.arrow}/>
                <View style={styles.infoStyle}>
                    <Text style={styles.title} numberOfLines={1}>{name}</Text>
                    <Text style={styles.address} numberOfLines={1}>{address}</Text>
                </View>
            </TouchableOpacity>
        );
    };
    render() {
        const {dataSource, showList, centerLongitude, centerLatitude, markerLongitude, markerLatitude, title, address} = this.state;
        let centerLocation = null;
        centerLongitude && (centerLocation = {longitude: centerLongitude, latitude: centerLatitude});
        let markerLocation = null;
        markerLongitude && (markerLocation = {longitude: markerLongitude, latitude: markerLatitude});
        const {navigation} = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.emptyHeader}/>
                <View style={styles.searchBar}>
                    <WKNavigationBarLeftItem click={navigation.goBack}/>
                    <View style={styles.searchArea}>
                        <WKSearchBar
                            onChangeText={text => this._search(text)}
                            placeholder={'Search here'}
                            returnKeyType={'search'}
                            fontSize={16}
                            onFocus={() => {
                                dataSource.length &&  this.setState({
                                    showList: true,
                                });
                            }}
                            />
                    </View>
                </View>
                <View style={styles.searchList}>
                    
                </View>
                <Animated.View style={[styles.searchList, {top: this.state.distanceTop,
                transform: [{ translateY: this.panTop.y }]}]}>
                    
                    <FlatList
                    renderItem={this._renderItem}
                    data={dataSource}
                    initialNumToRender={10}
                    keyExtractor={(item, index) => index.toString()}
                    ref={'topref'}
                    />
                     {showList && <View style={styles.topView}
                            {...this.panTopResponder.panHandlers}>
                            <View style={styles.lineView}></View>
                        </View>}
                </Animated.View>
                
                <MapView style={[styles.map]} 
                    showsUserLocation={true}
                    // mapType={2}
                    center={centerLocation}
                    onMapClick={(e) => {this._clickEmptyLocattion(e);}}
                    onMapPoiClick={(e) => {this._clickMaskerLocattion(e);}}
                    >
                    <Overlay.Marker location={markerLocation}>
                            <Overlay.MarkerIcon style={styles.markerIcon}>
                            <TouchableOpacity onPress={()=>{this._onInfoUp()}}>
                                <Image source={search_icon} style={styles.markerIcon}/>
                            </TouchableOpacity>
                        </Overlay.MarkerIcon>
                    </Overlay.Marker>
                </MapView>
    
                <Animated.View style={[styles.bottomView, {bottom: this.state.distanceBoottom,
                transform: [{ translateY: this.panBottom.y }]}]} >
                    <MapCell click={this._clickCurrentLocation} />
                    <View style={styles.infoView} ref={'bottomref'}>
                        <View style={styles.topView}
                            {...this.panBottomResponder.panHandlers}>
                            <View style={styles.lineView}></View>
                        </View>
                        <Text style={styles.infoTitle}>{title}</Text>
                        <Text style={styles.infoAddress}>{address}</Text>
                        <View style={styles.bottomButtonContainer}>
                            <TouchableOpacity
                                style={styles.bottomButton}
                                onPress={this._save}
                                activeOpacity={0.5}
                            >
                                <Text style={styles.bottomButtonText}>Located</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </View>
        );
    }

}

const styles = StyleSheet.create({

  box: {
    height: 150,
    width: 150,
    backgroundColor: "blue",
    borderRadius: 5
  },
    container: {
        flex: 1,
    },
    emptyHeader: {
        height: global.__iosStatusBarHeight__,
        backgroundColor: Colors.theme,
        zIndex: 9
    },
    searchBar: {
        height: 60,
        backgroundColor: Colors.theme,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 15,
        paddingBottom: 15,
        zIndex: 9
    },
    searchArea: {
        flex: 1
    },
    searchList: {
        maxHeight:500,
        backgroundColor: Colors.theme,
        zIndex: 6
    },
    cell: {
        height: 80,
        marginLeft: 14,
        marginRight: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    arrow: {
        width: 50,
        height: 50,
    },
    infoStyle: {
        height: 80,
        flexDirection: 'column',
        justifyContent: 'center',
        flex: 1,
    },
    title: {
        marginLeft: 10,
        color: Colors.white,
        fontSize: 24,
        marginBottom: 4,
    },
    address: {
        marginLeft: 10,
        color: Colors.cellFontColor,
        fontSize: 16,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    markerIcon: {
        width: 50,
        height: 50,
    },
    bottomView: {
        position: 'absolute',
        height:330,
        borderRadius: 5,
    },
    infoView: {
        height:240,
        width: global.__SCREEN_WIDTH__,
        backgroundColor: Colors.theme,
    },
    topView: {
        width: global.__SCREEN_WIDTH__,
        height:15,
    },
    lineView: {
        marginTop:5,
        marginBottom:5,
        backgroundColor: Colors.white,
        borderRadius:5,
        height:5,
        marginLeft: global.__SCREEN_WIDTH__ / 2 - 50,
        width: 100,
    },
    infoTitle: {
        color: Colors.white,
        fontSize:26,
        paddingTop: 10,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20,
    },
    infoAddress: {
        color: Colors.cellFontColor,
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20,
        fontSize:18,
    },
    bottomButtonContainer: {
        width: SCREEN_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomButton: {
        backgroundColor: Colors.buttonBgColor,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        width: 240,
    },
    bottomButtonText: {
        color: Colors.white,
        fontSize:16,
    },
});

export default BaiduMapPage;