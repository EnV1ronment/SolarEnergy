import React, {Component} from 'react';
import {
    Text
} from 'react-native';
import WKGeneralBackground from "../../../../../Common/Components/WKGeneralBackground";

export default class CommonOperationPage extends Component {

    static navigationOptions = () => ({title: WK_T(wkLanguageKeys.common_operation)});

    render() {
        return <WKGeneralBackground>
            <Text style={{color: 'white'}}>Common Operation Page</Text>
        </WKGeneralBackground>;
    }

}
