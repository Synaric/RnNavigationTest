import {AsyncStorage, NativeModules} from 'react-native';
import * as Wxpay from 'react-native-wx';
// import * as QQAPI from 'react-native-qq';
import {log} from './artUtils'
import {post} from "../request/api";
const Alipay = NativeModules.Alipay;

export async function alipay(res) {
  return Alipay.pay(res);
}

export async function wxpay(res) {
  if (res) {
    res.timeStamp = String(res.timeStamp)
  }
  return new Promise(function (resolve, reject) {
    Wxpay.isWXAppInstalled().then((isSupported) => {
      if (isSupported) {
        Wxpay.pay(res).then((data) => {
          log('data=' + JSON.stringify(data));
          //data = {"errCode":0}//支付成功
          //data={"errCode":-2} //取消支付
          resolve(data)
        }).catch(err => {
          reject(err)
        });
      } else {
        //未安装微信或当前微信版本较低
        reject('未安装微信或当前微信版本较低')
      }
    }).catch((err) => {
      reject(err)
    });
  });
}

export async function wxLogin() {
  return new Promise(function (resolve, reject) {
    Wxpay.isWXAppInstalled().then((isSupported) => {
      if (isSupported) {
        Wxpay.login().then((data) => {
          data.errCode = 1;
          log('微信登录返回结果', data);
          resolve(data)
        }).catch(err => {
          reject({errCode: -999, msg: err})
        });
      } else {
        //未安装微信或当前微信版本较低
        reject({errCode: -999, msg: '未安装微信或当前微信版本较低'})
      }
    }).catch((err) => {
      reject({errCode: -999, msg: err})
    });
  });
}

export async function wxShare(type, options) {
  if (!options) {
    options = {}
  }
    let params = {
      type: 'news',
      title: options.title || 'omma瑜伽',
      description: options.description || 'omma 瑜伽，让我们一起瑜伽！Yoga Together！',
      webpageUrl: options.webpageUrl || 'http://omma.zhmobi.com/share.html',
      imageUrl: options.imageUrl || 'http://thirdproj.oss-cn-hangzhou.aliyuncs.com/omma/ic_launcher.png',
    };
    if (type === 1) {
      Wxpay.shareToSession(params);
      reportShare('wxSession')
    } else {
      Wxpay.shareToTimeline(params);
      reportShare('wxTimeline')
    }
}

export async function wxShareMini(p) {
  let params = {
    type: 'mini',
    miniProgramType: 1, // 正式版:0，测试版:1，体验版:2
    title: 'omma瑜伽',
    description: 'omma 瑜伽，让我们一起瑜伽！Yoga Together！',
    webpageUrl: 'http://omma.zhmobi.com/share.html',
    userName: 'gh_cdc91b1a2b90',
    path: p.path,
    imageUrl: 'https://omma-1258757031.cos.ap-shanghai.myqcloud.com/app%E7%89%88%E6%9C%AC/84163ec2c090ea31bd292a865f66ce2.png',
  };
  Wxpay.shareToMini(params);
  reportShare('wxMini')
}

// export async function qqLogin() {
//   return new Promise(function (resolve, reject) {
//     QQAPI.login().then((data) => {
//       data.errCode = 1;
//       log('QQ登录返回结果', data);
//       resolve(data)
//     }).catch(err => {
//       reject({errCode: -999, msg: err})
//     });
//   });
// }
//
// export async function qqShare(type, options) {
//   if (!options) {
//     options = {}
//   }
//   return new Promise(function (resolve, reject) {
//     let data = {
//       type: 'news',
//       title: options.title || 'omma瑜伽',
//       description: options.description || 'omma 瑜伽，让我们一起瑜伽！Yoga Together！',
//       webpageUrl: options.webpageUrl || 'http://omma.zhmobi.com/share.html',
//       imageUrl: options.imageUrl || 'http://thirdproj.oss-cn-hangzhou.aliyuncs.com/omma/ic_launcher.png',
//     };
//     if (type === 1) { // QQ好友
//       QQAPI.shareToQQ(data).then((res) => {
//         res.errCode = 1;
//         log('QQ分享返回结果', res);
//         resolve(res);
//         reportShare('qqSession')
//       }).catch(err => {
//         reject({errCode: -999, msg: err})
//       })
//     } else {
//       QQAPI.shareToQzone(data).then((res) => {
//         log('QQ分享空间返回结果', res);
//         resolve(res);
//         reportShare('qqZone')
//       }).catch((err) => {
//         reject({errCode: -999, msg: err})
//       })
//     }
//   })
// }

function reportShare(type) {

}
