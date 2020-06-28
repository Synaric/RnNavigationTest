import {Text, View} from "react-native";
import React from "react";
import {
  TouchableOpacity
} from 'react-native';
import BasePage from "./basePage";
import Btn from "../components/btn";
import {rpx} from "../util/adapterUtils";
import {Navigation} from "react-native-navigation/lib/dist/index";

export default class Home extends BasePage {

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
        // this.navigator.push('NewsDetail')
        Navigation.push(this.props.componentId, {
          component: {
            name: 'NewsDetail',
            options: {
              topBar: {
                visible: false
              }
            }
          }
        })
      }}>
        <Text>to NewsDetail</Text>
      </Btn>
    );
  }

  onShow() {
    this.print('Home', 'onShow')
  }

  onHide() {
    this.print('Home', 'onHide')
  }
}
