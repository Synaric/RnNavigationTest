import {HOST, REQUEST_SOURCE, VERSION_NUMBER} from '../utils/config'
import {AsyncStorage, Platform} from 'react-native'
import {NavigationActions} from 'react-navigation'
import {log} from '../utils/arts'

export function get (page, route, params, success, fail) {
  if (params) {
    params.platform = Platform.OS
    params.requestFrom = REQUEST_SOURCE
    params.versionNumber = VERSION_NUMBER
  }
  const url = HOST + route + (params && Object.keys(params).length ? ('?' + serialize(params)) : '')
  console.log('request API ------------ GET', url )
  AsyncStorage.getItem('token', (error, result) => {
    fetch(url, {
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'content-type': 'application/json',
          'authorization': result || ''
      },
    })
      .then(response => (response.json())) // parses response to JSON
      .then(response => {
        log(`response of [${route}]`, response)
        // if (response.code === 12 || response.code === -2) {
        //   AsyncStorage.removeItem('token', () => {
        //     page.props.navigation.reset([NavigationActions.navigate({routeName: 'Login'})], 0)
        //   });
        //   return
        // }
        if (success) success(response)
      }) // parses response to JSON
      .catch(e => {
        log(e)
        page.setState({refreshing: false})
        if (fail) fail(e)
      })
  })
}

export function post (page, route, data, success, fail) {
  if (data) {
    data.platform = Platform.OS
    data.requestFrom = REQUEST_SOURCE
    data.versionNumber = VERSION_NUMBER
  }
  console.log('request API ------------ POST', HOST + route )
    console.log('request API ------------ DATA', JSON.stringify(data) )
    console.log('request API ------------ token', AsyncStorage.getItem('token') )
  AsyncStorage.getItem('token', (error, result) => {
      console.log('request API ------------ token', AsyncStorage.getItem('token'), result )
    fetch(HOST + route, {
      body: JSON.stringify(data), // must match 'Content-Type' header
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        'content-type': 'application/json',
        'authorization': result || ''
      },
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
    })
      .then(response => (response.json())) // parses response to JSON
      .then(response => {
        log(`response of [${route}]`, response)
        // if (response.code === 12 || response.code === -2) {
        //   AsyncStorage.removeItem('token', () => {
        //     page.props.navigation.reset([NavigationActions.navigate({routeName: 'Login'})], 0)
        //   });
        //   return
        // }
        if (success) success(response)
      })
      .catch(e => {
        log(e)
        if (page) page.setState({refreshing: false})
        if (fail) fail(e)
      })
  })
}

const serialize = function (obj) {
  let ary = []
  for (let p in obj) {
    if (obj.hasOwnProperty(p) && (obj[p] !== undefined || obj[p] !== null)) {
      ary.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
    }
  }

  return ary.join('&') || ''
}

//上传文件
export function uploadImg (route, imgs, success, fail) {
  if (!(imgs && imgs.length)) return
  AsyncStorage.getItem('token', (error, result) => {
    let formData = new FormData()//如果需要上传多张图片,需要遍历数组,把图片的路径数组放入formData中
    imgs.map(item => {
      let file = {uri: item.uri, type: 'multipart/form-data', name: 'image.png'}   //这里的key(uri和type和name)不能改变,
      formData.append('file', file)   //这里的files就是后台需要的key
    })
    log(typeof formData)
    fetch(HOST + route, {
      method: 'POST',
      headers: {
        'content-type': 'multipart/form-data',
        'authorization': result || ''
      },
      body: formData
    })
      .then(response => response.json())
      .then(response => {
        log('Success:', response)
        if (success) success(response)
      })
      .catch(error => {
        log('Error:', error)
        if (fail) fail(error)
      })
  })
}