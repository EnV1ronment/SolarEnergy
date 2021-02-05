import React, {Component} from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native';
import WKGeneralBackground from "../../../../Common/Components/WKGeneralBackground";
import enter_arrow from "../../../../Source/Common/enter_arrow.png";
import {connect} from 'react-redux';

class AccountPage extends Component {

    dataSource = [
        {title: WK_T(wkLanguageKeys.change_phone), route: RouteKeys.ForgetPasswordPage},
        {title: WK_T(wkLanguageKeys.change_password), route: RouteKeys.ConfirmPasswordPage}
    ];

    static navigationOptions = () => ({title: WK_T(wkLanguageKeys.account_setting)});

    _clickItem = (route) => {
        const {navigation} = this.props;
        navigation.navigate(route, {
            route: RouteKeys.AccountPage,
        });
    };

    _getAccount = (phone) => {
        if (!phone || typeof phone !== "string") return '';
        return phone.substr(0, 3) + '****' + phone.substr(7);
    };

    _renderItem = ({item, index}) => {
        const {title, route} = item;
        return (<TouchableOpacity
            style={[styles.cell, {marginTop: index ? 6 : 15}]}
            activeOpacity={0.8}
            onPress={() => this._clickItem(route)}
        >
            <Text style={styles.title}>{title}</Text>
            <View style={styles.phoneContainer}>
                {route === RouteKeys.ForgetPasswordPage && <Text style={styles.phone}>
                    {this._getAccount(this.props.userName)}
                </Text>}
                <Image source={enter_arrow} style={styles.arrow}/>
            </View>
        </TouchableOpacity>);
    };

    _keyExtractor = (item, index) => index.toString();

    render() {
        return (<WKGeneralBackground>
            <FlatList
                renderItem={this._renderItem}
                data={this.dataSource}
                initialNumToRender={10}
                keyExtractor={this._keyExtractor}
                extraData={this.props}
            />
        </WKGeneralBackground>);
    }

}

const mapStateToProps = state => ({userName: state.userReducer.userName});

export default connect(mapStateToProps)(AccountPage);

const styles = StyleSheet.create({
    cell: {
        height: 50,
        borderRadius: 3,
        backgroundColor: Colors.cellBackgroundColor,
        marginLeft: 5,
        marginRight: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 8,
    },
    title: {
        marginLeft: 10,
        color: Colors.white,
        fontSize: 12
    },
    arrow: {
        width: 5,
        height: 9
    },
    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    phone: {
        color: Colors.placeholderColor,
        fontSize: 10,
        marginRight: 5
    }
});
