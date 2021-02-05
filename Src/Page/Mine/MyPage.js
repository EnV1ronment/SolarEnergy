import React, {Component} from 'react';
import {DeviceEventEmitter} from 'react-native';
import WKGeneralBackground from "../../Common/Components/WKGeneralBackground";
import MyPageView from "./Components/MyPageView";
import WKFetch from "../../Network/WKFetch";
import {StackActions, NavigationActions} from 'react-navigation';
import {connect} from 'react-redux';

class MyPage extends Component {

    static navigationOptions = () => ({title: WK_T(wkLanguageKeys.me)});

    componentDidMount() {
        this._addObserver();
    }

    componentWillUnmount() {
        this._removeObserver();
    }

    _loadData = (loading = true) => {
        loading && WKLoading.show();
        WKFetch('/setting/user/info').then(ret => {
            WKLoading.hide();
            const {ok, errorMsg, data} = ret;
            if (ok && data.results && data.results.name) {
                this.setState({account: data.results.name});
            } else {
                WKToast.show(errorMsg);
            }
        });
    };

    _addObserver = () => {
        this.languageListener = DeviceEventEmitter.addListener(EmitterEvents.MULTI_LANGUAGE, this._resetRoute);
    };

    _resetRoute = () => {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({routeName: RouteKeys.BottomTabBar}),
            ],
        });
        this.props.navigation.dispatch(resetAction);
        this.props.navigation.navigate(RouteKeys.MyPage);
        this.props.navigation.navigate(RouteKeys.SettingsPage);
    };

    _removeObserver = () => {
        this.languageListener && this.languageListener.remove();
    };

    _clickItem = (route) => {
        const {navigation} = this.props;
        navigation.navigate(route);
    };

    render() {
        return (<WKGeneralBackground>
            <MyPageView
                clickItem={this._clickItem}
                account={this.props.userName}
            />
        </WKGeneralBackground>);
    }

}

const mapStateToProps = state => ({
    userName: state.userReducer.userName,
});

export default connect(mapStateToProps)(MyPage);
