import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    TextInput,
    Modal,
    ImageBackground,
} from 'react-native';
import PropTypes from 'prop-types';
import me_delete_edit_station_bg from '../../../../../Src/Source/Me/me_delete_edit_station_bg.png';
import me_delete_station from '../../../../../Src/Source/Me/me_delete_station.png';

// Icons
import enter_arrow from '../../../../Source/Common/enter_arrow.png';
import WKBottomLine from "../../../../Common/Components/WKBottomLine";
import WKEmptyView from "../../../../Common/Components/WKEmptyView";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scrollview";
import WKModal from "../../../../Common/Components/WKModal";

const cellHeight = 40;
const alertWidth = 92;
const alertHeight = 70;

export default class StationView extends Component {

    static propTypes = {
        needEditButton: PropTypes.bool, // Default is true
        pageRoute: PropTypes.string.isRequired,
        data: PropTypes.array.isRequired,
        didSelectCell: PropTypes.func,
        editItem: PropTypes.func,
        deleteItem: PropTypes.func.isRequired,
        onChangeText: PropTypes.func,
        onEndEditing: PropTypes.func,
        emptyText: PropTypes.string,
        reload: PropTypes.func
    };

    static defaultProps = {
        needEditButton: true,
        data: []
    };

    state = {
        index: 0,
        isLongPress: false,
        alertMarginLeft: 0,
        alertMarginTop: 0
    };

    _keyExtractor = (item, index) => index.toString();

    _onChangeText = (text) => {
        const {onChangeText} = this.props;
        onChangeText && onChangeText(text, this.state.index);
    };

    _onEndEditing = (text) => {
        const {onEndEditing} = this.props;
        onEndEditing && onEndEditing(text, this.state.index);
    };

    _didSelectCell = (index) => {
        const {didSelectCell} = this.props;
        didSelectCell && didSelectCell(index);
    };

    _delete = () => {
        this._hideAlert();
        const {deleteItem} = this.props;
        deleteItem && deleteItem(this.state.index);
    };

    _edit = () => {
        const {editItem} = this.props;
        editItem && editItem(this.state.index);
        // Caution: To make autoFocus take effect on Android that keyboard shows up automatically when beginning editing.
        this.setState({isLongPress: false}, () => {
            setTimeout(() => {
                this.textInputRef && this.textInputRef.focus();
            }, 100);
        });
    };

    _onLongPress = (evt, index) => {
        const {pageX, pageY, locationY} = evt.nativeEvent;
        let alertMarginLeft = pageX + 10;
        let alertMarginTop = pageY;
        if (pageX > __SCREEN_WIDTH__ / 2) {
            alertMarginLeft = pageX - alertWidth - 10
        }

        if (locationY > cellHeight / 2) {
            if (__isIOS__) {
                alertMarginTop -= 10;
            } else {
                alertMarginTop += (cellHeight / 2);
                alertMarginTop += 8;
            }
        } else {
            if (__isIOS__) {
                alertMarginTop += 10;
            } else {
                alertMarginTop += cellHeight;
                alertMarginTop += 3;
            }
        }

        this.setState({
            index,
            isLongPress: true,
            alertMarginLeft: alertMarginLeft,
            alertMarginTop: alertMarginTop
        });
    };

    _hideAlert = () => {
        this.setState({isLongPress: false});
    };

    _renderAlertView = () => {
        const {needEditButton} = this.props;
        return (<View style={{position: 'absolute'}}>
            <WKModal
                transparent={true}
                visible={this.state.isLongPress}
                onRequestClose={this._hideAlert}
                bgColor={null}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={this._hideAlert}
                    style={{flex: 1}}
                >
                    <TouchableOpacity style={[styles.modalAlertButton, {
                        marginLeft: this.state.alertMarginLeft,
                        marginTop: this.state.alertMarginTop,
                        height: needEditButton ? alertHeight : (alertHeight / 2)
                    }]} activeOpacity={1} onPress={() => {
                    }}>
                        <ImageBackground source={needEditButton ? me_delete_edit_station_bg : me_delete_station} resizeMode={'stretch'} style={{width: 92, height: needEditButton ? 70 : 35}}>
                            {needEditButton && <View style={styles.modalAlertView}>
                                <Text style={[styles.modalAlertCellText, {paddingTop: 10}]} onPress={this._edit}>{WK_T(wkLanguageKeys.edit)}</Text>
                            </View>}
                            <View style={styles.modalAlertView}>
                                <Text style={[styles.modalAlertCellText, {paddingTop: needEditButton ? 4 : 9}]} onPress={this._delete}>{WK_T(wkLanguageKeys.delete)}</Text>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                </TouchableOpacity>
            </WKModal>
        </View>);
    };

    _renderItem = ({item, index}) => {
        const {
            editable,
            title
        } = item;
        const isStationPage = this.props.pageRoute === RouteKeys.StationPage;
        const activeOpacity = isStationPage ? 0.6 : 1;
        return (
            <TouchableOpacity
                key={index}
                style={styles.cell}
                activeOpacity={activeOpacity}
                onPress={() => this._didSelectCell(index)}
                onLongPress={(evt) => this._onLongPress(evt, index)}
            >
                <View style={styles.left}>
                    <View style={styles.shadowDot}/>
                    {editable ? <TextInput
                        ref={ref => this.textInputRef = ref}
                        autoFocus={false} // Must be false. If true, keyboard won't show up automatically on android when beginning editing.
                        style={styles.inputText}
                        value={title}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        returnKeyType={'done'}
                        onChangeText={this._onChangeText}
                        onEndEditing={() => this._onEndEditing(title)}
                        contextMenuHidden={true} // Disable copy and paste
                    /> : <Text style={styles.textTitle} numberOfLines={1}>{title}</Text>}
                </View>
                {isStationPage && <Image source={enter_arrow} style={styles.arrow}/>}
                {this._renderAlertView()}
            </TouchableOpacity>
        );
    };

    render() {

        const {
            data,
            emptyText,
            reload
        } = this.props;

        return (<View style={styles.container}>
            <KeyboardAwareScrollView
                scrollToInputAdditionalOffset={150}
                automaticallyAdjustContentInsets={false} // Fix bug: top blank on iOS
                style={styles.container}
                getTextInputRefs={() => {
                    if (this.textInputRef) {
                        this.textInputRef.focus();
                        return [this.textInputRef];
                    }
                    return [];
                }}
            >
                <FlatList
                    renderItem={this._renderItem}
                    data={data}
                    initialNumToRender={20}
                    keyExtractor={this._keyExtractor}
                    keyboardDismissMode={'on-drag'}
                    ListEmptyComponent={() => (<WKEmptyView
                        emptyText={emptyText}
                        reload={() => reload && reload()}
                    />)}
                    extraData={this.state}
                />
            </KeyboardAwareScrollView>
        </View>);
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    cell: {
        height: cellHeight,
        borderRadius: 3,
        backgroundColor: '#121f4b',
        marginLeft: 5,
        marginRight: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 12,
        paddingRight: 8,
        marginTop: 5
    },
    left: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15
    },
    shadowDot: {
        width: 10,
        height: 10,
        backgroundColor: "#10ff37",
        borderRadius: 5,
        shadowColor: "#10ff37",
        shadowOpacity: 0.9,
        shadowOffset: {
            height: 1
        }
    },
    inputText: {
        marginLeft: 10,
        color: Colors.white,
        fontSize: 12,
        height: cellHeight - 6,
        width: __SCREEN_WIDTH__ - 70
    },
    textTitle: {
        marginLeft: 10,
        color: Colors.white,
        fontSize: 12
    },
    arrow: {
        width: 5,
        height: 9
    },
    modalAlertButton: {
        justifyContent: 'center',
        width: alertWidth
    },
    modalAlertView: {
        justifyContent: 'center'
    },
    modalAlertCellText: {
        width: 92,
        height: 35,
        paddingLeft: 15,
        color: Colors.white,
    }
});
