import React, {Component} from 'react';
import {ImageBackground, StyleSheet, Text, View, Image, TouchableOpacity} from "react-native";
import PropTypes from 'prop-types';
import selectedIcon from "../../../../../Source/Common/selected.png";

class TopView extends Component {

    render() {
        const {
            title,
            description,
            selected,
            subheading,
            onSelect,
        } = this.props;
        let children = this.props.children;
        return (
            <View
                style={styles.topView}
            >
                <Text
                    style={styles.topText}
                    numberOfLines={1}>
                    {title}
                </Text>
                {selected ? 
                <TouchableOpacity onPress={()=>{onSelect();}} style={styles.image}>
                    <Image source={selectedIcon} style={styles.icon}/>
                    </TouchableOpacity>
                :<TouchableOpacity onPress={()=>{onSelect();}} style={styles.selectedView}>
                    <View/>
                </TouchableOpacity>
                }
                <Text style={styles.description}>{subheading}</Text>
                <View style={styles.descriptionView}>
                    <Text style={styles.description}>{description}</Text>
                    <Text style={styles.learn_more}>{WK_T(wkLanguageKeys.learn_more)}</Text>
                </View>
                {children}
            </View>
        );
    }

}

TopView.propTypes = {
    title: PropTypes.string,
    selected: PropTypes.bool,
    description: PropTypes.string,
    subheading: PropTypes.string,
    onSelect: PropTypes.func,
};

const styles = StyleSheet.create({
    topView: {

    },
    topText: {
        fontSize: 26,
        fontWeight:'bold',
        color: "#fff",
    },
    selectedView: {
        position: "absolute",
        top: 0,
        right: 10,
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "#fff",
    },
    image: {
        position: "absolute",
        top: 0,
        right: 10,
        width: 30,
        height: 30,
    },
    icon: {
        resizeMode: 'cover',
        width: 30,
        height: 30
    },
    descriptionView: {
        marginTop: 20,
        paddingRight: 20,
    },
    description: {
        fontSize: 16,
        color: "#fff",
    },
    learn_more: {
        fontSize: 16,
        textDecorationLine: 'underline',
        textDecorationColor: 'rgb(16,172,239)',
        color: "rgb(16,172,239)",
    }
});

export default TopView;