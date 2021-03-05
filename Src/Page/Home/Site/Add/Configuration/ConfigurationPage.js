
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
        {title: WK_T(wkLanguageKeys.configuaration_energy_rates), route: RouteKeys.EnergyRatesPage,
            info: 'Energy rates can help system make optimized operating strategy for you. You can complete this step later in site info.'},
        {title: WK_T(wkLanguageKeys.configuaration_device), route: RouteKeys.AddDevicePage,
            info: 'Register and set up the internet connection of your device.'},
    ];

    // static navigationOptions = () => ({title: WK_T(wkLanguageKeys.setting)});
    static navigationOptions = () => ({title: 'Configuration'});

    _clickItem = (route) => {
        if (route === RouteKeys.AddDevicePage) {
            const {navigation} = this.props;
            navigation.navigate(RouteKeys.AddDevicePage, {
                stationId: '',
                callback: sn => {this.setState({currentDeviceSN: sn})},
            });
        } else {
            this.props.navigation.navigate(route);
        }
    };

    _renderItem = ({item}) => {
        const {title, route, info} = item;
        return (
             <TouchableOpacity
                style={[styles.cell, {
                    borderBottomWidth: 2,
                    borderBottomColor: "rgb(34, 44, 63)",
                }]}
                activeOpacity={0.8}
                onPress={() => this._clickItem(route)}
            >
                <View style={styles.textView}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.learnMore} >{info}</Text>
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
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: Colors.cellBackgroundColor,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
        justifyContent: 'space-between',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textView: {
        flex: 1,
        color: Colors.white,
        fontSize: 16,
    },
    title: {
        marginBottom: 20,
        color: Colors.white,
        fontSize:24,
        fontWeight: 'bold'
    },
    learnMore: {
        color: Colors.placeholder,
        fontSize:16,
        lineHeight: 22
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
        borderRadius: 6,
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
