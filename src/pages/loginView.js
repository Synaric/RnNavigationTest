import React from 'react'
import {
    StyleSheet,
    View,
    Image,
    ImageBackground,
    Text, AsyncStorage, TouchableOpacity
} from 'react-native'
import Base from '../components/base'
import {rpx} from '../utils/adapter'
import NavBar from '../components/navBar'
import {common} from '../style/common'
import {wxLogin} from '../utils/third'

export default class LoginView extends Base {
  resolveStatusBar () {
    return {
      barStyle: 'light-content',
      backgroundColor: 'transparent',
      translucent: true
    }
  }

  constructor (props) {
    super(props)
    this.state = {}
  }

  componentWillMount () {

  }

  render () {
    return (
      <View style={{flex: 1, backgroundColor: '#f2f2f2'}}>
        <View style={common.titleBar} />
        {/*<NavBar title={'登录'}/>*/}
        <ImageBackground style={styles.loginView}
                         source={require('../imgs/login_bg_icon.png')}>
          <Image style={styles.loginIcon}
                 source={require('../imgs/login_logo_icon.png')}/>
          <View style={styles.authorityContainer}>
            <Text style={styles.authoritySub}>申请获得您的微信绑定手机号</Text>
            <TouchableOpacity style={styles.giveAuthority}
              onPress={() => {
                this.wxLogin()
              }}
            >
              <Text style={styles.authorityTitle}>微信手机号授权</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    )
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

}
const styles = StyleSheet.create({
  loginView: {
    width: rpx(750),
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  loginIcon: {
    width: rpx(220),
    height: rpx(213),
    marginTop: rpx(-300),
    alignItems: 'center',
    justifyContent: 'center'
  },
  authorityContainer: {
    position: 'absolute',
    bottom: rpx(247),
    justifyContent: 'center'
  },
  authoritySub: {
    fontSize: rpx(26),
    color: '#434141',
    textAlign: 'center'
  },
  giveAuthority: {
    marginTop: rpx(29),
    width: rpx(600),
    height: rpx(100),
    backgroundColor: '#17894c',
    borderRadius: rpx(50),
    alignItems: 'center',
    justifyContent: 'center'
  },
  authorityTitle: {
    height: rpx(100),
    lineHeight: rpx(100),
    fontSize: rpx(30),
    color: 'white'
  }
})
