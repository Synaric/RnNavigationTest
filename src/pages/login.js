import React from 'react'
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  Image,
  AsyncStorage,
  Alert,
  ScrollView
} from 'react-native'
import Base from '../components/base'
import {isIphoneX, rpx} from '../utils/adapter'
import {NavigationActions} from 'react-navigation'
import {wxLogin} from '../utils/third'
// import * as Wxpay from 'react-native-wx'
import navigationService from '../utils/navigationService'
import {checkPhone} from "../utils/arts";

export default class Login extends Base {
  created () {
    this.state = {
      mobile: '',
      code: '',
      isShowSend: false,
      second: 60,
      isExitWX: false,
      isShowVisit: false
    }
    this.interval = null
  }

  mounted () {
    Wxpay.isWXAppInstalled().then(isWXExit => {
      console.log('是否安装有微信-------', isWXExit)
      if (isWXExit) {
        this.setState({isExitWX: isWXExit})
      }
    })
    // this.postApi('api/queryStatus', {}, (res) => {
    //   if (res.code === 1) {
    //     this.setState({isShowVisit: res.data.status == 1 ? false : true})
    //   }
    // }, () => {})
  }

  getVertifyCode () {
    if (!this.state.mobile) {
      Alert.alert('温馨提示', '请输入您的手机号码', [{text: '确定', onPress: () => console.log('Ask me later pressed')}])
      return
    } else if (this.state.mobile.length !== 11) {
      Alert.alert('温馨提示', '请输入正确的手机号码', [{text: '确定', onPress: () => console.log('Ask me later pressed')}])
      return
    }
    if (!checkPhone(this.state.mobile)) {
      Alert.alert('温馨提示', '请输入正确的手机号码', [{text: '确定', onPress: () => console.log('Ask me later pressed')}])
      return
    }

    console.log('mobile------', this.state.mobile)
    this.postApi('users/get_verify_code', {mobile: this.state.mobile}, (res) => {
      console.log('success--------', res)
      if (res.code === 0) {
        if (this.state.isShowSend && this.state.second > 0) {
          clearInterval(this.interval)
        }
        let sec = 61
        this.setState({isShowSend: true})
        this.interval = setInterval(() => {
          sec--
          this.setState({second: sec})
          if (sec === 0) {
            clearInterval(this.interval)
          }
        }, 1000)
      } else {
        this.toast(res.message)
      }
    }, (e) => {
    })
  }

  toMainPage () {
    const {code, mobile} = this.state
    if (!mobile) {
      Alert.alert('温馨提示', '请输入您的手机号码', [{text: '确定', onPress: () => console.log('Ask me later pressed')}])
      return
    } else if (mobile.length !== 11) {
      Alert.alert('温馨提示', '请输入正确的手机号码', [{text: '确定', onPress: () => console.log('Ask me later pressed')}])
      return
    }
    if (!code) {
      Alert.alert('温馨提示', '请输入您的手机验证码', [{text: '确定', onPress: () => console.log('Ask me later pressed')}])
      return
    } else if (code.length !== 6) {
      Alert.alert('温馨提示', '请输入6位的手机验证码', [{text: '确定', onPress: () => console.log('Ask me later pressed')}])
      return
    }
    console.log('mobile, code------', code, mobile)
    this.postApi('users/login_by_code', {code: code, mobile: mobile}, (res) => {
      console.log('success-----', res)
      if (res.code === 0) {
        let token = res.token
        AsyncStorage.setItem('token', token, () => {
          this.props.navigation.reset([NavigationActions.navigate({routeName: 'Main'})], 0)
        })
      } else {
        this.toast(res.message)
      }
    }, (e) => {
      this.toast('验证失败，请重试')
    })
  }

  visitorLogin () {
    this.postApi('users/visitor_login', {}, (res) => {
      if (res.code === 0) {
        if (res.code === 0) {
          let token = res.data.tokenModel.token
          let userId = res.data.tokenModel.userId
          AsyncStorage.setItem('token', userId + '_' + token, () => {
            this.props.navigation.reset([NavigationActions.navigate({routeName: 'Main'})], 0)
          })
        } else {
          this.toast(res.message)
        }
      } else {
        this.toast('游客登录失败')
      }
    }, () => {
    })
  }


  wxLogin () {
    wxLogin().then(data => {
      console.log('wx_login')
      console.log(data)
      this.postApi('users/wx_login', {code: data.code}, res => {
        if (res.code == 1) {
          if (res.data.status == 1) {
            // 已经是注册用户
            AsyncStorage.setItem('token', res.data.token.userId + '_' + res.data.token.token, () => {

            })
          } else {
            // 非注册，绑定手机号
            this.props.navigation.navigate('MobilePhone', {type: 'wx', openId: res.data.openId})
          }
        } else {
          this.toast('登陆失败')
        }
      })
    })
  }

  render () {
    const {mobile, isShowSend, code, second, isExitWX} = this.state
    return (
      <View style={styles.loginContainer}>
        <ScrollView style={{flex: 1, width: rpx(750)}}>
          <View style={[styles.loginInnerView]}>
            <View style={{width: rpx(750), marginTop: isIphoneX() ? rpx(150) : rpx(126), alignItems: 'center'}}>
              <Text style={{width: rpx(550), fontSize: rpx(48), fontWeight: 'bold', color: '#313332'}}>手机号登录</Text>
              <Text
                style={{width: rpx(550), marginTop: rpx(40), lineHeight: rpx(46), fontSize: rpx(32), color: '#313332'}}>
                手机号验证码登录,进入湘丰质选
              </Text>
            </View>
            <View style={{width: rpx(750), marginTop: rpx(120), alignItems: 'center', justifyContent: 'center'}}>
              <View style={{width: rpx(550), alignItems: 'center',}}>
                <View style={styles.mobileInputView}>
                  <View style={{
                    position: 'absolute',
                    height: rpx(60),
                    left: rpx(40),
                    top: rpx(20),
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}>
                    <Text style={{fontSize: rpx(30), color: '#313332'}}>+86</Text>
                    <Image style={{height: rpx(6), width: rpx(12), marginLeft: rpx(26), marginBottom: rpx(8)}}
                           source={require('../imgs/down_arraw_black_icon.png')}/>
                  </View>
                  <TextInput
                    style={{height: rpx(80), width: rpx(550), fontSize: rpx(30), color: '#313332', textAlign: 'center'}}
                    onChangeText={(mobile) => {
                      const newText = mobile.replace(/[^\d]+/, '')
                      this.setState({mobile: newText})
                    }}

                    value={mobile}
                    keyboardType={'numeric'}
                    maxLength={11}
                    placeholder={'输入手机号码'}
                    placeholderTextColor={'#b1b1b1'}
                  />
                </View>
                {isShowSend ? (<View
                  style={[styles.codeInputViewBox, isShowSend ? {marginBottom: rpx(30)} : {marginBottom: rpx(60)}]}>
                  <View style={styles.codeInputView}>
                    <TextInput style={{
                      height: rpx(80),
                      width: rpx(470),
                      fontSize: rpx(30),
                      color: '#313332',
                      textAlign: 'center'
                    }}
                               onChangeText={(num) => {
                                 const newText = num.replace(/[^\d]+/, '')
                                 this.setState({code: newText})
                               }}
                               value={code}
                               keyboardType={'numeric'}
                               maxLength={6}
                               placeholder={'请输入验证码'}
                               placeholderTextColor={'#b1b1b1'}
                    />
                  </View>
                  {isShowSend ?
                    <TouchableOpacity activeOpacity={0.8} onPress={this.getVertifyCode.bind(this)}>
                      <Text style={{
                        fontSize: rpx(24),
                        color: '#313332',
                        textDecorationLine: 'underline',
                        marginTop: rpx(20)
                      }}>再次发送({second})</Text>
                    </TouchableOpacity> : null}
                </View>) : (<TouchableOpacity activeOpacity={1} style={styles.getCodeBtnTouch}
                                              onPress={this.getVertifyCode.bind(this)}>
                  <View style={[styles.loginBtn, mobile.length === 11 ? styles.activeBgColor : styles.normalBgColor]}>
                    <Text style={{fontSize: rpx(30), color: '#ffffff'}}>获取验证码</Text>
                  </View>
                </TouchableOpacity>)}
                <TouchableOpacity activeOpacity={1} style={styles.loginBtnTouch} onPress={this.toMainPage.bind(this)}>
                  <View
                    style={[styles.loginBtn, code.length === 6 && mobile.length === 11 ? styles.activeBgColor : styles.normalBgColor]}>
                    <Text style={{fontSize: rpx(30), color: '#ffffff'}}>登录</Text>
                  </View>
                </TouchableOpacity>
                <Text style={{fontSize: rpx(24), color: '#b1b1b1', marginTop: rpx(20)}}>未注册手机验证后自动登录</Text>
              </View>
            </View>
            <View style={styles.bottomOtherLoginType}>
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <Text style={{fontSize: rpx(22), color: '#313332'}}>注册即代表同意 湘丰质选</Text>
                <TouchableOpacity activeOpacity={0.8}
                                  onPress={() => {
                                    navigationService.navigate('Protocol')
                                  }}>
                  <Text style={{fontSize: rpx(22), color: '#313332', textDecorationLine: 'underline'}}>用户协议</Text>
                </TouchableOpacity>
                <Text style={{fontSize: rpx(22), color: '#313332'}}>和</Text>
                <TouchableOpacity activeOpacity={0.8}
                                  onPress={() => {
                                    navigationService.navigate('PrivacyPolicy')
                                  }}>
                  <Text style={{fontSize: rpx(22), color: '#313332', textDecorationLine: 'underline'}}>隐私政策</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  loginContainer: {
    width: rpx(750),
    flex: 1,
    backgroundColor: '#fff'
  },
  loginInnerView: {
    width: rpx(750),
    flexDirection: 'column',
    alignItems: 'center',
  },
  mobileInputView: {
    position: 'relative',
    height: rpx(100),
    width: rpx(550),
    borderRadius: rpx(50),
    backgroundColor: '#f2f2f2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  getCodeBtnTouch: {
    height: rpx(100),
    width: rpx(550),
    borderRadius: rpx(50),
    marginVertical: rpx(60),
  },
  loginBtnTouch: {
    height: rpx(100),
    width: rpx(550),
    borderRadius: rpx(50),
  },
  loginBtn: {
    height: rpx(100),
    width: rpx(550),
    borderRadius: rpx(50),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeInputViewBox: {
    width: rpx(550),
    alignItems: 'center',
    marginTop: rpx(60),
  },
  codeInputView: {
    height: rpx(100),
    width: rpx(550),
    borderRadius: rpx(50),
    backgroundColor: '#f2f2f2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeBgColor: {
    backgroundColor: '#17894c'
  },
  normalBgColor: {
    backgroundColor: 'rgba(23, 137, 76, 0.4)',
  },
  bottomOtherLoginType: {
    width: rpx(750),
    marginTop: rpx(200),
    marginBottom: isIphoneX() ? rpx(94) : rpx(60),
    alignItems: 'center',
  },
  otherLoginType: {
    height: rpx(106),
    width: rpx(390),
    marginTop: rpx(30),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  visitorLogin: {
    height: rpx(80),
    width: rpx(300),
    borderRadius: rpx(40),
    borderColor: '#ca3839',
    borderWidth: rpx(1),
    alignItems: 'center',
    justifyContent: 'center',
  }
})
