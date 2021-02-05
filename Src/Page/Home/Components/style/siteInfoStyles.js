import {StyleSheet} from 'react-native';

// Constants
const viewHeight = __SCREEN_HEIGHT__ - __iosSafeAreaTopHeight__ - __iosTabBarHeight__;
const siteInfoHeight = 320 + 40;
const siteInfoMarginBottom = __isIOS__ ? 65 : 80;
const carouselDotMarginBottom = siteInfoMarginBottom / 2;
// const siteInfoMarginBottom = 0;
// const carouselDotMarginBottom = 0;
const headerPlaceholderImage = viewHeight - siteInfoHeight - siteInfoMarginBottom;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f4f5',
    },

    // Carousel
    carousel: {
        flexGrow: 1,
        backgroundColor: '#f5f4f5',
    },
    dotStyle: {
        backgroundColor: Colors.white,
        width: 5,
        height: 5,
        marginBottom: carouselDotMarginBottom,
    },
    dotActiveStyle: {
        backgroundColor: Colors.white,
        width: 20,
        height: 5,
    },

    backgroundImage: {
        // height: '100%', // Must set '100%'. Or Bug on Android on some device such as JinPei's phone.
        // flexGrow: 1,
        // width: __SCREEN_WIDTH__,
        flex: 1,
        justifyContent: 'flex-end',
    },
    headerPlaceholderImage: {
        height: '100%',
    },

    // Site header section
    siteInfoButton: {
        width: __SCREEN_WIDTH__ - 20,
        height: siteInfoHeight,
        marginBottom: 65,
        marginLeft: 10,
        borderRadius: 5,
        backgroundColor: Colors.white,
    },
    headerContainer: {
        height: 57 + 10,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: Colors.separatorColor,
    },
    headerLeftView: {
        justifyContent: 'center',
        width: __SCREEN_WIDTH__ - 30 - 90,
    },
    headerSiteName: {
        fontSize: 18,
        color: "#3285fe",
        paddingLeft: 10,
    },
    headerSiteLocation: {
        fontSize: 10,
        color: "#081643",
        paddingLeft: 12,
    },
    headerRightView: {
        borderLeftWidth: 1,
        borderLeftColor: Colors.separatorColor,
        flexDirection: 'row',
        width: 90,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerSiteStatusIcon: {
        width: 19,
        height: 19,
    },
    headerSiteOnlineStatus: {
        marginLeft: 5,
        fontSize: 11,
        color: '#081643',
    },

    // Site tab bar
    siteTabBar: {
        // flex: 1, // bug
        width: '100%', // Must set '100%'. Or Bug on Android on some device such as JinPei's phone.
        // height: '100%',
        // backgroundColor: Colors.white,
        borderRadius: 5,
    },

    // Get Into button
    getIntoButtonView: {
        position: 'absolute',
        alignItems: 'center',
        left: 0,
        right: 0,
        bottom: 15,
    },
    getIntoButton: {
        width: 170,
        height: 40,
        borderRadius: 19,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#237cfe',
    },
    getIntoButtonText: {
        fontSize: 12,
        color: Colors.white,
    },

    // Header placeholder button
    headerPlaceholderButton: {
        position: 'absolute',
        width: __SCREEN_WIDTH__,
        height: headerPlaceholderImage,
    },
});
