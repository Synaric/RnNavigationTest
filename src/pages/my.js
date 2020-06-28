import {Text, View} from "react-native";
import React from "react";
import BasePage from "./basePage";
import {rpx} from "../util/adapterUtils";

export default class My extends BasePage {

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
      <View>
        <Text style={{marginTop: rpx(30)}}>My</Text>
      </View>
    );
  }

  onShow() {
    this.print('My', 'onShow')
  }

  onHide() {
    this.print('My', 'onHide')
  }
}
