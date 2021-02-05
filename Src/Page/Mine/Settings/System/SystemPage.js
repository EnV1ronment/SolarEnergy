import React, {Component} from 'react';
import {
    View,
    Text
} from 'react-native';
import WKGeneralBackground from "../../../../Common/Components/WKGeneralBackground";

export default class SystemPage extends Component {

    render() {
        return <WKGeneralBackground>
            <Text style={{color: 'white'}}>SystemPage</Text>
        </WKGeneralBackground>;
    }

}