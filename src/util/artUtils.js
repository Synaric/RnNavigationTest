import {AsyncStorage, Text, TextInput} from 'react-native';
import {IS_ONLINE, PIC_URL} from "./config";

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

function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatDate (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const t1 = [year, month, day].map(formatNumber).join('-')
  return `${t1}`
}

export function timePeriod (createTime, type) {
  // createTime ------- 一般时间格式
  // console.log('传type 分类型 为1 区分所有资讯Item 的发布时间 控制在3天内', createTime)
  let time = 0
  let nowTime = Math.floor(Date.now() / 1000)
  let pastTime = Math.floor(new Date(createTime).valueOf() / 1000)
  let timeVal = nowTime - pastTime
  if (timeVal > 7 * 24 * 60 * 60) {
    time = formatDate(new Date(createTime))
    // if (!type) {
    //
    // }
    // else {
    //   time = '3天前'
    // }
  } else if (timeVal >= 24 * 3600 && timeVal <= 7 * 24 * 3600) {
    let val = Math.floor(timeVal / (24 * 3600))
    if (!type) {
      time = val + '天前'
    } else {
      time = (val >= 3 ? 3 : val) + '天前'
    }
  } else if (timeVal >= 3600 && timeVal <= 24 * 3600) {
    let val = Math.floor(timeVal / 3600)
    time = val + '小时前'
  } else if (timeVal >= 300 && timeVal <= 3600) {
    let val = Math.floor(timeVal / 60)
    time = val + '分钟前'
  } else {
    time = '刚刚发布'
  }
  return time
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

export function assetNotEmpty(obj, propLink) {
  if (!obj || !obj.hasOwnProperty()) {
    return false
  }
  let props = propLink.split('\\.')
  for (let prop in props) {
    obj = obj[prop]
    if (!obj && isNaN(obj)) {
      return false
    }
  }

  return true
}

/**
 * 检查图片路径，如果不是完整的，返回完整路径
 */
export function getFullPicUrl(url) {
  if (!url) {
    return ''
  }
  if (url.startsWith('http')) {
    return url
  }
  return PIC_URL + url
}

export class ScrollViewReachBottom {

  constructor() {
    this.factor = 0.9
    this.state = 0
    this.onReachEnd = null
    this.lastDy = null
    this.lastSize = null
  }

  onScroll(e) {
    let event = e.nativeEvent
    let dy = event.contentOffset.y
    let size = event.contentSize.height
    if (this.state === 0) {
      if (dy >= size * this.factor) {
        if (this.lastDy && this.lastSize && this.lastDy < this.lastSize * this.factor) {
          this.state = 1
          if (this.onReachEnd) {
            this.onReachEnd()
          }
        }
      }
      this.lastDy = dy
      this.lastSize = size
    }
  }

  onMomentumScrollEnd() {
    this.state = 0
  }

  bindOnReachEnd(callback) {
    this.onReachEnd = callback
  }
}

export function tagAddStyle (htmlText) {
  return htmlText.replace(/<[img|section][^>]*>/gi, (match, capture) => {
    if (match.indexOf('style') !== -1) {
      var regex1 = new RegExp('style=[‘\'"](.*)width:(.*?)px;(.*)[‘\'"]', 'gmi')
      match = match.replace(regex1, (text, $1, $2, $3) => {
        if (Number($2) > 295) {
          text = text.replace(regex1, 'style="$1$3width:100% !important;"')
        }
        return text
      })
      return match.replace(/style\s*?=\s*?([‘'"])([\s\S]*?)\1/ig, 'style="max-width:100% !important;$2"') // 替换style
    } else {
      // eslint-disable-next-line
      let regex1 = new RegExp('(i?)(\<img)(?!(.*?style=[‘\'"](.*)[‘\'"])[^\>]+\>)', 'gmi')
      match = match.replace(regex1, '$2 style=""$3')
      // eslint-disable-next-line
      let regex2 = new RegExp('(i?)(\<img.*?style=[‘\'"])([^\>]+\>)', 'gmi')
      match = match.replace(regex2, '$2max-width:100% !important;$3')
      return match
    }
  })
}

