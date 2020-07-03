import React from 'react'
import {
    Platform,
    StatusBar,
    View,
    AsyncStorage,
    Dimensions,
    PermissionsAndroid,
    DeviceEventEmitter
} from 'react-native'
import Toast from 'react-native-root-toast'
import NetWorkTool from '../utils/network'
import {get, post, uploadImg} from '../request/API'

export default class Base extends React.Component {

    constructor (props) {
        super(props)
        // willFocus该属性用来指定一个回调函数,在导航组件准备进行场景切换前,这个回调函数将被调用。
        this._willFocusListener = props.navigation.addListener('willFocus', this.onWillFocus)
        this._willBlurListener = props.navigation.addListener('willBlur', this.onWillBlur)
        this.networkConnected = true
        this._netChange = () => {
            NetWorkTool.checkNetworkState((isConnected) => {
                if (!isConnected) {
                    this.toast(NetWorkTool.NOT_NETWORK)
                    this.networkConnected = false
                } else {
                    if (!this.networkConnected) {
                        this.networkConnected = true
                        // 网络重新连接
                        this.onNetworkConnected()
                    }
                }
            })
        }
        this.deviceEventEmitterListeners = []
        this.created()
    }

    componentDidMount () {
        this.mounted()
    }

    componentWillUnmount () {
        this._willFocusListener.remove()
        this._willBlurListener.remove()
        let feedback = this.unmounted()
        try {
            if (this.getParams()) {
                const {onResult} = this.getParams()
                if (onResult) {
                    onResult(feedback)
                }
            }
        } catch (e) {
            console.log(e)
        }
        this.deviceEventEmitterListeners.forEach(it => {
            if (it && it.remove) it.remove()
        })
        this.deviceEventEmitterListeners = []
    }

    onWillFocus = () => {
        NetWorkTool.addEventListener('connectionChange', this._netChange)
        this._setStatusBar()
    }

    onWillBlur = () => {
        NetWorkTool.removeEventListener('connectionChange', this._netChange)
    }

    _setStatusBar = () => {
        let statusBar = this.resolveStatusBar()
        console.log('~~~', statusBar)
        StatusBar.setBarStyle(statusBar.barStyle)
        if (Platform.OS === 'android') {
            // Android特有属性
            // backgroundColor:Android设备上状态栏的背景颜色
            // translucent:布尔类型,状态栏是否半透明,如果为true,应用将从物理顶端开始显示
            StatusBar.setTranslucent(statusBar.translucent === undefined ? false : statusBar.translucent)
            StatusBar.setBackgroundColor(statusBar.backgroundColor)
        }
    }

    // resolveStatusBar() {
    //   return {
    //     barStyle: 'dark-content',
    //     backgroundColor: '#fff',
    //     translucent: false
    //   }
    // }

    resolveStatusBar () {
        return {
            barStyle: 'dark-content',
            backgroundColor: '#fff',
            translucent: false
        }
    }

    on (event, callback) {
        this.deviceEventEmitterListeners.push(callback)
        DeviceEventEmitter.addListener(event, callback)
    }

    getApi (url, params, success, fail) {
        this.log('get router', url, params)
        get(this, url, params, success, fail)
    }

    postApi (router, data, success, fail) {
        this.log('post router', router, data)
        post(this, router, data, success, fail)
    }

    uploadApi (url, imgs, success, fail) {
        uploadImg(url, imgs, success, fail)
    }

    getParams () {
        console.log('this.props.navigation.state', this.props.navigation.state)
        return this.props.navigation.state.params
    }

    log (...msg) {
        console.log(...msg)
    }

    toast (msg) {
        Toast.show(msg)
    }

    getWindowHeight () {
        return Platform.OS === 'android' && Platform.Version > 26 ? Dimensions.get('window').height + StatusBar.currentHeight : Dimensions.get('window').height
    }

    getUserInfo (callback) {
        if (callback) {
            AsyncStorage.getItem('__userInfo__', (err, result) => {
                result ? callback(JSON.parse(result)) : callback(null)
            })
        }
    }

    async requestPermission (permission, msg, callback) {
        let count = 0
        if (Platform.OS === 'ios') {
            count++
            console.log('-----------', count)
            callback(true)
            return
        }
        const granted = await PermissionsAndroid.request(permission,
            {
                title: '权限认证',
                message: msg,
                buttonNeutral: '稍后再说',
                buttonNegative: '取消',
                buttonPositive: '好的',
            })
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            callback(true)
        } else {
            callback(false)
        }
    }

    created () {
    }

    mounted () {
    }

    unmounted () {
    }

    onNetworkConnected () {
    }
}
