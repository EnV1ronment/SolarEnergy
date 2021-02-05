import React, {Component} from 'react';
import {
    View,
    ListView,
    ScrollView,
    FlatList,
    LayoutAnimation,
    TouchableOpacity
} from 'react-native';

export class WKDevicesList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            groupStatus: this._getInitialGroupStatus(),
            stationStatus: this._getInitialStationStatus(),
            selectedId: this.props.selectedId
        };
        this.closeAll = this.closeAll.bind(this);
        this.toggleGroupStatus = this.toggleGroupStatus.bind(this);
        this._supportFlatList = this._supportFlatList.bind(this);
        this._renderGroupItem = this._renderGroupItem.bind(this);
        this._renderFlatListItem = this._renderFlatListItem.bind(this);
        this._renderListViewItem = this._renderListViewItem.bind(this);
        this._renderUsingView = this._renderUsingView.bind(this);
        this._renderUsingFlatList = this._renderUsingFlatList.bind(this);
        this._renderUsingListView = this._renderUsingListView.bind(this);
    }

    componentWillUpdate() {
        LayoutAnimation.easeInEaseOut();
    }

    _supportFlatList() {
        return !!FlatList;
    }

    _getInitialGroupStatus() {
        const {initialOpenGroups = [], data = []} = this.props;
        Array(data.length)
            .fill(false)
            .map((item, index) => {
                return initialOpenGroups.indexOf(index) !== -1;
            });
        return new Array(data.length)
            .fill(false)
            .map((item, index) => {
                return initialOpenGroups.indexOf(index) !== -1;
            });
    }

    _getInitialStationStatus() {
        const {initialOpenGroups = [], initialOpenStation = [], data = []} = this.props;
        Array(data[initialOpenGroups[0]].child.length)
            .fill(false)
            .map((item, index) => {
                return initialOpenStation.indexOf(index) !== -1;
            });
        return new Array(data[initialOpenGroups[0]].child.length)
            .fill(false)
            .map((item, index) => {
                return initialOpenStation.indexOf(index) !== -1;
            });
    }

    closeAll() {
        this.setState({
            groupStatus: this.state.groupStatus.map(() => false),
            stationStatus: this.state.stationStatus.map(() => false)
        });
    }
    selectGroupItem(selectedId) {
        this.props.selectGroupItem(selectedId);
        this.setState({selectedId:selectedId});
    }
    toggleGroupStatus(index, closeOthers) {
        const newGroupStatus = this.state.groupStatus.map((status, idx) => {
            return idx !== index
                ? (closeOthers ? false : status)
                : !status;
        });
        this.setState({
            groupStatus: newGroupStatus
        });
        if(index === 0){
            this.props.groupListSelect({name:'All Stations',stationId:'all',stationCode:'all'}, 0, 0);
            this.props.selectGroupItem(0);
        }
    }

    toggleGroupStation(index, _index, closeOthers) {
        const {data = []} = this.props;
        const newStationStatus = Array(data[index].child.length)
            .fill(false)
            .map((item, idx) => {
                let status = this.state.stationStatus[idx];
                return _index !== idx
                    ? (closeOthers ? false : !!status)
                    : !status;
            });
        this.setState({
            stationStatus: newStationStatus
        });
    }

    _renderGroupItem(groupItem, groupId) {
        const selectedId = this.state.selectedId;
        const status = this.state.groupStatus[groupId];
        const {renderGroupHeader, renderGroupListItem, groupStyle, groupSpacing} = this.props;
        const groupHeader = renderGroupHeader && (
            <TouchableOpacity onPress={() => {
                this.props.groupListSelect(groupItem, groupId);
                this.selectGroupItem(groupId);
            }}>
                {renderGroupHeader({
                        status,
                        groupId,
                        selected:(groupId === selectedId || selectedId === 0),
                        item: groupItem,
                        toggleStatus: this.toggleGroupStatus.bind(this, groupId)
                    }
                )}
            </TouchableOpacity>
        );
        const groupBody = groupItem.child.length > 0 && (
            <ScrollView bounces={false} style={!status && {height: 0}}>
                {groupItem.child.map((listItem, index) => {
                    const _status = this.state.stationStatus[index];
                    let item = listItem.child && listItem.child.map((_item, _index) => (
                        <TouchableOpacity key={_index} onPress={() => {
                            this.props.groupListSelect(_item, groupId, index);
                            this.selectGroupItem(`${groupId}-${index}-${_index}`);
                        }}>
                            <View key={`gid:${groupId}-sid:${index}-rid:${_index}`}>
                                {renderGroupListItem && renderGroupListItem({
                                    item: _item,
                                    sId: index,
                                    rid: _index,
                                    selected:(`${groupId}-${index}-${_index}`  === selectedId || groupId + '-' + index  === selectedId || groupId === selectedId || selectedId === 0),
                                    status,
                                    groupId
                                })}
                            </View>
                        </TouchableOpacity>
                    ))
                    if(listItem.child){
                        return (
                            <View key={index}>
                                <TouchableOpacity onPress={() => {
                                    this.props.groupListSelect(listItem, groupId, index);
                                    this.selectGroupItem(groupId + '-' + index);
                                }}>
                                    <View key={`gid:${groupId}-sid:${index}`} style={{paddingLeft:15}}>
                                        {renderGroupHeader && renderGroupHeader({
                                            item: listItem,
                                            sId: index,
                                            selected:(groupId + '-' + index  === selectedId || groupId === selectedId || selectedId === 0),
                                            status: _status,
                                            groupId,
                                            toggleStatus: this.toggleGroupStation.bind(this, groupId, index)
                                        })}
                                    </View>
                                </TouchableOpacity>
                                {_status && item}
                            </View>
                        )
                    }else {
                        return (
                            <View>
                                <TouchableOpacity onPress={() => {
                                    this.props.groupListSelect(listItem, groupId, index);
                                    this.selectGroupItem(`${groupId}-${index}-${index}`);
                                }}>
                                    <View key={`gid:${groupId}-sid:${index}-rid:${index}`}>
                                        {renderGroupListItem && renderGroupListItem({
                                            item: listItem,
                                            sId: index,
                                            rid: index,
                                            selected:(`${groupId}-${index}-${index}`  === selectedId || groupId + '-' + index  === selectedId || groupId === selectedId || selectedId === 0),
                                            status,
                                            groupId
                                        })}
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )
                    }
                })}
            </ScrollView>
        );
        return (
            <View
                key={`group-${groupId}`}
                style={[groupId && groupStyle, groupId && groupSpacing && {marginTop: groupSpacing}]}
            >
                {groupHeader}
                {groupBody}
            </View>
        );
    }

    _renderFlatListItem({item, index}) {
        return this._renderGroupItem(item, index);
    }

    _renderListViewItem(rowData, groupId, rowId) {
        return this._renderGroupItem(rowData, parseInt(rowId));
    }

    _renderUsingFlatList() {
        const {data = [], style} = this.props;
        return (
            <FlatList
                data={data}
                style={style}
                extraData={this.state}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={this._renderFlatListItem}
            />
        );
    }

    _renderUsingView() {
        const {data = [], style} = this.props;
        return (
            <View style={style}>
                {data.map((item, groupId) => {
                    return this._renderGroupItem(item, groupId);
                })}
            </View>
        )
    }

    _renderUsingListView() {
        const {data = [], style} = this.props;
        return (
            <ListView
                style={style}
                showsVerticalScrollIndicator={false}
                renderRow={this._renderListViewItem}
                dataSource={new ListView.DataSource({
                    rowHasChanged: (r1, r2) => r1 !== r2
                }).cloneWithRows(data)}
            />
        );
    }

    render() {
        const strategy = {
            'View': this._renderUsingView,
            'ListView': this._renderUsingListView,
            'FlatList': this._supportFlatList() ? this._renderUsingFlatList : this._renderUsingListView
        };
        let {implementedBy} = this.props;
        if (!strategy[implementedBy]) {
            implementedBy = 'FlatList';
        }
        return strategy[implementedBy]();
    }
}