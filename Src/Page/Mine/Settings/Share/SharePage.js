import React, {Component} from 'react';
import {
    View,
    Text,
    SectionList,
    StyleSheet,
    TouchableOpacity,
    Image,
    DeviceEventEmitter,
} from 'react-native';
import WKGeneralBackground from "../../../../Common/Components/WKGeneralBackground";
import WKEmptyView from "../../../../Common/Components/WKEmptyView";
import {connect} from 'react-redux';

// Icons
import me_share_arrow_down from '../../../../Source/Me/me_share_arrow_down.png';
import me_share_arrow_right from '../../../../Source/Me/me_share_arrow_right.png';
import me_share_delete_icon from '../../../../Source/Me/me_share_delete_icon.png';
import WKFetch from "../../../../Network/WKFetch";
import WKPresenter from "../../../../Common/Components/WKPresenter";

class SharePage extends Component {

    static navigationOptions = () => ({title: WK_T(wkLanguageKeys.share_setting)});

    state = {
        data: [],
        emptyText: '',
        visible: false,
        message: '',
        messageAttributes: [],
        sectionIndex: 0,
        deletedName: ''
    };

    componentDidMount() {
        this._loadData();
    }

    _loadData = () => {
        WKLoading.show();
        WKFetch('/setting/user/share').then(ret => {
            WKLoading.hide();
            const {ok, errorMsg, data} = ret;
            if (ok) {
                this._handleData(data);
            } else {
                this.setState({
                    data: [],
                    emptyText: errorMsg
                });
            }
        });
    };

    _handleData = (data) => {
        if (data
            && data.results
            && typeof data.results === 'object'
            && Object.keys(data.results).length
        ) {
            const {results} = data;
            const {share, shared} = results;
            const temData = [];
            if (shared && Array.isArray(shared) && shared.length) {
                const obj = {
                    title: WK_T(wkLanguageKeys.share_to_me),
                    sectionIndex: 0,
                    fold: false,
                    data: shared
                };
                temData.push(obj);
            }
            if (share && Array.isArray(share) && share.length) {
                const obj = {
                    title: WK_T(wkLanguageKeys.me_share_to),
                    sectionIndex: 1,
                    fold: false,
                    data: share
                };
                temData.push(obj);
            }
            this.setState({
                data: temData,
                emptyText: 'No data_'
            });
            return;
        }
        this.setState({
            data: [],
            emptyText: 'No data_'
        });
    };

    _fold = (sectionIndex) => {
        this.setState({
            data: this.state.data.map(item => {
                if (sectionIndex === item.sectionIndex) {
                    item.fold = !item.fold;
                }
                return item;
            })
        });
    };

    _renderHeader = ({section}) => {
        const {sectionIndex, fold, data} = section;
        const isEmpty = data.length === 0;
        return (<View>
            {
                isEmpty ? <View/> : <View style={[styles.sectionHeader, {marginBottom: 2, marginTop: 10}]}>
                    <Text style={styles.title}>{section.title}</Text>
                    <TouchableOpacity
                        style={[styles.rightButton, {paddingRight: 7}]}
                        activeOpacity={0.8}
                        onPress={() => this._fold(sectionIndex)}
                    >
                        <Image source={fold ? me_share_arrow_right : me_share_arrow_down} style={styles.buttonIcon}/>
                    </TouchableOpacity>
                </View>
            }
        </View>);
    };

    _clickItem = (sectionIndex, name) => {
        this.setState({
            visible: true,
            message: `${WK_T(wkLanguageKeys.delete_account)} "${name}"?`,
            messageAttributes: ['delete', name],
            sectionIndex: sectionIndex,
            deletedName: name
        });
    };

    _delete = () => {
        this._hideModal();
        const {
            sectionIndex,
            deletedName,
        } = this.state;
        let fromUserPhone = '';
        let toUserPhone = '';
        // Share to me
        if (sectionIndex === 0) {
            fromUserPhone = deletedName;
            toUserPhone = this.props.userName;
            // Share to others
        } else {
            fromUserPhone = this.props.userName;
            toUserPhone = deletedName;
        }
        WKLoading.show();
        WKFetch('/station/share/unbind', {
            fromUserPhone,
            toUserPhone
        }, METHOD.POST).then(ret => {
            WKLoading.hide();
            const {
                ok,
                errorMsg
            } = ret;
            if (ok) {
                DeviceEventEmitter.emit(EmitterEvents.ADD_STATION_SUCCESS);
                this._loadData();
            } else {
                WKToast.show(errorMsg);
            }
        });
    };

    _hideModal = () => {
        this.setState({
            visible: false
        });
    };

    _renderItem = (obj) => {
        const {item: {name}, section: {fold, sectionIndex}, index} = obj;
        return (<View>
            {fold ? <View/> :
                <View style={[styles.sectionHeader, {paddingLeft: 17, marginBottom: 1}]}>
                    <Text style={styles.title}>{name}</Text>
                    <TouchableOpacity
                        style={[styles.rightButton, {paddingRight: 17}]}
                        activeOpacity={0.8}
                        onPress={() => this._clickItem(sectionIndex, name)}
                    >
                        <Image source={me_share_delete_icon} style={styles.buttonIcon}/>
                    </TouchableOpacity>
                </View>}
        </View>);
    };

    render() {
        return <WKGeneralBackground>
            <SectionList
                sections={this.state.data}
                initialNumToRender={10}
                renderItem={this._renderItem}
                renderSectionHeader={this._renderHeader}
                stickySectionHeadersEnabled={false}
                ListEmptyComponent={() => <WKEmptyView
                    emptyText={this.state.emptyText}
                    reload={this._loadData}
                />}
                keyExtractor={(item, index) => index.toString()}
            />
            <WKPresenter
                visible={this.state.visible}
                message={this.state.message}
                messageAttributes={this.state.messageAttributes}
                messageAttributeColors={['#db030a', Colors.buttonBgColor]}
                leftButtonClick={this._hideModal}
                leftButtonText={WK_T(wkLanguageKeys.cancel)}
                defaultButtonText={WK_T(wkLanguageKeys.confirm)}
                defaultButtonClick={this._delete}
            />
        </WKGeneralBackground>;
    }

}

const mapStateToProps = state => ({userName: state.userReducer.userName});

export default connect(mapStateToProps)(SharePage);

const styles = StyleSheet.create({
    sectionHeader: {
        height: 40,
        marginLeft: 5,
        marginRight: 5,
        paddingLeft: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 3,
        backgroundColor: "#121f4b"
    },
    title: {
        fontSize: 12,
        color: Colors.white
    },
    buttonIcon: {
        width: 9,
        height: 9,
        resizeMode: 'contain',
    },
    rightButton: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingLeft: 60,
        height: 40,
        borderRadius: 3
    }
});

