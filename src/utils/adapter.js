import {Dimensions, StatusBar, Platform, PixelRatio, NativeModules} from 'react-native'
import DeviceInfo from 'react-native-device-info' // 获取设备型号
const model = DeviceInfo.getModel()
const {StatusBarManager} = NativeModules
//UI设计图的宽度
const designWidth = 750
//UI设计图的高度
const designHeight = 1334

//手机屏幕的宽度
export const width = Dimensions.get('window').width
//手机屏幕的高度
const height = Dimensions.get('window').height
//计算手机屏幕宽度对应设计图宽度的单位宽度
export const unitWidth = width / designWidth
//计算手机屏幕高度对应设计图高度的单位高度
export const unitHeight = height / designHeight

export const statusBarHeight = getStatusBarHeight()
//标题栏的高度
export const titleHeight = Platform.isPad ? (50 + statusBarHeight) : (44 + statusBarHeight)

//底部tabbar高度

const DEFAULT_HEIGHT = 50
const COMPACT_HEIGHT = 49
export const tabbarHeight = Platform.isPad ? DEFAULT_HEIGHT : COMPACT_HEIGHT

// 字体缩放比例，一般情况下不用考虑。
// 当应用中的字体需要根据手机设置中字体大小改变的话需要用到缩放比例
export const fontscale = PixelRatio.getFontScale()

/**
 * 判断是否为iphoneX
 * @returns {boolean}
 */
export function isIphoneX () {
  const X_WIDTH = 375
  const X_HEIGHT = 812
  return Platform.OS === 'ios' && !Platform.isPad && (height >= X_HEIGHT && width >= X_WIDTH)
}

export function isIpadPro () {
  const X_WIDTH = 2048
  const X_HEIGHT = 2732
  return Platform.OS === 'ios' && Platform.isPad && (height >= X_HEIGHT && width >= X_WIDTH)
}

//状态栏的高度
export function getStatusBarHeight () {
  if (Platform.OS === 'android') return StatusBarManager.HEIGHT
  if (isIphoneX()) return 44
  if (isIpadPro()) return 24
  return 20
}

//手机长度像素适配
export function rpx (num) {
  if (Platform.isPad) {
    return num * width * 0.77 / designWidth
  }
  return num * width / designWidth
}


export const deviceWidth = Dimensions.get('window').width      //设备的宽度
export const deviceHeight = Dimensions.get('window').height    //设备的高度
const defaultPixel = PixelRatio.get()        //当前设备的像素密度
//px转换成dp
const w2 = 750 / defaultPixel
const h2 = 1334 / defaultPixel
const scale = Math.min(deviceHeight / h2, deviceWidth / w2)   //获取缩放比例
/**
 * 设置text为sp
 * @param size sp
 * return number dp
 */
export function setSpText (size: number) {
  size = Math.round((size * scale + 0.5) * 2)// pixelRatio / fontScale
  return size / defaultPixel
}


export function scaleSize (size: number) {
  size = Math.round(size * scale + 0.5)
  return size / defaultPixel
}
