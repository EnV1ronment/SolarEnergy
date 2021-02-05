import React, {Component} from 'react';
import {
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';
import WKGeneralBackground from "../../../../Common/Components/WKGeneralBackground";
import back_icon from "../../../../Source/Common/enter_arrow.png";

export default class HelpPage extends Component {

    dataSource = [
        {title: WK_T(wkLanguageKeys.faq), route: RouteKeys.FAQPage},
        {title: WK_T(wkLanguageKeys.common_operation), route: RouteKeys.CommonOperationPage}
    ];

    static navigationOptions = () => ({title: WK_T(wkLanguageKeys.help_info)});

    _clickItem = (route) => {
        this.props.navigation.navigate(route);
    };

    _renderItem = ({item}) => {
        const {title, route} = item;
        return (<TouchableOpacity style={styles.cell} activeOpacity={0.8} onPress={() => this._clickItem(route)}>
            <Text style={styles.title}>{title}</Text>
            <Image source={back_icon} style={styles.arrow}/>
        </TouchableOpacity>);
    };

    _keyExtractor = (item, index) => index.toString();

    render() {
        return <WKGeneralBackground>
            <FlatList
                renderItem={this._renderItem}
                data={this.dataSource}
                initialNumToRender={10}
                keyExtractor={this._keyExtractor}
            />
        </WKGeneralBackground>;
    }

}

const styles = StyleSheet.create({
    cell: {
        height: 40,
        borderRadius: 3,
        backgroundColor: '#121f4b',
        marginLeft: 5,
        marginRight: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 8,
        marginTop: 6
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
