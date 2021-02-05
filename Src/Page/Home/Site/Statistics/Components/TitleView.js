import React from 'react';
import {StyleSheet, Text} from "react-native";
import PropTypes from 'prop-types';

const TitleView = ({title}) => {
    return (<Text style={styles.title}>
        {title}
    </Text>);
};

TitleView.propTypes = {
    title: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
    title: {
        marginTop: 10,
        marginLeft: 5,
        fontSize: 13,
        color: "#00a6ff",
        marginBottom: 10,
    },
});

export default TitleView;