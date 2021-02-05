import React, {Component} from 'react';
import {Tabs} from "@ant-design/react-native";
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
} from "react-native";

const tabBarActiveColor = '#3285fe';
const tabBarInactiveColor = '#999';

export default class SiteTabBar extends Component {

    render() {
        const tabs = [{title: 'Site Info'}, {title: 'Electricity Rates'}];
        return (
            <Tabs
                // style={{backgroundColor: 'green'}}
                animated={isIOS} // Bug on Android on some device such as JinPei's phone.
                ref={ref => this.ref = ref}
                tabs={tabs}
                initialPage={0}
                prerenderingSiblingsNumber={2}
                usePaged={false}  // Android
                swipeable={false} // iOS
                renderTabBar={tabBarProps => {
                    return <View style={{flexDirection: 'row'}}>
                        {tabBarProps.tabs.map((item, index) => {
                            const selected = tabBarProps.activeTab === index;
                            return <TouchableOpacity
                                key={index}
                                activeOpacity={1}
                                style={{alignItems: 'center'}}
                                onPress={() => this.ref.goToTab(index)}>
                                <Text style={[styles.tabBarText, {
                                    color: selected ? tabBarActiveColor : tabBarInactiveColor,
                                }]}>{item.title}</Text>
                                {selected &&
                                <View style={[styles.underline, {width: (index + 1) * 45}]}/>}
                            </TouchableOpacity>;
                        })}
                    </View>;
                }}
            >
                {this.props.children}
            </Tabs>
        );
    }

}

const styles = StyleSheet.create({
    tabBarText: {
        fontSize: 13,
        padding: 10,
        paddingLeft: 15,
    },
    underline: {
        marginLeft: 2,
        height: 1.5,
        backgroundColor: tabBarActiveColor,
    },
});
