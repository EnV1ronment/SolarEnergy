import React, {PureComponent} from 'react';
import {Toast, Portal} from '@ant-design/react-native';

let key = 0;

class WKLoading extends PureComponent {

    static show = (content = 'Loading', duration = 15, mask = true) => {
        this.hide();
        key = Toast.loading(content, duration, null, mask);
    };

    static hide = () => {
        Portal.remove(key)
    };

}

export default WKLoading;