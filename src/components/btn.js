import {Text, TouchableOpacity, View} from 'react-native'
import React from 'react'
import BaseComponent from './baseComponents'

export default class Btn extends BaseComponent {

  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    let {children, style, onPress} = this.props
    return (
      <TouchableOpacity style={style} activeOpacity={0.8} onPress={onPress}>
        {children}
      </TouchableOpacity>
    )
  }
}
