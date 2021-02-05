import React, {Component} from 'react';
import {
    Text,
    StyleSheet,
    View,
    Image,
    TouchableWithoutFeedback,
    Modal,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import {List} from '@ant-design/react-native';
import {WKDevicesList} from "./WKDevicesList";
import WKModal from "../WKModal";

const Item = List.Item;
export default class WKDeviceSelect extends Component {
    state = {
        modalVisible: this.props.visible,
        groupId: 0,
        sId: 0,
        selectedId: 0,
    };

    componentDidMount() {
        this.setState({
        })
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            modalVisible: nextProps.visible
        })
    }
    _renderGroupHeader({item, groupId, status, toggleStatus, selected}) {
        return (
            <View style={styles.headContainer}>
                <TouchableOpacity style={{flex: 1}} onPress={() => toggleStatus(true)}>
                    <View style={{flexDirection:'row',height:40,alignItems:'center'}}>
                        {groupId === 0 ?null:
                            status ? <Image source={require('../../../Source/Status/icon_station_open.png')}
                                          style={styles.image}/> :
                            <Image source={require('../../../Source/Status/icon_station_close.png')}
                                   style={styles.image}/>
                        }
                        <Text style={styles.headTitleText} numberOfLines={1}>{item.name}</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.touchArea}>
                    <View style={selected ? styles.circular_b : styles.circular}/>
                </View>
            </View>
        )
    }

    _renderGroupListItem({item, groupId, status, selected}) {
        return (
            <View style={styles.listItemContainer}>
                <View style={{flex: 1}}>
                    <Text style={styles.listItemText} numberOfLines={1}>{item.name}</Text>
                </View>
                <View style={selected ? styles.circular_b : styles.circular}/>
            </View>
        );
    }

    _onGroupListSelect = (item, groupId, sId) => {
        this.setState({groupId,sId});
        this.props.onChangeDevice(item);
        this._onClose();
    };

    _selectGroupItem = (selectedId) => {
        this.setState({selectedId})
    };

    _onClose = () => {
        this.props.close();
    };

    render() {
        let {sId, groupId, selectedId, modalVisible} = this.state;
        return (
                <WKModal
                    transparent
                    visible={modalVisible}
                    onRequestClose={() => {
                        this._onClose();
                    }}
                >
                    <View style={{flex: 1}}>
                        <TouchableWithoutFeedback
                            onPress={() => {
                                this._onClose();
                            }}>
                            <View style={styles.mask}>
                            </View>
                        </TouchableWithoutFeedback>
                        <View style={[styles.modalView, this.props.setPosition]}>
                            <Image source={require('../../../Source/Status/device_select.png')}
                                   style={styles.modalBG}/>
                            <ScrollView style={styles.modalScrollView}
                                        automaticallyAdjustContentInsets={false}
                                        showsHorizontalScrollIndicator={false}
                                        showsVerticalScrollIndicator={false}>
                                <WKDevicesList data={this.props.dataSource}
                                             groupStyle={styles.groupItem}
                                             initialOpenGroups={[groupId]}
                                             initialOpenStation={[sId]}
                                             selectedId={selectedId}
                                             groupListSelect={this._onGroupListSelect}
                                             renderGroupHeader={this._renderGroupHeader}
                                             selectGroupItem={this._selectGroupItem}
                                             renderGroupListItem={this._renderGroupListItem}/>
                            </ScrollView>
                        </View>
                    </View>
                </WKModal>

        );
    }

}

const styles = StyleSheet.create({
    modalView: {
        height: __SCREEN_HEIGHT__ / 2,
        width: 3 * __SCREEN_WIDTH__ / 4,
        // right:21,
        // top:__SCREEN_HEIGHT__ / 4,
        position: 'absolute'
    },
    mask: {
        flex: 1,
    },
    modalBG:{
        height: __SCREEN_HEIGHT__ / 2,
        width: 3 * __SCREEN_WIDTH__ / 4,
        resizeMode: 'stretch',
    },
    modalScrollView:{
        height: __SCREEN_HEIGHT__ / 2 - 20,
        width: 3 * __SCREEN_WIDTH__ / 4 - 20,
        position: 'absolute',
        margin: 12
    },
    container: {
        borderTopColor: '#DDD',
        borderTopWidth: 1,
        // backgroundColor: 'red'
    },
    groupItem: {
        borderBottomWidth: 0,
        borderBottomColor: '#00a6ff'
    },
    headContainer: {
        paddingHorizontal: 15,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center'
    },
    image:{
        height:15,
        width: 15,
        resizeMode: 'contain'
    },
    headTitleText: {
        color: '#FFF'
    },
    touchArea: {
        height: 40,
        width: 30,
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    listItemContainer: {
        height: 40,
        paddingTop: 5,
        paddingLeft: 50,
        paddingRight: 15,
        flexDirection: 'row',
    },
    listItemText: {
        color: '#FFF',
        flex: 1,
        justifyContent: 'center'
    },
    _listItemText: {
        color: '#FFF',
        justifyContent: 'center'
    },
    circular: {
        width: 9,
        height: 9,
        borderRadius: 9,
        borderWidth: 1,
        marginTop:5,
        borderColor: '#019ef4'
    },
    circular_b: {
        width: 9,
        height: 9,
        marginTop:5,
        borderRadius: 9,
        backgroundColor: '#019ef4',
    },
});