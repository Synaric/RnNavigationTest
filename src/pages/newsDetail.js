import {Text, View} from "react-native";
import React from "react";
import BasePage from "./basePage";
import {rpx} from "../util/adapterUtils";

export default class NewsDetail extends BasePage {

  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  // static resolveStatusBar() {
  //   return {
  //     visible: true,
  //     style: 'light',
  //     backgroundColor: 'red'
  //   }
  // }

  render() {
    return (
      <View>
        <Text style={{marginTop: rpx(30)}}>NewsDetail</Text>
        <Text style={{marginTop: rpx(30)}}>NewsDetail</Text>
        <Text style={{marginTop: rpx(30)}}>NewsDetail</Text>
        <Text style={{marginTop: rpx(30)}}>NewsDetail</Text>
      </View>
    );
  }

  onShow() {
    this.print('NewsDetail', 'onShow')
  }

  onHide() {
    this.print('NewsDetail', 'onHide')
  }
}
