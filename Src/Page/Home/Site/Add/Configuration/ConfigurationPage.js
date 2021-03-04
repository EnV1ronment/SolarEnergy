
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    View,
} from 'react-native';
import {StackActions, NavigationActions} from 'react-navigation';
import WKGeneralBackground from "../../../../../Common/Components/WKGeneralBackground";
import enter_arrow from '../../../../../Source/Common/enter_arrow.png';

class ConfigurationPage extends Component {

    state = {
    };

    dataSource = [
        {title: WK_T(wkLanguageKeys.configuaration_energy_rates), route: RouteKeys.EnergyRatesPage},
        {title: WK_T(wkLanguageKeys.configuaration_device), route: RouteKeys.AddDevicePage},
    ];

    // static navigationOptions = () => ({title: WK_T(wkLanguageKeys.setting)});
    static navigationOptions = () => ({title: 'Configuration'});

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

    _renderItem = ({item}) => {
        const {title, route} = item;
        return (
             <TouchableOpacity
                style={[styles.cell, {
                    height: 60,
                    borderBottomWidth: 2,
                    borderBottomColor: "rgb(34, 44, 63)",
                }]}
                activeOpacity={0.8}
                onPress={() => this._clickItem(route)}
            >
                <View style={styles.textView}>
                    <Text style={styles.title} numberOfLines={1}>{title}</Text>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => this._learnMore(item)}
                    >
                        <Text style={styles.learnMore} numberOfLines={1}>learn more</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.container}>
                    <Image source={enter_arrow} style={styles.arrow}/>
                </View>
            </TouchableOpacity>
        );
    };

    _learnMore = (item) => {
        console.warn(item)
    };

    _skip = () => {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({routeName: RouteKeys.BottomTabBar}),
            ],
        });
        this.props.navigation.dispatch(resetAction);
    }

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
             <View style={styles.bottomButtonContainer}>
                    <TouchableOpacity
                        style={styles.bottomButton}
                        onPress={this._skip}
                        activeOpacity={0.5}
                    >
                        <Text style={styles.bottomButtonText}>Skip</Text>
                    </TouchableOpacity>
                </View>
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
    textView: {
        flex: 1,
        marginLeft: 10,
        flexDirection: 'row',
        color: Colors.white,
        fontSize: 16,
    },
    title: {
        marginLeft: 10,
        color: Colors.white,
        fontSize: 16,
    },
    learnMore: {
        flex: 1,
        height: 60,
        marginLeft: 20,
        marginTop: 2,
        color: Colors.buttonBgColor,
        textDecorationLine: 'underline',
        fontSize: 14,
    },
    arrow: {
        width: 7,
        height: 14,
    },
     // Bottom button
     bottomButtonContainer: {
        height: 150,
        width: SCREEN_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 81 + iosSafeAreaBottomHeight,
    },
    bottomButton: {
        borderColor: Colors.buttonBgColor,
        borderWidth: 1,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        width: 240,
    },
    bottomButtonText: {
        color: Colors.buttonBgColor,
        fontSize:16,
    },
})

export default ConfigurationPage;
