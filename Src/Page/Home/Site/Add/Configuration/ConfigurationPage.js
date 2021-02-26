
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
import Languages from "../../../../../Common/MultiLanguage/Languages";

const rowHeight = 50;
const marginTopOfFirstRow = 15;
const marginTopOfRow = 6;

class ConfigurationPage extends Component {

    state = {
        language: WK_GetCurrentLocale(),
        listHeight: 0,
    };

    dataSource = [
        {title: WK_T(wkLanguageKeys.configuaration_energy_rates), route: RouteKeys.AccountPage},
        {title: WK_T(wkLanguageKeys.configuaration_device), route: RouteKeys.AddDevicePage},
    ];

    // static navigationOptions = () => ({title: WK_T(wkLanguageKeys.setting)});
    static navigationOptions = () => ({title: 'ConfigurationPage'});

    _clickItem = (route) => {
        if (route === RouteKeys.AddDevicePage) {
            const {navigation} = this.props;
            navigation.navigate(RouteKeys.AddDevicePage, {
                stationId: '',
                stationCode: '',
                callback: sn => this.setState({currentDeviceSN: sn}),
            });
        } else {
            this.props.navigation.navigate(route);
        }
    };

    _renderItem = ({item, index}) => {
        const {title, route} = item;
        const {language} = this.state;
        return (
            <TouchableOpacity
                style={[styles.cell, {
                    height: rowHeight,
                    marginTop: index ? marginTopOfRow : marginTopOfFirstRow,
                }]}
                activeOpacity={0.8}
                onPress={() => this._clickItem(route)}
            >
                <Text style={styles.title}>{title}</Text>
                <View style={styles.languageContainer}>
                    {route === RouteKeys.LanguagePage && <Text style={styles.language}>{Languages[language]}</Text>}
                    <Image source={enter_arrow} style={styles.arrow}/>
                </View>
            </TouchableOpacity>
        );
    };

    render() {
        const {
            listHeight,
            visible,
        } = this.state;
        const totalEachRowHeight = rowHeight + marginTopOfRow;
        const listContentHeight = (totalEachRowHeight * this.dataSource.length - 1) + marginTopOfFirstRow;
        const listFooterHeight = listHeight - listContentHeight;
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
        backgroundColor: Colors.cellBackgroundColor,
        marginLeft: 5,
        marginRight: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 8,
    },
    languageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    language: {
        marginRight: 10,
        fontSize: 11,
        color: Colors.placeholder,
    },
    title: {
        marginLeft: 10,
        color: Colors.white,
        fontSize: 14,
    },
    arrow: {
        width: 5,
        height: 9,
    },
})

export default ConfigurationPage;
