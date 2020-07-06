export const VERSION_NAME = '1.0.0';
export const VERSION_NUMBER = 10000;

// export const DEV_HOST = 'http://192.168.1.142:8080/omma_server/'; //本地
// export const DEV_HOST = 'http://192.168.1.119:8080/omma_server/'; //本地
export const DEV_HOST = 'https://best.olomobi.com/'; //测试
// export const PRO_HOST = 'https://omma-server.zhmobi.com/omma_server/'; //正式
export const PRO_HOST = 'https://best.olomobi.com/'; //正式
export const IS_ONLINE = false; //true 线上, false 本地/测试
export const HOST = IS_ONLINE ? PRO_HOST : DEV_HOST;
export let CHANNEL = 'default';

export const PIC_URL = 'https://weixinfactory.di1game.com/'
export const DEFAULT_AVATAR = 'https://weixinfactory.di1game.com/weixinfactory/Icon/20190904/142231/3bd782e59c5bd44b069ba7bd7364b69c.jpeg'

export function setChannel(channel) {
  CHANNEL = channel;
}
