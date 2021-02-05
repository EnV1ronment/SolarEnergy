import React, {PureComponent} from 'react';
import {Toast, Portal} from '@ant-design/react-native';

let key = 0;

class WKToast extends PureComponent {

    static show = (content, mask = false, duration = 1.8) => {
        if (!content) {
            return;
        }
        if (!duration) {
            duration = 1.8;
        }
        key = Toast.show(content, duration, mask);
    };

    static hide = () => {
        Portal.remove(key);
    };

}

export default WKToast;