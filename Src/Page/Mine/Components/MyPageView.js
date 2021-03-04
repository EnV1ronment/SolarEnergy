import React, {Component} from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    ImageBackground,
} from 'react-native';
import {StackActions, NavigationActions} from 'react-navigation';
import WKFetch from "../../../Network/WKFetch";
import Languages from "../../../Common/MultiLanguage/Languages";
import PropTypes from 'prop-types';
import Clipboard from '@react-native-community/clipboard';
import UserInfoModel from "../../../Model/UserInfoModel";
import WKPresenter from "../../../Common/Components/WKPresenter";
import LogoutButton from "../Settings/Components/LogoutButton";
import {connect} from 'react-redux';
import {needPush} from '../../../../app';

// Icons
import enter_arrow from '../../../Source/Common/enter_arrow.png';
import copy_account from '../../../Source/Common/enter_arrow.png';
import edit_nickName from '../../../Source/Common/enter_arrow.png';
import me_portrait_icon from '../../../Source/Me/me_portrait_icon.png';

const rowHeight = 50;
const marginTopOfFirstRow = 15;
const marginTopOfRow = 6;
export default class MyPageView extends Component {

    static propTypes = {
        account: PropTypes.string.isRequired,
        phone: PropTypes.string.isRequired,
        nickName: PropTypes.string.isRequired,
        clickItem: PropTypes.func.isRequired,
        resetRoute: PropTypes.func.isRequired
    };

    state = {
        isEdit: false,
        title: '',
        visible: false,
        language: WK_GetCurrentLocale(),
        listHeight: 0,
    };
    dataSource = [
        {
            title: WK_T(wkLanguageKeys.account_setting),
            route: RouteKeys.AccountPage,
            end: false,
        },{
            title: WK_T(wkLanguageKeys.account_setting),
            route: RouteKeys.AccountPage,
            end: true,
        },{
            title: null,
            route: null,
            end: false,
        },{
            title: WK_T(wkLanguageKeys.about),
            route: RouteKeys.AboutPage,
            end: false,
        },{
            title: WK_T(wkLanguageKeys.faq),
            route: RouteKeys.FAQPage,
            end: false,
        },{
            title: WK_T(wkLanguageKeys.faq),
            route: RouteKeys.FAQPage,
            end: true,
        }
    ];

    _keyExtractor = (item, index) => index.toString();

    _clickItem = (route) => {
        const {clickItem} = this.props;
        clickItem && clickItem(route);
    };

    _renderItem = ({item}) => {
        const {title, route, end} = item;
        let bottomBorderStyle = {
            borderBottomWidth: 2,
            borderBottomColor: 'rgb(34, 44, 63)'
        };
        let itemAreaStyle = end ? styles.itemArea : [styles.itemArea, bottomBorderStyle];
        if(route){
            return (
                <TouchableOpacity style={styles.cell} activeOpacity={0.8} onPress={() => this._clickItem(route)}>
                    <View style={itemAreaStyle}>
                        <View style={styles.left}>
                            <Text style={styles.title}>{title}</Text>
                        </View>
                        <Image source={enter_arrow} style={styles.arrow}/>
                    </View>
                </TouchableOpacity>
            );
        }else{
            return (
                <View style={styles.splitItem}/>
            );
        }
    };

    _editNickName = () => {
        this.setState({isEdit: !this.state.isEdit})
    };

    _commitNickName = (e) => {

        this.setState({title: e.nativeEvent.text, 
            isEdit: false,});
    };

    _getPhone = () => {
        const {phone} = this.props;
        return phone.substr(0, 3) + '****' + phone.substr(7);
    };

    _handleClipboardContent = async (item) => {
        //设置内容到剪贴板
        Clipboard.setString(item);
        //从剪贴板获取内容
        // Clipboard.getString().then( (content)=>{
        //     alert('content: '+content)
        // }, (error)=>{
        //     console.warn('error:'+error);
        // })
    };

    _renderHeader = (isEdit) => {
        const {nickName, account} = this.props;
        return (
            <ImageBackground style={styles.header}>
                <View style={styles.info}>
                    <Text style={styles.phone}>{this._getPhone()}</Text>
                    
                        {isEdit ?(
                        <View style={styles.nickNameArea}>
                            <TextInput
                                keyboardType={'default'}
                                placeholderTextColor={Colors.placeholder}
                                selectionColor={Colors.white}
                                autoFocus={false}
                                style={styles.textInput}
                                maxLength={16}
                                defaultValue={this.state.title}
                                placeholder={'Please enter site title'}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                secureTextEntry={false}
                                blurOnSubmit={true}
                                onSubmitEditing={(e) => this._commitNickName(e)}
                                returnKeyType={'done'}/>
                        </View>) :(
                        <View style={styles.nickNameArea}>
                            <Text style={styles.nickName}>{nickName}</Text>
                            <TouchableOpacity activeOpacity={0.8} onPress={() => this._editNickName()}>
                            <Image source={edit_nickName} style={styles.edit_nickName}/>
                        </TouchableOpacity>
                    </View>)}
                        
                    <View style={styles.accountArea}>
                        <Text style={styles.account}>ID: {account}</Text>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => this._handleClipboardContent(account)}>
                            <Image source={copy_account} style={styles.copy_account}/>
                        </TouchableOpacity>

                    </View>
                </View>
                <Image source={me_portrait_icon} style={styles.portrait}/>
            </ImageBackground>
        );
    };

    _logout = () => {
        this.setState({
            visible: true,
        });
    };

    _hideModal = () => {
        this.setState({
            visible: false
        });
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
        this.props.resetRoute();
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

    render() {
        const {isEdit, visible, listHeight} = this.state;
        const totalEachRowHeight = rowHeight + marginTopOfRow;
        const listContentHeight = (totalEachRowHeight * this.dataSource.length - 1) + marginTopOfFirstRow;
        const listFooterHeight = listHeight - listContentHeight;
        return (<View style={styles.container}>
            <FlatList
                renderItem={this._renderItem}
                data={this.dataSource}
                initialNumToRender={10}
                keyExtractor={this._keyExtractor}
                ListHeaderComponent={()=>this._renderHeader(isEdit)}
                extraData={this.props}
                ListFooterComponent={() => (<LogoutButton
                    height={listFooterHeight}
                    click={this._logout}/>)
                }
            />
            <WKPresenter
                visible={visible}
                message={WK_T(wkLanguageKeys.sure_to_logout)}
                leftButtonText={WK_T(wkLanguageKeys.cancel)}
                leftButtonClick={this._hideModal}
                defaultButtonText={WK_T(wkLanguageKeys.confirm)}
                defaultButtonClick={this._confirmLogOut}
            />
        </View>);
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        marginTop: 15,
        marginBottom: 5,
        marginLeft: 5,
        marginRight: 5,
        height: 160,
        borderRadius: 3,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
    },
    portrait: {
        marginLeft: 10,
        marginRight: 10,
        width: 108,
        height: 108,
    },
    info: {
        flex: 1,
    },
    accountArea: {
        width: 150,
        height: 26,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.cellBackgroundColor,
        borderRadius: 10,
        flexDirection: 'row',
    },
    copy_account: {
        marginLeft: 5,
        width: 15,
        height: 14
    },    
    account: {
        fontSize: 14,
        marginTop: 5,
        color: Colors.placeholderColor,
    },
    phone: {
        fontSize: 16,
        color: Colors.placeholderColor,
    },
    nickNameArea: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    nickName: {
        fontSize: 26,
        color: Colors.white,
        marginTop: 21,
        marginBottom: 21
    },
    edit_nickName: {
        marginLeft: 5,
        width: 15,
        height: 14
    },
    textInput: {
        flex: 1,
        height: 40,
        fontSize: 26,
        color: Colors.white,
        marginTop: 21,
        marginBottom: 21,
        color: Colors.white,
        paddingVertical: 0, // make text show whole on Android
    },
    cell: {
        height: 60,
        backgroundColor: Colors.cellBackgroundColor,
        paddingLeft: 17,
        paddingRight: 13,
    },
    itemArea: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 10
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    leftIcon: {
        width: 15,
        height: 14
    },
    title: {
        marginLeft: 10,
        color: Colors.cellFontColor,
        fontSize: 16
    },
    arrow: {
        width: 7,
        height: 14,
    },
    splitItem: {
        height: 16
    }
});
