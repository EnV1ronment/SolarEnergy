import React, {Component} from 'react';
import {
    View,
    Modal,
    TouchableOpacity,
    Text,
    StyleSheet,
    SectionList,
    Keyboard,
    Vibration,
} from 'react-native';
import PropTypes from 'prop-types';
import Countries from '../../../../Common/Constant/Countries';
import WKBottomLine from "../../../../Common/Components/WKBottomLine";
import WKSearchBar from "../../../../Common/Components/WKSearchBar";
import WKModal from "../../../../Common/Components/WKModal";

const ITEM_HEIGHT = 40; // height of item
const HEADER_HEIGHT = 24;  // height of section header

export default class SelectCountryModal extends Component {

    static propTypes = {
        clickItem: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            list: Countries, // 233 items
            visible: false,
        };
        this._setItemLayout(Countries);
    }

    show = () => this.setState({visible: true});

    hide = () => {
        this.setState({
            visible: false,
            list: Countries,
        }, () => {
            this._setItemLayout(Countries);
        });
    };

    // Calculate length and offset of every index
    _setItemLayout = (list) => {

        // // Avoid repetitive calculation.
        // if (this.layoutList) return;

        let [itemHeight, headerHeight] = [ITEM_HEIGHT, HEADER_HEIGHT];
        let layoutList = [];
        let layoutIndex = 0;
        let layoutOffset = 0;
        list.forEach((section) => {
            layoutList.push({
                index: layoutIndex,
                length: headerHeight,
                offset: layoutOffset,
            });
            layoutIndex += 1;
            layoutOffset += headerHeight;
            section.data.forEach(() => {
                layoutList.push({
                    index: layoutIndex,
                    length: itemHeight,
                    offset: layoutOffset,
                });
                layoutIndex += 1;
                layoutOffset += itemHeight;
            });
            layoutList.push({
                index: layoutIndex,
                length: 0,
                offset: layoutOffset,
            });
            layoutIndex += 1;
        });
        this.layoutList = layoutList;
    };

    _hideKeyboard = () => Keyboard.dismiss();

    _onSectionSelect = (sectionIndex) => {
        this._hideKeyboard();
        Vibration.vibrate(10);
        this.sectionList.scrollToLocation({
            animated: false,
            sectionIndex: sectionIndex,
            itemIndex: 0
        });
    };

    _clickItem = (item) => {
        this.hide();
        const {clickItem} = this.props;
        clickItem && clickItem(item);
    };

    _renderItem = ({item, index, section}) => {
        return (
            <View>
                <TouchableOpacity
                    style={styles.item}
                    onPress={() => this._clickItem(item)}
                    activeOpacity={0.8}
                >
                    <Text style={styles.itemName}>{item.Name}</Text>
                    <Text style={styles.itemCode}>+{item.Code}</Text>
                </TouchableOpacity>
                <WKBottomLine style={{marginRight: 0}}/>
                {/*{index === (section.data.length - 1) ? <View style={{height: 0.5}}/> :*/}
                {/*    <WKBottomLine style={{marginRight: 0}}/>}*/}
            </View>
        );
    };

    _renderHeader = ({section}) => {
        return (<View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderTxt}>{section.title}</Text>
        </View>);
    };

    _keyExtractor = item => item.Name;

    _renderNavigationBar = () => {
        return (
            <View style={styles.navigationBarContainer}>
                <TouchableOpacity style={{width: 65}} onPress={this.hide}>
                    <Text style={styles.cancel}>{WK_T(wkLanguageKeys.cancel)}</Text>
                </TouchableOpacity>
                <Text style={styles.selectCountry}>{WK_T(wkLanguageKeys.country_area)}</Text>
                <View style={{width: 65}}/>
            </View>
        );
    };

    _onChangeText = (text) => {
        const copyList = Countries.slice();
        const res = copyList.map(obj => {
            const data = obj.data.filter(item => {
                return item.Name.toLocaleLowerCase().indexOf(text.toLocaleLowerCase()) >= 0
            });
            return {
                title: obj.title,
                data: data
            };
        });
        this.setState({
            list: res.filter(item => item.data.length > 0)
        });
        this._setItemLayout(res);
    };

    _renderEmpty = () => {
        return (<View style={styles.emptyView}>
            <Text style={styles.emptyText}>{WK_T(wkLanguageKeys.no_result)}</Text>
        </View>);
    };

    render() {
        const {visible} = this.state;
        return (
            <View style={styles.container}>
                <WKModal
                    presentationStyle={'overFullScreen'}
                    visible={visible}
                    animationType={'slide'}
                    onRequestClose={this.hide}
                    bgColor={null}
                >
                    <View style={styles.cover}>
                        {this._renderNavigationBar()}
                        <WKSearchBar onChangeText={this._onChangeText}/>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <SectionList
                                ref={ref => this.sectionList = ref}
                                showsVerticalScrollIndicator={false}
                                keyboardDismissMode={'on-drag'}
                                // getItemLayout={this._getItemLayout}
                                getItemLayout={(data, index) => {
                                    // console.warn(index, this.layoutList.filter(n => n.index === index)[0])
                                    return this.layoutList.filter(n => n.index === index)[0];
                                    // return {index: index, length: ITEM_HEIGHT, offset: HEADER_HEIGHT};
                                }}
                                keyExtractor={this._keyExtractor}
                                sections={this.state.list}
                                renderItem={this._renderItem}
                                renderSectionHeader={this._renderHeader}
                                ListEmptyComponent={this._renderEmpty}
                                extraData={this.state}
                            />
                            <View style={styles.sectionTitleList}>
                                {
                                    this.state.list.map((item, sectionIndex) => {
                                        return (<TouchableOpacity
                                            key={sectionIndex}
                                            style={{
                                                paddingVertical: 0.5,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                            onPress={() => this._onSectionSelect(sectionIndex)}
                                        >
                                            <Text style={styles.titleText}>
                                                {item.title}
                                            </Text>
                                        </TouchableOpacity>);
                                    })
                                }
                            </View>
                        </View>
                    </View>
                </WKModal>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        position: 'absolute'
    },
    cover: {
        flex: 1,
        backgroundColor: Colors.theme
    },
    navigationBarContainer: {
        flexDirection: 'row',
        height: __iosSafeAreaTopHeight__ + (__isAndroid__ ? 15 : 0),
        alignItems: 'center',
        paddingTop: __iosStatusBarHeight__ + (__isAndroid__ ? 15 : 0),
    },
    cancel: {
        paddingLeft: 15,
        color: Colors.white,
        fontSize: 14
    },
    selectCountry: {
        width: __SCREEN_WIDTH__ - 130,
        color: Colors.white,
        textAlign: 'center',
        fontSize: 16
    },
    item: {
        paddingLeft: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: ITEM_HEIGHT - 0.5,
        alignItems: 'center'
    },
    itemName: {
        marginLeft: 5,
        color: Colors.white,
        fontSize: 13
    },
    itemCode: {
        color: Colors.placeholder,
        fontSize: 13
    },
    sectionHeader: {
        height: HEADER_HEIGHT,
        paddingLeft: 10,
        justifyContent: 'center',
        backgroundColor: '#111d46',
    },
    sectionHeaderTxt: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.white
    },
    sectionTitleList: {
        marginTop: 50,
        height: __SCREEN_HEIGHT__ - (__iosSafeAreaTopHeight__ + (__isAndroid__ ? 15 : 0) + 150),
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    titleText: {
        width: 25,
        paddingLeft: 10,
        fontSize: 12,
        color: Colors.white,
        textAlign: 'center',
    },
    emptyView: {
        height: 350,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: Colors.placeholder,
        fontSize: 14,
    }
});
