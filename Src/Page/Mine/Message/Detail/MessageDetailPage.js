import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    DeviceEventEmitter,
} from 'react-native';
import WKGeneralBackground from "../../../../Common/Components/WKGeneralBackground";
import WKFetch from "../../../../Network/WKFetch";

export default class MessageDetailPage extends Component {

    static navigationOptions = () => ({title: WK_T(wkLanguageKeys.message_detail)});

    constructor(props) {
        super(props);
        const {navigation} = props;
        const {state} = navigation;
        const {params} = state;
        const {item} = params;
        this.state = {
            item: item
        };
    }

    componentDidMount() {
        this._markRead()
    }

    _markRead = () => {
        const {item} = this.state;
        const {id, isRead} = item;
        if (isRead) return;
        WKFetch('/setting/user/message/' + id, null, METHOD.PATCH).then(ret => {
            const {ok} = ret;
            if (!ok) return;
            this._callback();
        });
    };

    _callback = () => {
        const {navigation} = this.props;
        const callback = navigation.getParam('callback');
        callback && callback();
    };

    _click = (type, action, id, resourceId) => {
        WKLoading.show();
        WKFetch('/setting/message/handle', {
            type,
            action,
            id,
            resourceId
        }, METHOD.POST).then(result => {
            WKLoading.hide();
            const {
                ok,
                errorMsg
            } = result;
            if (!ok) {
                WKToast.show(errorMsg);
                return;
            }
            action !== 'Decline' && DeviceEventEmitter.emit(EmitterEvents.ADD_STATION_SUCCESS);
            WKToast.show(`${action} ${WK_T(wkLanguageKeys.success)}`);
            this._callback();
            const {item} = this.state;
            const tempItem = Object.assign({}, item);
            delete tempItem.control;
            this.setState({
                item: tempItem
            });
            this.props.navigation.goBack();
        });
    };

    render() {
        const {
            item
        } = this.state;
        const {
            title,
            eventType,
            updateTime,
            content,
            result, // 1: not handled,  2: Has accepted, 3: Has declined
            control,
            type,
            id,
            resourceId
        } = item;

        let showHandleButton = false;
        // if (control
        //     && Array.isArray(control)
        //     && control.length === 2
        //     && result === 1
        // ) {
        //     showHandleButton = true;
        // }

        return (<WKGeneralBackground>
            <View style={styles.container}>
                <ScrollView>
                    <Text style={styles.title}>{title}</Text>
                    <View style={styles.typeAndDateContainer}>
                        <Text style={styles.typeAndDate}>{eventType}</Text>
                        <Text style={styles.typeAndDate}>{updateTime}</Text>
                    </View>
                    <Text style={styles.detail}>{content}</Text>
                    {showHandleButton && <View style={styles.controlButton}>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => this._click(type, control[0], id, resourceId)}
                        >
                            <Text style={styles.controlButtonText}>{control[0]}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => this._click(type, control[1], id, resourceId)}
                        >
                            <Text style={[styles.controlButtonText, {
                                color: Colors.buttonBgColor,
                                borderColor: Colors.buttonBgColor
                            }]}>{control[1]}</Text>
                        </TouchableOpacity>
                    </View>}
                </ScrollView>
            </View>
        </WKGeneralBackground>);
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 5,
        marginTop: 16,
        padding: 5,
        backgroundColor: Colors.theme,
        shadowColor: Colors.buttonBgColor,
        shadowOpacity: 0.2,
        shadowOffset: {
            height: 3
        }
    },
    title: {
        fontSize: 16,
        color: Colors.white
    },
    typeAndDateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 6
    },
    typeAndDate: {
        fontSize: 14,
        color: Colors.white
    },
    detail: {
        fontSize: 12,
        color: Colors.white,
        marginTop: 15,
        lineHeight: 20
    },
    controlButton: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 30
    },
    controlButtonText: {
        borderRadius: 4,
        borderColor: '#ff0000',
        color: '#ff0000',
        borderWidth: 0.5,
        fontSize: 15,
        padding: 6,
        paddingLeft: 20,
        paddingRight: 20
    }
});
