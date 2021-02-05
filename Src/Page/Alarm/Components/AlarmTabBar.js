import React, {PureComponent} from 'react';
import {Tabs} from "@ant-design/react-native";
import PropTypes from 'prop-types';

export default class AlarmTabBar extends PureComponent {

    static propTypes = {
        tabs: PropTypes.array.isRequired,
        onTabChange: PropTypes.func,
        hideSlider: PropTypes.bool, // Just only used for EnergyPage, or don't use this props.
        tabBarBackgroundColor: PropTypes.string,
        underlineColor: PropTypes.string,
        tabBarInactiveTextColor: PropTypes.string,
    };

    static defaultProps = {
        hideSlider: false,
        tabBarBackgroundColor: Colors.theme,
        underlineColor: Colors.buttonBgColor,
        tabBarInactiveTextColor: Colors.placeholder,
    };

    _onChange = (tab, index) => {
        const {onTabChange} = this.props;
        onTabChange && onTabChange(tab, index);
    };

    _goToTab = (index) => {
        this.ref.goToTab(index);
    };

    render() {
        const tabs = this.props.tabs;
        const textWidthGap = 16;
        const textWidth = __SCREEN_WIDTH__ / tabs.length;
        const scrollLineWidth = 100;
        return (
            <Tabs
                ref={ref => this.ref = ref}
                tabs={tabs}
                initialPage={0}
                prerenderingSiblingsNumber={0}
                usePaged={false} // Android
                swipeable={false} // iOS
                onChange={this._onChange}
                tabBarTextStyle={{fontSize: 15, width: textWidth - textWidthGap, textAlign: 'center'}}
                tabBarBackgroundColor={this.props.hideSlider ? Colors.transparent : this.props.tabBarBackgroundColor}
                tabBarActiveTextColor={this.props.hideSlider ? Colors.transparent : this.props.underlineColor}
                tabBarUnderlineStyle={{
                    backgroundColor: this.props.hideSlider ? Colors.transparent : this.props.underlineColor,
                    width: scrollLineWidth,
                    marginLeft: (textWidth - scrollLineWidth) / 2
                }}
                // renderTabBar={(tabBarProps) => {
                //     console.warn(JSON.stringify(tabBarProps, null, 4))
                //     return <View style={{flexDirection: 'row'}}>
                //         {tabBarProps.tabs.map(() => <View style={{width: 20, height: 20, backgroundColor: 'red'}}/>)}
                //     </View>;
                // }}
                tabBarInactiveTextColor={this.props.hideSlider ? Colors.transparent : this.props.tabBarInactiveTextColor}
                styles={{
                    topTabBarSplitLine: {
                        borderBottomWidth: 0 // Hide separator line
                    }
                }}
            >
                {this.props.children}
            </Tabs>
        );
    }

}
