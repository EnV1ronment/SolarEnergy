import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    cell: {
        borderRadius: 3,
        backgroundColor: Colors.cellBackgroundColor,
        marginLeft: 5,
        marginRight: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 8,
    },
    languageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    language: {
        marginRight: 10,
        fontSize: 11,
        color: Colors.placeholder,
    },
    title: {
        marginLeft: 10,
        color: Colors.white,
        fontSize: 14,
    },
    arrow: {
        width: 5,
        height: 9,
    },
});
