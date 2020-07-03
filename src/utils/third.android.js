import {NativeModules} from 'react-native'
import * as Wxpay from 'react-native-wx'
import * as QQAPI from 'react-native-qq';
import {log} from './arts'
const Alipay = NativeModules.Alipay

export async function alipay (res) {
  return Alipay.pay(res)
}

export async function wxpay (res) {
  let payData = {
    timeStamp: res.timeStamp,
    nonceStr: res.nonce_str,
    prepayId: res.prepay_id,
    package: 'Sign=WXPay',
    sign: res.sign,
    orderNum: res.order_no,
    partnerId: res.partner_id
  }
  console.log('调起支付', payData)
  return new Promise(function (resolve, reject) {
    Wxpay.isWXAppInstalled().then((isSupported) => {
      if (isSupported) {
        Wxpay.pay(payData).then((data) => {
          log('data=' + JSON.stringify(data))
          //data = {"errCode":0}//支付成功
          //data={"errCode":-2} //取消支付
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      } else {
        //未安装微信或当前微信版本较低
        reject('未安装微信或当前微信版本较低')
      }
    }).catch((err) => {
      reject(err)
    })
  })
}

export async function wxLogin () {
  return new Promise(function (resolve, reject) {
    Wxpay.isWXAppInstalled().then((isSupported) => {
      console.log('Wxpay.isWXAppInstalled() first', isSupported)
      if (isSupported) {
        console.log('Wxpay.isWXAppInstalled() second', isSupported)
        Wxpay.login().then((data) => {
          console.log('Wxpay.isWXAppInstalled() third', data)
          data.errCode = 1
          log('微信登录返回结果', data)
          resolve(data)
        }).catch(err => {
          reject({errCode: -999, msg: err})
        })
      } else {
        //未安装微信或当前微信版本较低
        reject({errCode: -999, msg: '未安装微信或当前微信版本较低'})
      }
    }).catch((err) => {
      reject({errCode: -999, msg: err})
    })
  })
}

export async function wxShare (type) {
  let params = {
    type: 'news',
    title: '湘丰质选',
    description: '湘丰质选APP是集湖南各地特色农副产品和本地生活服务于一体的网上商城。',
    webpageUrl: 'https://zhixuan.xiangfengds.com/h5/share.html',
    imageUrl: 'http://thirdproj.oss-cn-hangzhou.aliyuncs.com/xiangfeng/ic_launcher.png',
  }
  if (type === 1) {
    Wxpay.shareToSession(params)
  } else {
    Wxpay.shareToTimeline(params)
  }
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
export async function qqShare(type) {
  return new Promise(function (resolve, reject) {
    let data = {
      type: 'news',
      title: 'omma瑜伽',
      description: 'omma 瑜伽，让我们一起瑜伽！Yoga Together！',
      webpageUrl: 'http://omma.zhmobi.com/share.html',
      imageUrl: 'http://thirdproj.oss-cn-hangzhou.aliyuncs.com/omma/ic_launcher.png',
    };
    if (type === 1) { // QQ好友
      QQAPI.shareToQQ(data).then((res) => {
        res.errCode = 1;
        log('QQ分享返回结果', res);
        resolve(res)
      }).catch(err => {
        reject({errCode: -999, msg: err})
      })
    } else {
      QQAPI.shareToQzone(data).then(() => {})
    }
  })
}
