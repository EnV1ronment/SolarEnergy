import React, {Component} from 'react';
import {FlatList, DeviceEventEmitter} from 'react-native';
import WKGeneralBackground from "../../../Common/Components/WKGeneralBackground";
import MessageItem from "./Components/MessageItem";
import WKEmptyView from "../../../Common/Components/WKEmptyView";
import WKFetch from "../../../Network/WKFetch";

export default class MessagePage extends Component {

    static navigationOptions = () => ({title: WK_T(wkLanguageKeys.message)});

    state = {
        data: [],
        emptyText: ''
    };

    componentDidMount() {
        this._loadData();
        this._addObserver();
    }

    componentWillUnmount() {
        this._removeObserver();
    }

    _addObserver = () => {
        this.subscription = DeviceEventEmitter.addListener(EmitterEvents.RECEIVED_NOTIFICATION, this._receivedNotification);
    };

    _removeObserver = () => {
        this.subscription && this.subscription.remove();
    };

    _receivedNotification = () => {
        this._loadData(false);
    };

    _loadData = (loading = true) => {
        loading && WKLoading.show();
        WKFetch('/setting/user/message').then(ret => {
            WKLoading.hide();
            const {
                ok,
                errorMsg,
                data
            } = ret;
            if (!ok) {
                this.setState({
                    data: [],
                    emptyText: errorMsg
                });
                return;
            }
            if (data
                && data.results
                && Array.isArray(data.results)
                && data.results.length
            ) {
                this.setState({
                    data: data.results
                });
            } else {
                this.setState({
                    emptyText: `${WK_T(wkLanguageKeys.no_message)}_`
                });
            }
        });
    };

    _clickItem = (item) => {
        const {navigation} = this.props;
        const params = {
            item,
            callback: () => this._loadData(false)
        };
        navigation.navigate(RouteKeys.MessageDetailPage, params);
    };

    _renderItem = ({item}) => {
        const {
            title,
            eventType,
            updateTime,
            content,
            isRead
        } = item;
        return (<MessageItem
            messageTitle={title}
            messageDate={updateTime}
            messageDetail={content}
            messageType={eventType}
            isRead={isRead}
            clickItem={() => this._clickItem(item)}
        />);
    };

    render() {
        return <WKGeneralBackground>
            <FlatList
                renderItem={this._renderItem}
                data={this.state.data}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={() => <WKEmptyView
                    containerStyles={{height: SCREEN_HEIGHT - iosNavigationBarSafeHeight}}
                    emptyText={this.state.emptyText}
                    reload={this._loadData}
                />}
            />
        </WKGeneralBackground>;
    }

}
