import {Image, StyleSheet, Text, View} from 'react-native'
import React from 'react'
import BaseComponent from './baseComponents'
import {rpx} from '../util/adapterUtils'
import PropTypes from 'prop-types'
import Btn from './btn'
import {Navigation} from 'react-native-navigation/lib/dist/index'

export default class NavBar extends BaseComponent {

  static propTypes = {
    backgroundColor: PropTypes.string,
    title: PropTypes.string,
    contentStyle: PropTypes.string,
    navigator: PropTypes.object
  }

  static defaultProps = {
    backgroundColor: 'white',
    title: '',
    contentStyle: 'dark'
  }

  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    let {backgroundColor, title, contentStyle} = this.props
    return (
      <View style={[styles.navBar, {backgroundColor: backgroundColor}]}>
        <Text style={[styles.title, {color: contentStyle === 'light' ? 'white' : 'black'}]}
              numberOfLines={1}>{title}</Text>
        <Btn style={styles.arrowWrapper} onPress={this.goBack}>
          <Image style={styles.arrow}
                 source={contentStyle === 'light' ? require('../img/back-arrow-icon-white.png') : require('../img/back-arrow-icon.png')}/>
        </Btn>
      </View>
    )
  }

  goBack = () => {
    Navigation.pop(this.props.componentId)
    this.props.navigator.pop()
  }
}

const styles = StyleSheet.create({

  navBar: {
    height: rpx(98),
    position: 'relative'
  },
  title: {
    width: rpx(450),
    height: rpx(98),
    lineHeight: rpx(98),
    fontSize: rpx(36),
    textAlign: 'center',
    position: 'absolute',
    left: rpx(150),
    top: 0
  },
  arrow: {
    width: rpx(18),
    height: rpx(32)
  },
  arrowWrapper: {
    width: rpx(50),
    height: rpx(50),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: rpx(23),
    top: rpx(24)
  }
})
