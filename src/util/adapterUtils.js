import {Dimensions, Platform, NativeModules } from "react-native";

const { StatusBarManager } = NativeModules;
const designWidth = 750

let w = Dimensions.get('window').width;
let h = Dimensions.get('window').height;

//手机屏幕的宽度
export const width = w < h ? w : h;

export function isIphoneX() {
  const X_WIDTH = 375;
  const X_HEIGHT = 812;
  return Platform.OS === 'ios' && !Platform.isPad && (height >= X_HEIGHT && width >= X_WIDTH)
}

export function isIpadPro() {
  const X_WIDTH = 2048;
  const X_HEIGHT = 2732;
  return Platform.OS === 'ios' && Platform.isPad && (height >= X_HEIGHT && width >= X_WIDTH)
}

export function rpx (num) {
  return num * width / designWidth
}

export function getStatusBarHeight() {
  if (Platform.OS === 'android') return StatusBarManager.HEIGHT // StatusBar.currentHeight;
  if (isIphoneX()) return 44
  if (isIpadPro()) return 24
  return 20
}
