import React, {Component} from 'react';
import {
    View,
    Text
} from 'react-native';
import WKGeneralBackground from "../../../../Common/Components/WKGeneralBackground";

export default class DealerPage extends Component {

    static navigationOptions = () => ({title: WK_T(wkLanguageKeys.dealer_info)});

    render() {
        return <WKGeneralBackground>
            <Text style={{color: 'white'}}>DealerPage</Text>
        </WKGeneralBackground>;
    }

}
