import {Image, StyleSheet, Text, View} from 'react-native'
import React from 'react'
import BaseComponent from './baseComponents'
import {rpx} from "../util/adapterUtils";

export default class EmptyView extends BaseComponent {

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    let {width, height, hint} = this.props
    width = width || rpx(750)
    height = height || rpx(600)
    hint = hint || '暂时没有数据'
    return (
      <View style={{width, height, position: 'relative', justifyContent: 'center'}}>
        <Image style={{width, height: rpx(559 / rpx(750) * width)}} source={require('../img/no-data.png')}/>
        <Text style={[styles.hint, {
          position: 'absolute',
          width: width,
          left: 0,
          bottom: rpx(128 / rpx(750) * width)
        }]}>{hint}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({

  hint: {
    color: '#b1b1b1',
    fontSize: rpx(30),
    textAlign: 'center'
  }
})
