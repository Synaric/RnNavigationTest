import { Platform, NativeModules } from 'react-native';

export const VERSION_NAME = '1.0.1';
export const VERSION_NUMBER = 1001;
export const REQUEST_SOURCE = 'APP'

// export const DEV_HOST = 'http://192.168.0.147:7357/'
export const DEV_HOST = 'http://192.168.1.171:6363'
// export const PRO_HOST = 'https://zhixuan.xiangfengds.com/';
export const PRO_HOST = 'https://best.olomobi.com'
const IS_ONLINE = true; // true 线上, false 本地/测试
export const SHOW_LOG = false;  //是否显示log
export const HOST = IS_ONLINE ? PRO_HOST : DEV_HOST;

export const imgHeader = 'https://weixinfactory.di1game.com';


export const initialRouteName = Platform.OS === 'ios' ? 'Main' : 'Splash';
export const initialRouteParams = {};

// 19577
