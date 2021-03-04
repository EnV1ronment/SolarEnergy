import React, {Component} from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    Image
} from 'react-native';
import PropTypes from 'prop-types';
import me_search_icon from '../../Source/Me/me_search_icon.png';

const textInputTop = 10;
const textInputHeight = 40;
const searchIconWidth = 15;
const searchIconHeight = 15;

export default class WKSearchBar extends Component {

    static propTypes ={
        onChangeText: PropTypes.func.isRequired,
        placeholder: PropTypes.string,
        returnKeyType: PropTypes.string,
        height: PropTypes.number,
        fontSize: PropTypes.number,
        onSubmitEditing: PropTypes.func,
        onFocus: PropTypes.func.isRequired,
    };

    state = {
        text: '',
        textAlign: 'center',
        searchIconLeft: __SCREEN_WIDTH__ / 2.0 - searchIconWidth - 20
    };

    _onChangeText = (text) => {
        this.setState({text});
        const {onChangeText} = this.props;
        onChangeText && onChangeText(text);
    };

    // When Pop keyboard
    _onFocus = () => {
        this.setState({
            textAlign: 'left',
            searchIconLeft: 15
        });
        this.props.onFocus && this.props.onFocus();
    };

    // Resign keyboard
    _onEndEditing = () => {
        if (this.state.text) return;
        this.setState({
            textAlign: 'center',
            searchIconLeft: __SCREEN_WIDTH__ / 2.0 - searchIconWidth - 30
        });
    };

    _onSubmitEditing = () => {
        const {onSubmitEditing} = this.props;
        onSubmitEditing && onSubmitEditing();
    };

    render() {
        const {
            placeholder,
            returnKeyType,
            height,
            fontSize,
        } = this.props;
        const _textInputHeight = height || textInputHeight;
        const imageMarginTop = textInputTop + (_textInputHeight - searchIconHeight) / 2.0;
        return (<View>
            <TextInput
                // style={[styles.inputText, {textAlign: this.state.textAlign}]}
                style={[styles.inputText, {height: _textInputHeight, fontSize: fontSize || 13}]}
                placeholderTextColor={Colors.placeholder}
                placeholder={placeholder || WK_T(wkLanguageKeys.search)}
                selectionColor={Colors.white}
                autoCapitalize={'none'}
                numberOfLines={1}
                autoCorrect={false}
                returnKeyType={returnKeyType || 'done'}
                contextMenuHidden={true} // Disable copy and paste
                onFocus={this._onFocus}
                onEndEditing={this._onEndEditing}
                onChangeText={this._onChangeText}
                onSubmitEditing={this._onSubmitEditing}
            />
            <Image style={[styles.searchIcon, {marginLeft: 15, marginTop: imageMarginTop}]} source={me_search_icon}/>
            {/*<Image style={[styles.searchIcon, {marginLeft: this.state.searchIconLeft}]} source={me_search_icon}/>*/}
        </View>);
    }

}

const styles = StyleSheet.create({
    inputText: {
        marginLeft: 5,
        marginRight: 5,
        marginTop: textInputTop,
        marginBottom: 6,
        height: textInputHeight,
        color: Colors.white,
        paddingLeft: 35,
        paddingRight: 10,
        backgroundColor: Colors.searchBgColor,
        borderRadius: 3,
        paddingVertical: 0 // make text show whole on Android
    },
    searchIcon: {
        position: 'absolute',
        width: searchIconWidth,
        height: searchIconHeight
    }
});
