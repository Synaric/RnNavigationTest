import {Text, TouchableOpacity, View} from "react-native";
import React from "react";
import BasePage from "./basePage";
import {rpx} from "../util/adapterUtils";
import Btn from "../components/btn";
import {Navigation} from "react-native-navigation/lib/dist/index";

export default class Splash extends BasePage {

  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  static options() {
    return {
      statusBar: {
        style: 'light',
        backgroundColor: '#d8201e'
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
      <Btn style={{marginTop: rpx(40)}} onPress={() => {
        // this.navigator.push('NewsDetail')
        Navigation.push(this.props.componentId, {
          component: {
            name: 'B',
            options: {
              statusBar: {
                style: 'dark',
                backgroundColor: 'white'
              },
              bottomTabs: {
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
    this.print('Splash', 'onShow')
  }

  onHide() {
    this.print('Splash', 'onHide')
  }
}
