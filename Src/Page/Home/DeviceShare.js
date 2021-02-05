import React, {Component} from 'react';
import {
    Text,
    StyleSheet,
    View,
    Image,
    TextInput,
    TouchableWithoutFeedback,
    ScrollView,
    Keyboard,
    TouchableOpacity
} from 'react-native';
import WKToast from "../../Common/Components/WKToast";
import WKFetch from "../../Network/WKFetch";
import DashSecondLine from "../../Common/Components/WKDashSecondLine";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scrollview";
import WKModal from "../../Common/Components/WKModal";
import WKRegExp from "../../Utils/WKRegExp";
import {connect} from 'react-redux';

class DeviceShare extends Component {
    state = {
        modalVisible: this.props.visible,
        dataSource: this.props.dataSource,
        selectedStation: '',
        stationId: [],
        phones: [''],
    };

    componentDidMount() {
        this.keyboardWillHideListener = Keyboard.addListener(__isIOS__ ? 'keyboardWillHide' : 'keyboardDidHide', this._keyboardWillHide);
    }

    componentWillReceiveProps(nextProps) {
        const stationId = nextProps.dataSource.map(() => {
            return '';
        });
        this.setState({
            modalVisible: nextProps.visible,
            dataSource: nextProps.dataSource,
            selectedStation: '',
            stationId: stationId,
            phones: ['']
        })
    }

    componentWillUnmount() {
        this.keyboardWillHideListener.remove();
    }

    _keyboardWillHide = () => Keyboard.dismiss();

    _confirm = () => {
        let empty = false;
        let isSamePhone = false;
        let phone = this.state.phones;
        let station = this.state.stationId;
        let stations = [];
        phone.map(p => {
            if (p === '') {
                empty = true
            }
            if (p === this.props.userName) {
                isSamePhone = true;
            }
        });
        station.map(s => {
            if (s !== '') {
                stations.push(s)
            }
        });

        if (phone.length && stations.length && !empty && !isSamePhone) {
            WKLoading.show();
            WKFetch('/station/share', {
                station: stations,
                phone: phone
            }, METHOD.POST).then(ret => {
                WKLoading.hide();
                const {ok, errorMsg, data} = ret;
                this._cancel();
                if (ok) {
                    WKToast.show('Share Your Power Station Successfully');
                } else {
                    WKToast.show(errorMsg || 'Unknown Error');
                }
            })
        } else {
            if (isSamePhone) {
                WKToast.show(WK_T(wkLanguageKeys.same_phone));
            } else {
                WKToast.show(WK_T(wkLanguageKeys.improve_info));
            }
        }
    };

    _cancel = () => {
        this.setState({
            phones: [''],
            selectedStation: '',
            stationId: [],
        })
        this.props.close();
    };
    getPhoneList = (phones) => {
        return phones.map((phone, index) => {
            return <View style={{
                flex: 1,
                borderColor: 'rgb(18,31,75)',
                borderBottomWidth: 0.5,
                height: 20,
                marginBottom: 15,
                flexDirection: 'row'
            }} key={index}>
                <Image style={styles.phoneImg} source={require('../../Source/Status/icon_phone.png')}/>
                <TextInput
                    ref={`textInputRef${index}`}
                    style={{height: 40, flex: 1, marginTop: -10, color: '#ffffff'}}
                    onChangeText={(text) => {
                        this.setPhone(text, index)
                    }}
                    defaultValue={phones[index]}
                    value={phones[index]}
                    keyboardType={'numeric'}
                />
                <TouchableOpacity
                    style={{paddingRight: 10}}
                    activeOpacity={phones.length <= 1 ? 1 : 0.7}
                    onPress={() => {
                        if (phones.length <= 1) {
                            return;
                        }
                        this._delPhone(index)
                    }}>
                    {phones.length > 1 &&
                    <Image style={styles.del_Phone} source={require('../../Source/Status/icon_del.png')}/>}
                </TouchableOpacity>
            </View>
        })
    };
    addPhone = () => {
        let phones = [...this.state.phones];
        if (phones.length > 4) {
            WKToast.show('最多5个');
        } else {
            let couldAdd = true;
            phones.map((p) => {
                if (p === '') {
                    couldAdd = false
                }
            });
            if (couldAdd) {
                phones.push('');
                this.setState({
                    phones: phones
                })
            }
        }
    };
    setPhone = (text, index) => {
        let phones = this.state.phones;
        phones[index] = WKRegExp.onlyNumber(text);
        this.setState({
            phones: phones
        })
    };
    _delPhone = (index) => {
        let phones = [...this.state.phones];
        let aPhone = phones.slice(0, index);
        let bPhone = phones.slice(index + 1);
        phones = aPhone.concat(bPhone);
        this.setState({
            phones: phones
        })
    };
    getButtomBar = () => {
        return (
            <View style={styles.buttomBar}>
                <TouchableWithoutFeedback onPress={this._cancel} style={{flex: 1}}>
                    <View style={[styles.buttonView, {borderRightWidth: 1}]}>
                        <Text style={styles.leftText}>{WK_T(wkLanguageKeys.cancel)}</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableOpacity onPress={this._confirm} style={{flex: 1}}>
                    <View style={styles.buttonView}>
                        <Text style={styles.rightText}>{WK_T(wkLanguageKeys.confirm)}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    };
    getStationItems = (dataSource, stationId) => {
        return dataSource.map((station, index) => {
            return (
                <TouchableOpacity key={index} onPress={() => {
                    this.selectStation(index, station)
                }}>
                    {stationId[index] !== '' ?
                        <View style={styles.selestedItemView}>
                            <Text style={styles.titleText}>{station.name}</Text>
                            <Image style={styles.selectedStation}
                                   source={require('../../Source/Status/icon_selected.png')}/>
                        </View> :
                        <View style={styles.iItemView}>
                            <Text style={styles.titleText}>{station.name}</Text>
                        </View>
                    }
                </TouchableOpacity>
            )
        })
    };
    selectStation = (index, station) => {
        let {stationId} = this.state;
        stationId[index] = stationId[index] === '' ? station.stationId : '';
        this.setState({
            selectedStation: index,
            stationId: stationId
        })
    };

    render() {
        let {modalVisible, dataSource, stationId, phones} = this.state;
        const phoneList = this.getPhoneList(phones);
        const stationItems = this.getStationItems(dataSource, stationId);
        const buttomBar = this.getButtomBar();
        return (
            <WKModal
                transparent
                visible={modalVisible}
                onRequestClose={this._cancel}
            >
                <KeyboardAwareScrollView
                    automaticallyAdjustContentInsets={false} // Fix bug: top blank on iOS
                    style={styles.container}
                    getTextInputRefs={() => {
                        return phoneList.map((item, index) => this.refs[`textInputRef${index}`]); // Required
                    }}
                    scrollEnabled={false} // Required
                >
                    <View style={styles.mask}>
                        <View style={styles.modalView}>
                            <View style={styles.content}>
                                <View style={styles.titleView}>
                                    <View style={styles.circular}/>
                                    <View style={styles.title}>
                                        <Text style={styles.titleText}
                                              numberOfLines={2}>{WK_T(wkLanguageKeys.share_station_tip)}</Text>
                                    </View>
                                </View>
                                <View style={{paddingVertical: 5, paddingLeft: 14, paddingRight: 10}}>
                                    <View style={{
                                        borderLeftWidth: 1,
                                        borderColor: Colors.theme,// 'rgb(1,151,233)',
                                        paddingVertical: 10,
                                        paddingLeft: 10
                                    }}>
                                        <ScrollView style={{height: 80}} showsVerticalScrollIndicator={false}>
                                            <View style={{
                                                flex: 1,
                                                paddingBottom: 10,
                                                flexDirection: 'row',
                                                flexWrap: 'wrap'
                                            }}>
                                                {stationItems}

                                            </View>
                                        </ScrollView>
                                        <DashSecondLine backgroundColor='rgb(1,151,233)'
                                                        width={__SCREEN_WIDTH__ * 0.7 - 40}/>
                                    </View>
                                </View>
                                <View style={styles.titleView}>
                                    <View style={styles.circular}/>
                                    <View style={styles.title}>
                                        <Text style={styles.titleText}
                                              numberOfLines={3}>{WK_T(wkLanguageKeys.share_person_phone)}</Text>
                                    </View>
                                </View>
                                <View style={{flexDirection: 'row', paddingTop: 20}}>
                                    <TouchableOpacity style={{paddingLeft: 10}} onPress={() => {
                                        this.addPhone();
                                    }}>
                                        <Image style={styles.addPhone}
                                               source={require('../../Source/Status/icon_add_phone.png')}/>
                                    </TouchableOpacity>
                                    <View style={styles.phoneList}>
                                        <ScrollView style={{height: 80}}
                                                    showsVerticalScrollIndicator={false}>
                                            {phoneList}
                                        </ScrollView>
                                    </View>
                                </View>
                            </View>
                            {buttomBar}
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </WKModal>
        );
    }

}

const mapStateToProps = state => ({userName: state.userReducer.userName});

export default connect(mapStateToProps)(DeviceShare);

const styles = StyleSheet.create({
    mask: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalView: {
        width: __SCREEN_WIDTH__ * 0.7,
        marginTop: 200,
        marginBottom: 500,
        borderWidth: 1,
        borderColor: 'rgba(0,166,255,0.9)',
        borderRadius: 5,
        backgroundColor: Colors.theme
    },
    container: {
        flex: 1,
    },
    titleView: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10
    },
    titleText: {
        fontSize: 12,
        color: '#ffffff'
    },
    circular: {
        width: 9,
        height: 9,
        borderRadius: 9,
        backgroundColor: '#019ef4'
    },
    title: {
        marginTop: -4,
        paddingLeft: 10
    },
    content: {
        padding: 20,
        paddingLeft: 10,
        paddingRight: 0,
        borderRadius: 5,
    },
    iItemView: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: 'rgb(18,31,75)',
        marginLeft: 10,
        marginBottom: 10
    },
    selestedItemView: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: 'rgb(1,151,233)',
        marginLeft: 10,
        marginBottom: 10,
        position: 'relative'
    },
    selectedStation: {
        position: 'absolute',
        resizeMode: 'stretch',
        width: 10,
        height: 10,
        bottom: 0,
        right: 0
    },
    addPhone: {
        resizeMode: 'stretch',
        width: 15,
        height: 15
    },
    phoneImg: {
        resizeMode: 'stretch',
        width: 15,
        height: 15,
        marginLeft: 5,
        marginRight: 15
    },
    del_Phone: {
        resizeMode: 'stretch',
        width: 15,
        height: 15,
    },
    phoneList: {
        flex: 1,
        paddingLeft: 5,
    },
    buttomBar: {
        width: __SCREEN_WIDTH__ * 0.7 - 1,
        borderTopWidth: 1,
        borderColor: 'rgba(0,166,255,0.9)',
        flexDirection: 'row'
    },
    buttonView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'rgba(0,166,255,0.9)',
        height: 40
    },
    leftText: {
        fontSize: 12,
        color: 'rgb(91,100,131)'
    },
    rightText: {
        fontSize: 12,
        color: 'rgb(1,151,233)'
    }
});
