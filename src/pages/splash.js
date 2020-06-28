import {Text, TouchableOpacity, View} from "react-native";
import React from "react";
import BasePage from "./basePage";
import {rpx} from "../util/adapterUtils";
import Btn from "../components/btn";

export default class Splash extends BasePage {

  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  static resolveStatusBar() {
    return {
      visible: true,
      style: 'dark',
      backgroundColor: 'transparent',
      drawBehind: true
    }
  }

  render() {
    return (
      <Btn style={{marginTop: rpx(40)}} onPress={() => {
        this.navigator.resetToHome()
      }}>
        <Text>to Home</Text>
      </Btn>
    );
  }

  onShow() {
    this.print('Splash', 'onShow')
  }

  onHide() {
    this.print('Splash', 'onHide')
  }
}
