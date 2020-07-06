import {Text, TouchableOpacity, View} from "react-native";
import React from "react";
import BasePage from "./basePage";
import {rpx} from "../util/adapterUtils";
import Btn from "../components/btn";
import {Navigation} from "react-native-navigation/lib/dist/index";

export default class B extends BasePage {

  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  static options() {
    return {
      statusBar: {
        style: 'dark',
        backgroundColor: 'white'
      }
    }
  }

  // static resolveStatusBar() {
  //   return {
  //     visible: true,
  //     style: 'dark',
  //     backgroundColor: 'transparent',
  //     drawBehind: true
  //   }
  // }

  render() {
    return (
      <Text>B</Text>
    );
  }

  onShow() {
    this.print('Splash', 'onShow')
  }

  onHide() {
    this.print('Splash', 'onHide')
  }
}
