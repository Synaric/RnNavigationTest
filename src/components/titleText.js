import React from 'react';
import {Image, Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import {rpx} from "../utils/adapter";
import PropTypes from 'prop-types';

export default class TitleText extends React.Component {
    static propTypes = {
        a: PropTypes.string
    };

    static defaultProps = {
        a: ''
    };

    render() {
        let {a} = this.props;
        return (
            <View>
            <Text style={styles.textStyle}>
                {a}
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    textStyle: {
        width: rpx(750),
        height: rpx(420),
        backgroundColor: 'blue',
        fontSize: rpx(30)
    }
});
