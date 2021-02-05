import React, {Component, PureComponent} from 'react';
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import PropTypes from 'prop-types';
import arrowUp from '../../../Source/Status/arrow-up.png';
import arrowDown from '../../../Source/Status/arrow-down.png';

export default class SiteInfoTabBarContainer extends Component {

    constructor(props) {
        super(props);
        const {data} = props;
        this.state = {
            data: data.map(item => {
                item.selected = false;
                return item;
            }),
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        const {data} = this.props;
        const nextData = nextProps.data;
        if (data !== nextData
            || JSON.stringify(data) !== JSON.stringify(nextData)
        ) {
            this.setState({
                data: nextData.map(item => {
                    item.selected = false;
                    return item;
                }),
            });
        }
        return true;
    }

    render() {
        const {data} = this.state;
        const {onLongPress} = this.props;
        // No sites
        if (!data
            || !Array.isArray(data)
            || !data.length
        ) {
            return <Empty/>;
        }

        return (
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.scrollView}
                    nestedScrollEnabled={true} // Android only. Fix scroll view nesting conflict.
                >
                    {
                        data.map((item, index) => {
                            const {
                                title,
                                value,
                                dtime,
                                selected,
                            } = item;
                            const hasTime = !!(dtime && Array.isArray(dtime) && dtime.length);
                            const icon = selected ? arrowUp : arrowDown;
                            const time = hasTime ? dtime.join(', ') : '';

                            return <View key={index}>
                                <TouchableOpacity
                                    style={styles.button}
                                    disabled={!hasTime}
                                    activeOpacity={0.7}
                                    onLongPress={() => onLongPress && onLongPress()}
                                    onPress={() => {
                                        this.setState({
                                            data: data.map((ele, i) => {
                                                if (i === index) {
                                                    ele.selected = !ele.selected;
                                                }
                                                return ele;
                                            }),
                                        });
                                    }}
                                >
                                    <View style={[styles.titleView, {marginTop: index ? 9 : 15}]}>
                                        <Text style={styles.title} numberOfLines={0}>{title}</Text>
                                    </View>
                                    <View style={[styles.valueView, {marginTop: index ? 9 : 15}]}>
                                        <Text style={styles.value} numberOfLines={1}>{value || '--'}</Text>
                                        {hasTime && <Image
                                            source={icon}
                                            style={styles.arrowIcon}
                                            resizeMode='contain'
                                        />}
                                    </View>
                                </TouchableOpacity>
                                {
                                    hasTime && selected && <Text
                                        style={styles.time}
                                        numberOfLines={0}>
                                        {time}
                                    </Text>
                                }
                            </View>;
                        })
                    }
                </ScrollView>
                <View style={{height: 60}}/>
            </View>
        );
    }

}

SiteInfoTabBarContainer.propTypes = {
    data: PropTypes.array.isRequired,
    onLongPress: PropTypes.func,
};

class Empty extends PureComponent {
    render() {
        return <View style={styles.empty}>
            <Text style={styles.emptyText}>No data</Text>
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flexGrow: 1,
        paddingBottom: 5,
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    titleView: {
        marginLeft: 15,
    },
    title: {
        fontSize: 13,
        color: '#666',
    },
    valueView: {
        marginRight: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    value: {
        marginLeft: 8,
        textAlign: 'center',
        fontSize: 13,
        color: '#333',
        marginRight: 5,
    },
    arrowIcon: {
        width: 11,
        height: 7,
    },
    time: {
        marginTop: 2,
        marginLeft: 15,
        marginRight: 15,
        fontSize: 10,
        color: '#666',
    },
    empty: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20,
        height: 200,
    },
    emptyText: {
        color: Colors.placeholderColor,
    },
});
