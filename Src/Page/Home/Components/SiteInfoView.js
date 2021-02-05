import React, {Component} from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    Image,
    ImageBackground,
} from 'react-native';
import PropTypes from 'prop-types';

// Components
import SiteInfoTabBarContainer from "./SiteInfoTabBarContainer";
import SiteTabBar from "./SiteTabBar";
// import {Carousel} from '@ant-design/react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';

// Images
import home_bgImage from '../../../Source/Status/home_bgImage.png';

import home_site_status_blue from '../../../Source/Status/home_site_status_blue.png';
import home_site_status_red from '../../../Source/Status/home_site_status_red.png';

// Styles
import styles from './style/siteInfoStyles';

// Constants
const getIntoButtonText = 'Get Into';
const DEVICE_ON_LINE = 'Online';
const DEVICE_OFF_LINE = 'Offline';
const NO_DEVICE = 'Please contact your operator to bind the device.';

export default class SiteInfoView extends Component {

    state = {
        selectedIndex: 0,
    };

    resetCarousel = selectedIndex => {
        this.setState({selectedIndex});
        this._slider1Ref._hackActiveSlideAnimation(selectedIndex);
    };

    _renderItem = ({item}) => {
        const {
            siteInfoLongPress,
            getInto,
        } = this.props;
        const {
            id,
            deviceSN,
            siteInfo,
            rates,
            name,
            location,
            status,
            imageUrl,
            isWebUser,
            establishTime,
        } = item;
        // let imageUrl = 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1697850329,1416483110&fm=26&gp=0.jpg';
        const siteStatus = deviceSN && status ? DEVICE_ON_LINE : DEVICE_OFF_LINE;
        const statusIcon = deviceSN && status ? home_site_status_blue : home_site_status_red;
        const hasDevice = !!(deviceSN && typeof deviceSN === 'string' && deviceSN !== '');
        const disableLongPress = !isWebUser;

        const contentView = (<>
            {!!!imageUrl && <View style={{flex: 1}}>
                <Image
                    source={home_bgImage}
                    style={styles.headerPlaceholderImage}
                    resizeMode='contain'
                />
            </View>}
            <TouchableOpacity
                style={styles.siteInfoButton}
                activeOpacity={disableLongPress ? 1 : 0.7}
                disabled={!disableLongPress}
                // activeOpacity={isWebUser ? 1 : 0.7}
                // disabled={true}
                onLongPress={() => siteInfoLongPress(id, deviceSN, name, location)}
            >

                {
                    <View style={styles.headerContainer}>
                        <View style={styles.headerLeftView}>
                            <Text
                                allowFontScaling={false}
                                style={styles.headerSiteName}
                                numberOfLines={1}
                            >
                                {name}
                            </Text>
                            <Text
                                style={styles.headerSiteLocation}
                                numberOfLines={2}
                                allowFontScaling={false}
                            >
                                {location}
                            </Text>
                        </View>
                        <View style={styles.headerRightView}>
                            <Image
                                source={statusIcon}
                                style={styles.headerSiteStatusIcon}
                                resizeMode='contain'
                            />
                            <Text style={styles.headerSiteOnlineStatus}>
                                {siteStatus}
                            </Text>
                        </View>
                    </View>
                }

                {
                    <SiteTabBar>
                        <SiteInfoTabBarContainer data={siteInfo}/>
                        <SiteInfoTabBarContainer
                            data={rates}
                            onLongPress={() => {
                                if (disableLongPress) return;
                                siteInfoLongPress(id, deviceSN, name, location);
                            }}
                        />
                    </SiteTabBar>
                }

                {
                    <View style={styles.getIntoButtonView}>
                        {
                            hasDevice ? <TouchableOpacity
                                    style={styles.getIntoButton}
                                    onPress={() => getInto(id, name, establishTime)}
                                >
                                    <Text style={styles.getIntoButtonText}>
                                        {getIntoButtonText}
                                    </Text>
                                </TouchableOpacity>
                                :
                                <Text style={{color: 'orange', marginBottom: 10}}>{NO_DEVICE}</Text>
                        }

                    </View>
                }
            </TouchableOpacity>
        </>);
        return <View style={{flex: 1, justifyContent: 'flex-end'}}>
            {
                imageUrl ? <ImageBackground
                    source={{uri: imageUrl}}
                    style={styles.backgroundImage}
                    resizeMode='stretch'
                >
                    {contentView}
                </ImageBackground> : contentView
            }
        </View>;
    };

    render() {

        const {data} = this.props;

        return (
            <View style={styles.container}>
                <Carousel
                    inactiveSlideScale={isIOS ? 0.9 : 1} // Android must be set as 1. Bug: the displayed content is off the screen with tab page.
                    ref={c => this._slider1Ref = c}
                    firstItem={this.state.selectedIndex}
                    removeClippedSubviews={false} // If true, there is a bug on iOS that rendering blank screen when changing tab bar.
                    scrollEnabled={data.length > 1}
                    data={data}
                    renderItem={this._renderItem}
                    itemWidth={SCREEN_WIDTH}
                    sliderWidth={SCREEN_WIDTH}
                    onSnapToItem={index => {
                        this.setState({selectedIndex: index});
                    }}
                />
                <Pagination
                    dotsLength={data.length}
                    activeDotIndex={this.state.selectedIndex}
                    containerStyle={{width: SCREEN_WIDTH, position: 'absolute', bottom: 0}}
                    dotColor={'white'}
                    dotStyle={{width: 20, height: 5}}
                    inactiveDotColor={'white'}
                    inactiveDotOpacity={1}
                    inactiveDotScale={1}
                    carouselRef={this._slider1Ref}
                    tappableDots={!!this._slider1Ref}
                    inactiveDotStyle={{width: 5, height: 5, borderRadius: 5}}
                />
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.headerPlaceholderButton}
                />
            </View>
        );
    }
}

SiteInfoView.propTypes = {
    data: PropTypes.array.isRequired,
    siteInfoLongPress: PropTypes.func.isRequired,
    getInto: PropTypes.func.isRequired,
};
