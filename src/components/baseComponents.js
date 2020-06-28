import React from 'react';
import {Navigation} from "react-native-navigation/lib/dist/index";
import {Platform, StatusBar} from "react-native";
import {get, post, uploadImg} from "../request/api";
import {log} from '../util/artUtils'

export default class BaseComponent extends React.Component {

  constructor(props) {
    super(props)
    this.print = log
  }

  /* 生命周期开始 */
  onLoad() {}

  onShow() {}

  onHide() {}

  onUnload() {}
  /* 生命周期结束 */

  getApi(url, params, success, fail) {
    this.log('get router', url, params);
    get(this, url, params, success, fail)
  }

  postApi(router, data, success, fail) {
    this.log('post router', router, data);
    post(this, router, data, success, fail)
  }

  uploadApi(url, imgs, success, fail) {
    uploadImg(url, imgs, success, fail)
  }

  componentDidMount() {
    this.onLoad()
  }

  componentWillUnmount() {
    this.onUnload()
  }
}
