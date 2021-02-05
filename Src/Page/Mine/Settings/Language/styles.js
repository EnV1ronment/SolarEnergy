import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        color: Colors.white,
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 50,
        paddingLeft: 15,
        alignItems: 'center',
    },
    checkMark: {
        width: 15,
        height: 16,
        marginRight: 15,
    },
    bottomLine: {
        backgroundColor: Colors.placeholder,
        height: 0.5,
        marginLeft: 15,
        marginRight: 15,
    },
});

module.exports = styles;
