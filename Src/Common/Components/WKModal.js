import React, {PureComponent} from 'react';
import {
    Modal,
    View,
    DeviceEventEmitter,
} from 'react-native';
import PropTypes from 'prop-types';
// Make sure that toast can be showed on modal.
import {Provider} from '@ant-design/react-native';

export default class WKModal extends PureComponent {

    static propTypes = {
        visible: PropTypes.bool,
        transparent: PropTypes.bool,
        animationType: PropTypes.string,
        presentationStyle: PropTypes.string,
        onRequestClose: PropTypes.func.isRequired,
        bgColor: PropTypes.string, // Optional
    };

    static defaultProps = {
        visible: false,
        transparent: false,
        animationType: 'fade',
        presentationStyle: 'overFullScreen',
        bgColor: 'rgba(0,0,0,0.5)',
    };

    componentDidMount() {
        this.listener = DeviceEventEmitter.addListener(EmitterEvents.HIDE_MODAL, this._hide);
    }

    componentWillUnmount() {
        this.listener && this.listener.remove();
    }

    _hide = () => {
        const {onRequestClose} = this.props;
        onRequestClose && onRequestClose();
    };

    render() {
        const {
            children,
            visible,
            transparent,
            animationType,
            presentationStyle,
            onRequestClose,
            bgColor,
        } = this.props;
        return (
            <Modal
                transparent={transparent}
                animationType={animationType}
                visible={visible}
                presentationStyle={presentationStyle}
                onRequestClose={onRequestClose}
            >
                <Provider>
                    <View style={{
                        flex: 1,
                        backgroundColor: bgColor,
                    }}>
                        {children}
                    </View>
                </Provider>
            </Modal>
        );
    }

}
