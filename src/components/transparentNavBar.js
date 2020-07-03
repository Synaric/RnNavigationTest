import React from "react";
import {Image, StyleSheet, TouchableOpacity, View, StatusBar} from 'react-native'
import {rpx, titleHeight, statusBarHeight, width} from '../utils/adapter'
import NavigationService from "../utils/navigationService";
import PropTypes from 'prop-types'

export default class TransparentNavBar extends React.Component{
  static propTypes = {
    isBackImgWhitColor: PropTypes.bool,
  };

  static defaultProps = {
    isBackImgWhitColor: false,
  };

  onNavigateBack = () => {
    NavigationService.goBack()
  };
  render () {
    const {isBackImgWhitColor} = this.props;
    return (
      <View style={styles.clearNavbar}>
        <StatusBar
          backgroundColor={"transparent"}
          barStyle={'dark-content'}
          translucent={true}/>
        <View style={{height: statusBarHeight, width: width}}/>

        <View style={styles.clearTitleBar}>
          <TouchableOpacity activeOpacity={0.8} style={styles.leftImageTouch} onPress={this.onNavigateBack}>
            <Image style={styles.leftImage} source={isBackImgWhitColor ? require('../imgs/white_arraw_icon.png') : require('../imgs/arrow_back.png')}/>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  clearNavbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    height: titleHeight,
    width: width,
  },
  clearTitleBar: {
    height: titleHeight - statusBarHeight,
    width: width,
    flexDirection: 'row'
  },
  leftImageTouch: {
    width: rpx(180),
    height: titleHeight - statusBarHeight,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: rpx(30),
  },
  leftImage: {
    width: rpx(28),
    height: rpx(28),
    marginRight: rpx(5),
    resizeMode: 'contain',
  },
})

