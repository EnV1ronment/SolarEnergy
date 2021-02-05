import React, {Component} from 'react';
import {Text, StyleSheet} from 'react-native';
import WKGeneralBackground from "../../../../../Common/Components/WKGeneralBackground";
import WKSearchBar from "../../../../../Common/Components/WKSearchBar";
import WKNavigationBarRightItem from "../../../../../Common/Components/WKNavigationBarRightItem";
import axios from 'axios';
import {google_map_api_host, google_map_api_key} from '../googleMapsConfig';

const emptyText = 'No Results';

export default class MapSearchPage extends Component {

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Search Place',
            headerRight: <WKNavigationBarRightItem value={'Done'} click={navigation.getParam('done')}/>,
        };
    };

    state = {
        text: null,
        isEmpty: false,
    };

    componentDidMount() {
        const {navigation} = this.props;
        navigation.setParams({done: this._search});
    }

    _search = () => {
        const {text} = this.state;
        if (!text) return;
        // Places API -- Place Autocomplete -- 模糊搜索，包含输入的文本都会显示，全国都会显示（没有返回经纬度，但是有place_id，通过place_id然后用Places API -- Place Details（太贵$17）就可以获取经纬度)
        /**
         * place_id: '',
         * main_text: '桂宇清真馆'，
         * secondary_text: 'China, Guizhou, Qianxinan, Pu'an, Jiaotong, Road',
         */
        // const placeUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=桂宇清&radius=50000&location=${lati},${long}&key=${api_key}`;

        // Places API -- Place Search -- 搜索附近50000米以内的所有地点（包括经纬度、name，但是没有formatted_address--可以通过经纬度获取）
        /**
         * place_id: '',
         * name: 'Guiyu Islamic Restaurant',
         * location: {
         *     lat: 0,
         *     lng: 0,
         * },
         */
        // const placeUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lati},${long}&radius=50000&keyword=桂宇清真馆&key=${api_key}`;

        // Places API -- Place Search -- 暂时用这个
        /**
         * {
         *     candidates: [
         *       {
         *           formatted_address: '8 Jiaotong Rd, Pu'an, Qianxinan, Guizhou, China',
         *           geometry: {
         *               location: {
         *                   lat: 25.788032,
         *                   lng: 104.957877,
         *               },
         *           },
         *           name: 'Guiyu Islamic Restaurant',
         *       }
         *     ],
         *     status: 'OK',
         * }
         *
         */
        const {navigation} = this.props;
        const {latitude, longitude, callback} = navigation.state.params;
        const placeUrl = `${google_map_api_host}/place/findplacefromtext/json?input=${text}&locationbias=circle:50000@${latitude},${longitude}&inputtype=textquery&fields=formatted_address,name,geometry&key=${google_map_api_key}`;
        WKLoading.show();
        axios(placeUrl).then(ret => {
            WKLoading.hide();
            const {data} = ret;
            const {candidates} = data;
            if (!candidates.length) {
                this.setState({isEmpty: true});
                return;
            }
            const {name, formatted_address, geometry} = candidates[0];
            const {location} = geometry;
            const {lat, lng} = location;
            const obj = {
                name,
                address: formatted_address,
                latitude: lat,
                longitude: lng,
            };
            callback(obj);
            navigation.goBack();
        });
    };

    render() {
        return (
            <WKGeneralBackground>
                <WKSearchBar
                    onChangeText={text => this.setState({text})}
                    onSubmitEditing={this._search}
                    placeholder={'Search here'}
                    returnKeyType={'search'}
                    fontSize={15}
                />
                <Text style={styles.emptyText}>
                    {this.state.isEmpty && emptyText}
                </Text>
            </WKGeneralBackground>
        );
    }
}

const styles = StyleSheet.create({
    emptyText: {
        alignSelf: 'center',
        fontSize: 14,
        color: Colors.placeholder,
        marginTop: 100,
    },
});