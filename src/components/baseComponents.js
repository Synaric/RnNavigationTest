import React from 'react';
import {Dimensions, Platform, StatusBar} from "react-native";
import {WToast} from 'react-native-smart-tip'
import {get, post, uploadImg} from "../request/api";
import {log} from '../util/artUtils'

export default class BaseComponent extends React.Component {

  constructor(props) {
    super(props)
    this.print = log
  }

  /* 生命周期开始 */
  onLoad() {}

  onUnload() {}
  /* 生命周期结束 */

  getApi(url, params, success, fail) {
    get(this, url, params, success, fail)
  }

  postApi(router, data, success, fail) {
    post(this, router, data, success, fail)
  }

  uploadApi(url, imgs, success, fail) {
    uploadImg(url, imgs, success, fail)
  }

  toast(text) {
    WToast.show({data: text})
  }

  componentDidMount() {
    this.onLoad()
  }

  componentWillUnmount() {
    this.onUnload()
  }

  getWindowHeight() {
    return Dimensions.get('window').height
  }
}
