import React, {Component} from 'react';
import {
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    View,
} from 'react-native';
import {StackActions, NavigationActions} from 'react-navigation';
import WKGeneralBackground from "../../../Common/Components/WKGeneralBackground";
import enter_arrow from '../../../Source/Common/enter_arrow.png';
import WKFetch from "../../../Network/WKFetch";
import UserInfoModel from "../../../Model/UserInfoModel";
import WKPresenter from "../../../Common/Components/WKPresenter";
// import JPushModule from 'jpush-react-native';
import Languages from "../../../Common/MultiLanguage/Languages";
import styles from './Components/Styles';
import LogoutButton from "./Components/LogoutButton";
import {connect} from 'react-redux';
import {needPush} from '../../../../app';

const rowHeight = 50;
const marginTopOfFirstRow = 15;
const marginTopOfRow = 6;

class SettingsPage extends Component {

    state = {
        visible: false,
        language: WK_GetCurrentLocale(),
        listHeight: 0,
    };

    dataSource = [
        {title: WK_T(wkLanguageKeys.account_setting), route: RouteKeys.AccountPage},
        // {title: WK_T(wkLanguageKeys.share_setting), route: RouteKeys.SharePage},
        {title: WK_T(wkLanguageKeys.faq), route: RouteKeys.FAQPage},
        // {title: WK_T(wkLanguageKeys.language), route: RouteKeys.LanguagePage},
        {title: WK_T(wkLanguageKeys.about), route: RouteKeys.AboutPage},
    ];

    static navigationOptions = () => ({title: WK_T(wkLanguageKeys.setting)});

    _clickItem = (route) => {
        this.props.navigation.navigate(route);
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

    _logout = () => {
        this.setState({
            visible: true,
        });
    };

    _confirmLogOut = () => {

        this._hideModal();
        WKLoading.show();

        // If simulator or emulator. Execute this.
        if (__DEV__ || !needPush) {
            this._load();
            return;
        }

        // JPushModule.cleanTags(cleanTagsMap => {
        //     if (cleanTagsMap.errorCode === 0) {
        //         this._load();
        //         return;
        //     }
        //     JPushModule.getAllTags(allTagsMap => {
        //         if (allTagsMap && allTagsMap.tags && Array.isArray(allTagsMap.tags) && !allTagsMap.tags.length) {
        //             this._load();
        //             return;
        //         }
        //         if (allTagsMap.errorCode === 0) {
        //             JPushModule.deleteTags(allTagsMap.tags, deleteTagsMap => {
        //                 if (deleteTagsMap.errorCode === 0) {
        //                     this._load();
        //                     return;
        //                 }
        //                 WKLoading.hide();
        //                 WKToast.show(WK_T(wkLanguageKeys.logout_failed));
        //             });
        //             return;
        //         }
        //         WKLoading.hide();
        //         WKToast.show(WK_T(wkLanguageKeys.logout_failed));
        //     });
        // });
    };

    _load = () => {
        const {userName, userId} = this.props;
        // needPush && JPushModule.stopPush();
        WKStorage.setItem(CacheKeys.userInfo, new UserInfoModel(userName, ''));
        WKLoading.hide();
        this._resetRoute();
        // WKFetch('/login/logout', {
        //     name: userName,
        //     userId,
        // }, METHOD.POST).then(ret => {
        //     WKLoading.hide();
        //     if (ret.ok) {
        //         JPushModule.stopPush();
        //         WKStorage.setItem(CacheKeys.userInfo, new UserInfoModel(this.props.userName, ''));
        //         this._resetRoute();
        //     } else {
        //         WKToast.show(ret.errorMsg);
        //     }
        // });
    };

    _resetRoute = () => {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({
                    routeName: RouteKeys.LoginPage,
                }),
            ],
        });
        this.props.navigation.dispatch(resetAction);
    };

    _hideModal = () => {
        this.setState({
            visible: false
        });
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
                ListFooterComponent={() => (<LogoutButton
                    height={listFooterHeight}
                    click={this._logout}/>)
                }
                onLayout={e => {
                    const height = e.nativeEvent.layout.height;
                    if (this.state.listHeight < height) {
                        this.setState({listHeight: height});
                    }
                }}
            />
            <WKPresenter
                visible={visible}
                message={WK_T(wkLanguageKeys.sure_to_logout)}
                leftButtonText={WK_T(wkLanguageKeys.cancel)}
                leftButtonClick={this._hideModal}
                defaultButtonText={WK_T(wkLanguageKeys.confirm)}
                defaultButtonClick={this._confirmLogOut}
            />
        </WKGeneralBackground>);
    }

}

const mapStateToProps = state => ({
    userName: state.userReducer.userName,
    userId: state.userReducer.userId,
});

export default connect(mapStateToProps)(SettingsPage);
