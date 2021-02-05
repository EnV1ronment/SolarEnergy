import React, {PureComponent} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

export default class MessageItem extends PureComponent {

    static propTypes = {
        clickItem: PropTypes.func.isRequired,
        messageTitle: PropTypes.string.isRequired,
        messageDate: PropTypes.string.isRequired,
        messageType: PropTypes.string.isRequired,
        messageDetail: PropTypes.string.isRequired,
        isRead: PropTypes.bool.isRequired
    };

    _clickItem = () => {
        const {clickItem} = this.props;
        clickItem && clickItem();
    };

    render() {
        const {
            messageTitle,
            messageDate,
            messageType,
            messageDetail,
            isRead
        } = this.props;
        return (
            <TouchableOpacity
                style={styles.container}
                activeOpacity={0.8}
                onPress={this._clickItem}
            >
                <View style={styles.top}>
                    <View style={styles.topLeftContainer}>
                        <View style={[styles.redDot, {backgroundColor: isRead ? Colors.white : "#ff0000"}]}/>
                        <Text style={styles.messageTitle} numberOfLines={1}>{messageTitle}</Text>
                    </View>
                    <Text style={styles.date}>{messageDate}</Text>
                </View>
                <View style={styles.bottom}>
                    <Text style={styles.messageType} numberOfLines={1}>{messageType}</Text>
                    <Text style={styles.messageDetail} numberOfLines={1}>{messageDetail}</Text>
                </View>
            </TouchableOpacity>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        height: 80,
        opacity: 0.7,
        backgroundColor: "#121f4b",
        borderRadius: 3,
        borderWidth: 0.5,
        borderColor: '#103b60',
        shadowColor: '#082e60',
        shadowOpacity: 1,
        shadowOffset: {
            height: 0.5
        }
    },
    top: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 5,
        paddingTop: 9,
        marginRight: 9
    },
    topLeftContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    redDot: {
        width: 9,
        height: 9,
        borderRadius: 4.5
    },
    messageTitle: {
        fontSize: 15,
        color: Colors.white,
        marginLeft: 15,
        marginRight: 10
    },
    date: {
        fontSize: 12,
        color: Colors.white
    },
    bottom: {
        flex: 1,
        marginLeft: 29,
        justifyContent: 'space-around'
    },
    messageType: {
        fontSize: 12,
        color: Colors.white,
        paddingTop: 2,
        marginRight: 10
    },
    messageDetail: {
        fontSize: 12,
        color: Colors.white,
        paddingBottom: 3
    }
});