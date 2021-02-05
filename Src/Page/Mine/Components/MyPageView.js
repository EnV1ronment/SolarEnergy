import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    ImageBackground
} from 'react-native';
import PropTypes from 'prop-types';

// Icons
import enter_arrow from '../../../Source/Common/enter_arrow.png';
import me_header_bg_icon from '../../../Source/Me/me_header_bg_icon_new.png';
import me_stations_icon from '../../../Source/Me/me_stations_icon.png';
import me_setting_icon from '../../../Source/Me/me_setting_icon.png';
import me_message_icon from '../../../Source/Me/me_message_icon.png';
import me_portrait_icon from '../../../Source/Me/me_portrait_icon.png';

export default class MyPageView extends Component {

    static propTypes = {
        account: PropTypes.string.isRequired,
        clickItem: PropTypes.func.isRequired
    };

    dataSource = [
        // {
        //     icon: me_stations_icon,
        //     title: WK_T(wkLanguageKeys.stations),
        //     route: RouteKeys.StationPage
        // },
        // {
        //     icon: me_message_icon,
        //     title: WK_T(wkLanguageKeys.message),
        //     route: RouteKeys.MessagePage
        // },
        {
            icon: me_setting_icon,
            title: WK_T(wkLanguageKeys.setting),
            route: RouteKeys.SettingsPage
        }
    ];

    _keyExtractor = (item, index) => index.toString();

    _clickItem = (route) => {
        const {clickItem} = this.props;
        clickItem && clickItem(route);
    };

    _renderItem = ({item}) => {
        const {icon, title, route} = item;
        return (
            <TouchableOpacity style={styles.cell} activeOpacity={0.8} onPress={() => this._clickItem(route)}>
                <View style={styles.left}>
                    <Image source={icon} style={styles.leftIcon}/>
                    <Text style={styles.title}>{title}</Text>
                </View>
                <Image source={enter_arrow} style={styles.arrow}/>
            </TouchableOpacity>
        );
    };

    _getAccount = () => {
        const {account} = this.props;
        return account.substr(0, 3) + '****' + account.substr(7);
    };

    _renderHeader = () => {
        return (
            <ImageBackground style={styles.header} source={me_header_bg_icon}>
                <Image source={me_portrait_icon} style={styles.portrait}/>
                <View style={styles.info}>
                    <Text style={styles.name}>{this._getAccount()}</Text>
                    <Text style={styles.phone}>{this._getAccount()}</Text>
                </View>
            </ImageBackground>
        );
    };

    render() {
        return (<View style={styles.container}>
            <FlatList
                renderItem={this._renderItem}
                data={this.dataSource}
                initialNumToRender={10}
                keyExtractor={this._keyExtractor}
                ListHeaderComponent={this._renderHeader}
                extraData={this.props}
            />
        </View>);
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        marginTop: 15,
        marginBottom: 5,
        marginLeft: 5,
        marginRight: 5,
        height: 92,
        borderRadius: 3,
        backgroundColor: Colors.cellBackgroundColor,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
        paddingTop: 13,
        paddingBottom: 12,
    },
    portrait: {
        width: 68,
        height: 68,
    },
    info: {
        marginLeft: 10,
    },
    name: {
        fontSize: 18,
        color: Colors.white
    },
    phone: {
        fontSize: 12,
        color: Colors.placeholderColor,
        marginTop: 21
    },
    cell: {
        height: 50,
        borderRadius: 3,
        backgroundColor: Colors.cellBackgroundColor,
        marginLeft: 5,
        marginRight: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 12,
        paddingRight: 8,
        marginTop: 5
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    leftIcon: {
        width: 15,
        height: 14
    },
    title: {
        marginLeft: 10,
        color: Colors.white,
        fontSize: 12
    },
    arrow: {
        width: 5,
        height: 9
    }
});
