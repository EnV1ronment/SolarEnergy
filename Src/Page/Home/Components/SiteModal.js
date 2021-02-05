import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Image,
    TouchableWithoutFeedback,
} from 'react-native';
import PropTypes from 'prop-types';
import WKBottomLine from "../../../Common/Components/WKBottomLine";
import WKModal from "../../../Common/Components/WKModal";
import edit_site from '../../../Source/Status/edit_site.png';
import delete_site from '../../../Source/Status/delete_site.png';

const rowHeight = 40;
const headerViewHeight = 20;

export default class SiteModal extends Component {

    static propTypes = {
        titles: PropTypes.array,
        icons: PropTypes.array,
        select: PropTypes.func,
        close: PropTypes.func,
        cancelText: PropTypes.string,
    };

    static defaultProps = {
        titles: ['Edit', 'Delete'],
        icons: [edit_site, delete_site],
        cancelText: 'Cancel',
    };

    constructor(props) {
        super(props);
        const {titles} = props;
        const cancelButtonViewHeight = rowHeight * 2;
        this.tableViewHeight = headerViewHeight + titles.length * rowHeight + cancelButtonViewHeight + iosSafeAreaBottomHeight + 30;
        this.state = {
            translateYValue: new Animated.Value(this.tableViewHeight),  //This is the initial position of the subview
            visible: false,
        };
    }

    show = () => {
        this.setState({visible: true});
        Animated.timing(
            this.state.translateYValue,
            {
                toValue: 0,
                duration: 150,
            },
        ).start();
    };

    hideWithoutAnimation = (callback) => {
        Animated.timing(
            this.state.translateYValue,
            {
                toValue: this.tableViewHeight,
                duration: 5,
            },
        ).start(() => {
            this.setState({visible: false}, () => {
                setTimeout(() => {
                    callback && callback();
                }, 70);
            });
        });
    };

    hide = () => {
        Animated.timing(
            this.state.translateYValue,
            {
                toValue: this.tableViewHeight,
                duration: 150,
            },
        ).start(() => {
            this.setState({visible: false});
        });
    };

    _select = index => {
        const {select} = this.props;
        select && select(index);
        this.hide();
    };

    _close = () => {
        const {close} = this.props;
        close && close();
        this.hide();
    };

    render() {
        const {
            titles,
            icons,
            cancelText,
        } = this.props;
        const {visible} = this.state;
        return (
            <WKModal
                visible={visible}
                transparent={true}
                animationType={'fade'}
                presentationStyle={'overFullScreen'}
                onRequestClose={this._close}
            >
                <View style={styles.container}>
                    <TouchableOpacity style={styles.container} onPress={this._close} activeOpacity={1}>
                        <TouchableWithoutFeedback>
                            <Animated.View style={[styles.list, {
                                transform: [{translateY: this.state.translateYValue}],
                                height: this.tableViewHeight,
                                marginTop: __SCREEN_HEIGHT__ - this.tableViewHeight,
                            }]}>
                                <View style={styles.headerView}/>
                                    {/*<View style={styles.headerShortLine}/>*/}
                                {/*</View>*/}
                                {
                                    titles.map((item, index) => (<View key={index}>
                                        <TouchableOpacity
                                            style={styles.button}
                                            activieOpacity={0.8}
                                            onPress={() => this._select(index)}
                                        >
                                            <Image source={icons[index]} style={styles.icon}/>
                                            <Text style={styles.title}>{item}</Text>
                                        </TouchableOpacity>
                                        <WKBottomLine style={styles.bottomLine}/>
                                    </View>))
                                }
                                <TouchableOpacity style={styles.cancelButton} onPress={this._close}>
                                    <Text style={styles.cancelButtonText}>{cancelText}</Text>
                                </TouchableOpacity>
                                <View style={{height: iosSafeAreaBottomHeight + 30}}/>
                            </Animated.View>
                        </TouchableWithoutFeedback>
                    </TouchableOpacity>
                </View>
            </WKModal>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },

    // Header
    headerView: {
        alignItems: 'center',
        height: headerViewHeight,
    },
    headerShortLine: {
        marginTop: 5,
        width: 35,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: "#dedede",
    },

    // Content
    list: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    button: {
        flexDirection: 'row',
        height: rowHeight,
        marginLeft: 15,
        alignItems: 'center',
    },
    icon: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
    },
    title: {
        marginLeft: 20,
        fontSize: 14,
        color: '#333333',
    },
    bottomLine: {
        height: 1,
        backgroundColor: '#f1f1f1',
        marginRight: 5,
        marginLeft: 50,
    },

    // Cancel button
    cancelButton: {
        width: 180,
        height: rowHeight,
        marginTop: 30,
        borderRadius: 20,
        backgroundColor: "#dedede",
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 12,
        color: "#333333",
    },
});
