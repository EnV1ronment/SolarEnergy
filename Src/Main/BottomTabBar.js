import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {createBottomTabNavigator, getActiveChildNavigationOptions} from 'react-navigation';

// pages
import HomePage from "../Page/Home/HomePage";
import AlarmPage from "../Page/Alarm/AlarmPage";
import EnergyPage from "../Page/Energy/EnergyPage";
import MyPage from "../Page/Mine/MyPage";

// icons
import home_active_tab from '../Source/Common/home_active_tab.png';
import home_inactive_tab from '../Source/Common/home_inactive_tab.png';
import alarm_active_tab from '../Source/Common/alarm_active_tab.png';
import alarm_inactive_tab from '../Source/Common/alarm_inactive_tab.png';
import energy_active_tab from '../Source/Common/energy_active_tab.png';
import energy_inactive_tab from '../Source/Common/energy_inactive_tab.png';
import me_active_tab from '../Source/Common/me_active_tab.png';
import me_inactive_tab from '../Source/Common/me_inactive_tab.png';

// Constants
const HEADER_TITLE_TO_TAB_BAR = {
    HOME: WK_T(wkLanguageKeys.status),
    ALARM: WK_T(wkLanguageKeys.alarm),
    ENERGY: WK_T(wkLanguageKeys.energy),
    ME: WK_T(wkLanguageKeys.me),
    NULL: ''
};

export default function BottomTabBar() {

    const BottomTabNavigator = createBottomTabNavigator({
        HomePage: {
            screen: HomePage,
            navigationOptions: () => ({
                tabBarIcon: ({focused}) => {
                    const icon = focused ? home_active_tab : home_inactive_tab;
                    return <Image style={styles.tabBarIcon} source={icon}/>;
                },
            })
        },
        AlarmPage: {
            screen: AlarmPage,
            navigationOptions: () => ({
                tabBarIcon: ({focused}) => {
                    const icon = focused ? alarm_active_tab : alarm_inactive_tab;
                    return <Image style={styles.tabBarIcon} source={icon}/>;
                }
            })
        },
        // EnergyPage: {
        //     screen: EnergyPage,
        //     navigationOptions: () => ({
        //         tabBarIcon: ({focused}) => {
        //             const icon = focused ? energy_active_tab : energy_inactive_tab;
        //             return <Image style={styles.tabBarIcon} source={icon}/>;
        //         }
        //     })
        // },
        MyPage: {
            screen: MyPage,
            navigationOptions: () => ({
                tabBarIcon: ({focused}) => {
                    const icon = focused ? me_active_tab : me_inactive_tab;
                    return <Image style={styles.tabBarIcon} source={icon}/>;
                }
            })
        }
    }, {
        initialRouteName: RouteKeys.HomePage,
        tabBarOptions: {
            showLabel: false, // hide tab bar label text
            style: {
                backgroundColor: Colors.bottomTabTheme // set tab bar background Color
            }
        },

        // backBehavior: RouteKeys.HomePage      // 未知属性，先放着
    });

    // https://github.com/react-navigation/react-navigation/commit/3ac5f412b7baaaa3bd5987c8ef0ff9303d0d7bba
    BottomTabNavigator.navigationOptions = ({navigation, screenProps}) => {
        const childOptions = getActiveChildNavigationOptions(navigation, screenProps);
        const {routeName} = navigation.state.routes[navigation.state.index];
        const defaultHeaderTitle = getDefaultHeaderTitle(routeName);
        return {
            title: childOptions.title || defaultHeaderTitle,
            headerLeft : childOptions.headerLeft, // Use inner stack navigation options to customize left item
            headerRight: childOptions.headerRight // Use inner stack navigation options to customize right item
        };
    };

    return BottomTabNavigator;
}

function getDefaultHeaderTitle(routeName) {
    let title = HEADER_TITLE_TO_TAB_BAR.NULL;
    if (routeName === RouteKeys.HomePage) {
        title = HEADER_TITLE_TO_TAB_BAR.HOME;
    } else if (routeName === RouteKeys.AlarmPage) {
        title = HEADER_TITLE_TO_TAB_BAR.ALARM;
    } else if (routeName === RouteKeys.EnergyPage) {
        title = HEADER_TITLE_TO_TAB_BAR.ENERGY;
    } else if (routeName === RouteKeys.MyPage) {
        title = HEADER_TITLE_TO_TAB_BAR.ME;
    }
    return title;
}

const styles = StyleSheet.create({
    tabBarIcon: {
        width: 22,
        height: 19
    }
});
