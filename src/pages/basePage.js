import React from 'react';
import BaseComponent from "../components/baseComponents";
import {appRoot} from "../router/options";
import {Navigation} from "react-native-navigation/lib/dist/index";
import {WToast} from 'react-native-smart-tip'

export default class BasePage extends BaseComponent {

  constructor(props) {
    super(props);
    this.navigator = {

      /**
       * 改变options
       */
      mergeOptions: (options) => {
        Navigation.mergeOptions(this.props.componentId, options)
      },

      /**
       * 跳转新页面
       */
      push: (page, params) => {
        Navigation.push(this.props.componentId, {
          component: {
            name: page,
            options: {
              statusBar: {
                style: 'dark',
                backgroundColor: 'white'
              },
              bottomTabs: {
                visible: false
              }
            },
            passProps: params
          }
        })
      },

      /**
       * 回退
       */
      pop: () => {
        Navigation.pop(this.props.componentId)
      },

      /**
       * 回退到首页
       */
      popToRoot: () => {
        Navigation.popToRoot(this.props.componentId)
      },

      /**
       * 重置根节点为底部tab页（默认是Splash）
       */
      resetToHome: () => {
        Navigation.setRoot(appRoot)
      }
    }
  }

  static resolveStatusBar() {
    return {
      visible: true,
      style: 'dark',
      backgroundColor: 'white',
      drawBehind: false
    }
  }

  onShow() {}

  onHide() {}

  componentDidMount() {
    super.componentDidMount()
    Navigation.events().bindComponent(this)

    // this.navigator.mergeOptions({
    //   statusBar: appRouter[this.constructor.name].resolveStatusBar()
    // })
  }

  componentDidAppear() {
    this.onShow()
  }

  componentDidDisappear() {
    this.onHide()
  }

  toast(text) {
    WToast.show({data: text})
  }
}
