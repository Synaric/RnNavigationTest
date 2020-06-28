import {AsyncStorage, Text, TextInput} from 'react-native';
import {IS_ONLINE} from "./config";

export function timeStampToTime(timestamp, type) {
  let date = new Date(timestamp * 1000); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear();
  let M = date.getMonth() + 1;
  let D = date.getDate();
  let h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();
  D = D < 10 ? '0' + D : D;
  M = M < 10 ? '0' + M : M;
  h = h < 10 ? '0' + h : h;
  m = m < 10 ? '0' + m : m;
  s = s < 10 ? '0' + s : s;

  if (type === 1) {
    return Y + '-' + M + '-' + D;
  }
  return Y + '-' + M + '-' + D + '-' + h + ':' + m + ':' + s;
}

export function timeStampToCountDowm(timestamp) {
  let hours = parseInt(timestamp / (1000 * 60 * 60));
  let minutes = parseInt((timestamp % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = (timestamp % (1000 * 60)) / 1000;
  if (hours < 10) hours = '0' + hours;
  if (minutes < 10) minutes = '0' + minutes;
  if (seconds < 10) seconds = '0' + seconds;
  return hours + ':' + minutes + ':' + seconds;
}

let emptyFunc = () => {}

export let log = IS_ONLINE ? emptyFunc : console.log

export function formatFloat(f, digit) {
  let m = Math.pow(10, digit);
  return (Math.round(f * m, 10) / m).toFixed(2)
}

function groupBy(f) {
  let groups = {};
  this.forEach(function (o) {
    let group = JSON.stringify(f(o));
    groups[group] = groups[group] || [];
    groups[group].push(o);
  });
  return Object.keys(groups).map(function (group) {
    return groups[group];
  });
}

export function install() {
  Array.prototype.groupBy = groupBy;
  TextInput.defaultProps = Object.assign({}, TextInput.defaultProps, {defaultProps: false});
  Text.defaultProps = Object.assign({}, Text.defaultProps, {allowFontScaling: false});
}

export function uuid() {
  let s = [];
  let hexDigits = "0123456789abcdef";
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  return s.join('');
}

export function isEmptyObj(obj) {
  for (let key in obj) {
    return false;
  }
  return true;
}

export function createPushEventInfo(msgId, content) {
  return {
    sf_msg_id: String.valueOf(msgId),
    sf_channel_category: 'default',
    sf_channel_id: 3,
    sf_channel_service_name: '极光推送',
    sf_msg_content: content
  }
}

export function getUserId(callback) {
  AsyncStorage.getItem('token', (error, result) => {
    if (result && result.indexOf('_') !== -1) {
      callback(result.split('_')[0])
    }
  })
}

export function formatFileSize(bytes) {
  let v = bytes;
  let unit = ['B', 'KB', 'MB', 'G', 'T'];
  let idx = 0;
  while (v > 1024) {
    v /= 1024;
    idx++
  }
  return formatFloat(v, 2) + unit[idx]
}

let isCalled = false, timer;

/**
 * @param functionTobeCalled 被包装的方法
 * @param interval 时间间隔，可省略，默认600毫秒
 */
export function callOnceInInterval(functionTobeCalled, interval = 600) {
  if (!isCalled) {
    isCalled = true;
    clearTimeout(timer);
    timer = setTimeout(() => {
      isCalled = false;
    }, interval);
    return functionTobeCalled();
  }
}
