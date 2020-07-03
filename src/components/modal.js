"use strict";

import React, {Component} from 'react';
import {Animated, Dimensions, StatusBar, Platform, TouchableOpacity, View, Text} from "react-native";
import {rpx, deviceHeight} from "../utils/adapter";
import {common} from "../style/common";

export default class ExtModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(0)
    };
    this.anim = null
  }

  render() {
    const {children, visible, fullScreen, onDismiss, zIndex} = this.props;
    const height = Platform.OS === 'android'?
      Dimensions.get('window').height - (fullScreen ? 0 : StatusBar.currentHeight) : Dimensions.get('window').height;
    const {opacity} = this.state;
    return (
      visible ?
        <Animated.View style={{
          width: rpx(750),
          height: height,
          position: 'absolute',
          top: 0,
          zIndex: zIndex ? zIndex : 999999,
          opacity: opacity
        }}>
          <View style={[common.alertShadow, {height: height}]}>
            <TouchableOpacity style={{width: rpx(750), flex: 1}} onPress={onDismiss}/>
            {children}
          </View>
        </Animated.View> : null
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('shouldComponentUpdate1111', nextProps.visible, this.props.visible);
    if (nextProps.visible !== this.props.visible) {
      if (this.anim) {
        this.anim.stop();
        this.anim = null
      }
      if (nextProps.visible) {
        this.anim = Animated.timing(
          this.state.opacity,
          {
            toValue: nextProps.visible ? 1 : 0,
            duration: 500,
          }
        );
        this.anim.start()
      } else {
        this.setState({opacity: new Animated.Value(0)})
      }
    }
    return true
  }
}

