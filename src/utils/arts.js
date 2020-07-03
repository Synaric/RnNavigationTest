import {
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native'
import React from 'react'
import {SHOW_LOG} from "./config";

export function timeStampToTime (timestamp, type) {
  let date = new Date(timestamp * 1000) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear()
  let M = date.getMonth() + 1
  let D = date.getDate()
  let h = date.getHours()
  let m = date.getMinutes()
  let s = date.getSeconds()
  D = D < 10 ? '0' + D : D
  M = M < 10 ? '0' + M : M
  h = h < 10 ? '0' + h : h
  m = m < 10 ? '0' + m : m
  s = s < 10 ? '0' + s : s

  if (type === 1) {
    return Y + '-' + M + '-' + D
  }
  return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s
}

function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function timeStampToCountDowm (timestamp) {
  let hours = parseInt((timestamp % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  let minutes = parseInt((timestamp % (1000 * 60 * 60)) / (1000 * 60))
  let seconds = (timestamp % (1000 * 60)) / 1000
  if (hours < 10) hours = '0' + hours
  if (minutes < 10) minutes = '0' + minutes
  if (seconds < 10) seconds = '0' + seconds
  return hours + ':' + minutes + ':' + seconds
}

export function formatDate (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const t1 = [year, month, day].map(formatNumber).join('-')
  return `${t1}`
}

export function formatTime (date, sliceStr = '-') {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join(sliceStr)
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

export function formatDateTime (date) {
  let d = new Date(date * 1000)
  const month = d.getMonth() + 1
  const day = d.getDate()

  const hour = d.getHours()
  const minute = d.getMinutes()
  const t1 = [month, day].map(formatNumber).join('-')
  const t2 = [hour, minute].map(formatNumber).join(':')
  return `${t1} ${t2}`
}

export function formatHourAndMinute (date) {
  let d = new Date(date * 1000)
  const hour = d.getHours()
  const minute = d.getMinutes()
  const t2 = [hour, minute].map(formatNumber).join(':')

  return `${t2}`
}

export function formatMonth (date) {
  let d = new Date(date * 1000)
  const month = d.getMonth() + 1
  const day = d.getDate()
  const t1 = [month, day].join('.')
  return `${t1}`
}

export function log (...str) {
  if (SHOW_LOG) {
    setTimeout(() => {
      console.log(...str)
    })
  }
}

export function formatFloat (f, digit) {
  let m = Math.pow(10, digit)
  return Number((Math.round(f * m, 10) / m).toFixed(2))
}

function groupBy (f) {
  let groups = {}
  this.forEach(function (o) {
    let group = JSON.stringify(f(o))
    groups[group] = groups[group] || []
    groups[group].push(o)
  })
  return Object.keys(groups).map(function (group) {
    return groups[group]
  })
}

// 当修改系统字体大小时，App中的Text大小就不会随之改变
export function install () {
  Array.prototype.groupBy = groupBy
  TextInput.defaultProps = Object.assign({}, TextInput.defaultProps, {allowFontScaling: false})
  Text.defaultProps = Object.assign({}, Text.defaultProps, {allowFontScaling: false})
  TouchableOpacity.defaultProps = Object.assign({}, TouchableOpacity.defaultProps, {activeOpacity: 0.8})
}

export function uuid () {
  let s = []
  let hexDigits = '0123456789abcdef'
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4'  // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)  // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-'

  let uuid = s.join('')
  return uuid
}

export function isEmptyObj (obj) {
  for (let key in obj) {
    return false
  }
  return true
}

export function formatFileSize (bytes) {
  let v = bytes
  let unit = ['B', 'KB', 'MB', 'G', 'T']
  let idx = 0
  while (v > 1024) {
    v /= 1024
    idx++
  }
  return formatFloat(v, 2) + unit[idx]
}

export function checkPhone (phoneNumber) {
  let reg = /^1[345678]\d{9}$/ // 手机号码
  if (reg.test(phoneNumber)) {
    return true
  }
  return false
}
