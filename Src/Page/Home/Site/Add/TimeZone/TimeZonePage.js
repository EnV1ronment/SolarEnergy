import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    View,
} from 'react-native';
import WKGeneralBackground from "../../../../../Common/Components/WKGeneralBackground";
import enter_arrow from '../../../../../Source/Common/enter_arrow.png';


class TimeZonePage extends Component {

    constructor(props) {
        super(props);
        const {navigation} = props;
        const {state} = navigation;
        const {params} = state;
        const {timezone} = params;
        this.state = {
            language: WK_GetCurrentLocale(),
            listHeight: 0,
            timezone
        };
    }

    dataSource = [
        {title: WK_T(wkLanguageKeys.Asia_Shanghai), value: 'Asia/Shanghai'},
        {title: WK_T(wkLanguageKeys.Australia_Queensland), value: 'Australia/Queensland'},
    ];

    static navigationOptions = () => ({title: WK_T(wkLanguageKeys.timezone_title)});

    _clickItem = (timezone) => {
        const {navigation} = this.props;
        const {state} = navigation;
        const {params} = state;
        const {callback} = params;
        callback(timezone);
        navigation.goBack();
    };

    _renderItem = ({item, index}) => {
        const {title, value} = item;
        const {timezone} = this.state;
        return (
            <TouchableOpacity
                style={[styles.cell, {
                    height: 60,
                    borderTopWidth: index ? 2 : 0,
                    borderTopColor: "rgb(34, 44, 63)",
                }]}
                activeOpacity={0.8}
                onPress={() => this._clickItem(value)}
            >
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
                <View style={styles.container}>
                    {value === timezone && <Image source={enter_arrow} style={styles.arrow}/>}
                </View>
            </TouchableOpacity>
        );
    };

    render() {
        return (<WKGeneralBackground>
            <FlatList
                renderItem={this._renderItem}
                data={this.dataSource}
                initialNumToRender={10}
                keyExtractor={(item, index) => index.toString()}
                onLayout={e => { 
                    const height = e.nativeEvent.layout.height;
                    if (this.state.listHeight < height) {
                        this.setState({listHeight: height});
                    }
                }}
            />
        </WKGeneralBackground>);
    }

}

const styles = StyleSheet.create({
    cell: {
        borderRadius: 3,
        marginLeft: 5,
        marginRight: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 14,
        marginRight: 12,
    },
    container: {
        width: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        flex: 1,
        marginLeft: 10,
        color: Colors.white,
        fontSize: 16,
    },
    arrow: {
        width: 7,
        height: 14,
    },
})

export default TimeZonePage;
