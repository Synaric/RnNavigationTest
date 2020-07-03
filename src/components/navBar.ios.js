import React from 'react'
import {Image, StyleSheet, Text, TouchableOpacity, View, StatusBar} from 'react-native'
import {rpx, titleHeight, statusBarHeight, width} from '../utils/adapter'
import NavigationService from '../utils/navigationService'
import PropTypes from 'prop-types'

export default class NavBar extends React.Component {
  static propTypes = {
    backgroundType: PropTypes.bool,
    leftBtn: PropTypes.bool,
    isCustomBgColor: PropTypes.bool,
    customBgColor: PropTypes.string
  }

  static defaultProps = {
    backgroundType: true,
    leftBtn: true,
    isCustomBgColor: false
  }

  render () {
    let {title, leftBtn, leftBtnFunc, rightBtn, rightSearchBtn, backgroundType, rightSearchBtnClick, isCustomBgColor, customBgColor} = this.props
    if (leftBtn === undefined) leftBtn = true
    return (
      <View style={[styles.navBar, {backgroundColor: isCustomBgColor ? customBgColor : (backgroundType ? '#ffffff' : '#17894c')}]}>
        <StatusBar
          backgroundColor={"transparent"}
          barStyle={'dark-content'}
          hidden={false}
          ref={'statusBar'}/>
        <View style={styles.statusBar}/>
        <View style={styles.titleBarContent}>
          {
            leftBtn ?
              <TouchableOpacity style={styles.leftBtnTouch}
                                activeOpacity={0.8} onPress={leftBtnFunc ? leftBtnFunc : this.onNavigateBack}>
                <Image style={styles.leftBtnImg}
                       source={backgroundType ? require('../imgs/arrow_back.png') : require('../imgs/white_arraw_icon.png')}/>
              </TouchableOpacity> : <View style={styles.leftBtnTouch}/>
          }
          <View style={styles.middle}>
            <Text numberOfLines={1} ellipsizeMode={'tail'}
                  style={[styles.middleTitle, {color: backgroundType ? '#313332' : '#fff'}]}>{title}</Text>
          </View>
          {
            rightBtn ?
              <TouchableOpacity style={styles.rightBtnTouch}
                                activeOpacity={0.8}>
                <Text style={[styles.rightBtnTxt, {color: backgroundType ? '#313332' : '#fff'}]}>{rightBtn.text}</Text>
              </TouchableOpacity> : <View style={styles.rightBtnTouch}/>
          }
        </View>
      </View>
    )
  }

  onNavigateBack = () => {
    NavigationService.goBack()
  }
}

const styles = StyleSheet.create({
  navBar: {
    width: width,
    height: titleHeight,
  },
  statusBar: {
    width: width,
    height: statusBarHeight,
    backgroundColor: 'transparent'
  },
  titleBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width,
    justifyContent: 'space-between',
    height: titleHeight - statusBarHeight,
  },
  leftBtnTouch: {
    width: rpx(180),
    height: titleHeight - statusBarHeight,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: rpx(30),
  },
  leftBtnImg: {
    width: rpx(28),
    height: rpx(28),
  },
  middle: {
    width: width - rpx(360),
    height: titleHeight - statusBarHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleTitle: {
    fontSize: rpx(36),
  },
  rightBtnTouch: {
    width: rpx(180),
    height: titleHeight - statusBarHeight,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: rpx(30),
  },
  rightBtnTxt: {
    fontSize: rpx(26)
  },
});
