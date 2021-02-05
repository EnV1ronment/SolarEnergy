import {StyleSheet} from 'react-native';

export default styles = StyleSheet.create({
    topPlaceholderView: {
        height: 10,
    },
    segmentContainer: {
        position: 'absolute',
        width: __SCREEN_WIDTH__,
    },
    tabsContainerStyle: {
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
    },
    tabTextStyle: {
        color: Colors.white,
        fontSize: 12,
    },
    tabStyle: {
        backgroundColor: Colors.theme,
        height: 40,
        borderWidth: 1,
        borderColor: Colors.buttonBgColor,
    },
    placeholderButton: {
        width: SCREEN_WIDTH,
        height: 50,
        position: 'absolute',
    },
});