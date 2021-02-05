import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated
} from 'react-native';
import PropTypes from 'prop-types';
import WKBottomLine from "../../../Common/Components/WKBottomLine";
import WKModal from "../../../Common/Components/WKModal";

const list_height = 161 + __iosSafeAreaBottomHeight__;

export default class EnergyDateModal extends Component {

    static propTypes = {
        dateTitles: PropTypes.array,
        visible: PropTypes.bool.isRequired,
        selectDateTypeIndex: PropTypes.number.isRequired,
        selectDateCallback: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired
    };

    static defaultProps = {
        visible: false
    };

    state = {
        translateYValue: new Animated.Value(list_height)  //This is the initial position of the subview
    };

    constructor(props) {
        super(props);
        this.dates = props.dateTitles || [
            WK_T(wkLanguageKeys.date_day),
            WK_T(wkLanguageKeys.date_week),
            WK_T(wkLanguageKeys.date_month),
            WK_T(wkLanguageKeys.date_range),
        ];
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.visible !== nextProps.visible) {
            this._beginTranslation();
        }
        return true;
    }

    _beginTranslation = () => {
        Animated.spring(
            this.state.translateYValue,
            {
                toValue: 0,
                friction: 5,
            }
        ).start();
    };

    _select = (index) => {
        this.setState({
            translateYValue: new Animated.Value(list_height)
        }, () => {
            const {selectDateCallback} = this.props;
            selectDateCallback && selectDateCallback(index);
        });
    };

    _onClose = () => {
        this.setState({
            translateYValue: new Animated.Value(list_height)
        }, () => {
            const {onClose} = this.props;
            onClose && onClose();
        });
    };

    render() {
        const {
            visible,
            selectDateTypeIndex,
            selectDateCallback,
            onClose
        } = this.props;
        if (!selectDateCallback || !onClose || typeof selectDateCallback !== 'function' || typeof onClose !== 'function') {
            console.error('Class EnergyDateModal, line: 83, error: selectCallBack and onClose functions are required');
            return null;
        }
        return (
                <WKModal
                    visible={visible}
                    transparent={true}
                    animationType={'fade'}
                    presentationStyle={'overFullScreen'}
                    onRequestClose={this._onClose}
                >
                    <View style={styles.container}>
                    <TouchableOpacity style={styles.container} onPress={this._onClose} activeOpacity={1}>
                        <Animated.View style={[styles.list, {transform: [{translateY: this.state.translateYValue}]}]}>
                            {
                                this.dates.map((item, index) => {
                                    const titleColor = index === selectDateTypeIndex ? {color: Colors.buttonBgColor} : {color: Colors.white};
                                    return (<View key={index}>
                                        <TouchableOpacity
                                            style={styles.button}
                                            activieOpacity={0.8}
                                            onPress={() => this._select(index)}
                                        >
                                            <Text style={[styles.title, titleColor]}>{item}</Text>
                                        </TouchableOpacity>
                                        <WKBottomLine style={styles.bottomLine}/>
                                    </View>);
                                })
                            }
                            <View style={{height: __iosSafeAreaBottomHeight__}}/>
                        </Animated.View>
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
    list: {
        height: list_height,
        marginTop: __SCREEN_HEIGHT__ - list_height,
        opacity: 0.9,
        backgroundColor: "#0b1432",
        borderWidth: 0.5,
        borderColor: "rgba(0, 166, 255, 0.9)",
        borderBottomColor: 'transparent',
        shadowColor: Colors.buttonBgColor,
        shadowOpacity: 0.9,
        shadowOffset: {height: 1}
    },
    button: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 12
    },
    bottomLine: {
        opacity: 0.4,
        backgroundColor: Colors.buttonBgColor,
        marginRight: 10,
        marginLeft: 10
    }
});
