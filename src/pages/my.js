import {Image, Platform, StyleSheet, Text, ScrollView, View} from 'react-native'
import React from 'react'
import BasePage from './basePage'
import {rpx} from '../util/adapterUtils'
import Btn from '../components/btn'

export default class My extends BasePage {

  constructor (props) {
    super(props)
    this.state = {
      count: 0,
      likeCount: 100,
      headList: [{
        title: '参与话题',
        count: 100,
      }, {
        title: '粉丝',
        count: 100,
      }, {
        title: '关注',
        count: 100,
      }],
      tabList: [
        {
          label: '学习记录',
          icon: require('../img/learn-record.png'),
          isShow: true
        },
        {
          label: '我的思考',
          icon: require('../img/my-think.png'),
          url: '/pages/myThink/main',
          isShow: true
        },
        {
          label: '我要投稿',
          icon: require('../img/my-contribute.png'),
          url: '/pages/myContribution/main',
          vip: 1,
          isShow: true
        },
        {
          label: '我要订刊',
          icon: require('../img/my-publish.png'),
          url: '/pages/records/main',
          link: 'https://mp.weixin.qq.com/s/T2m6ZzpPagDxJ7NObW5CKw',
          isShow: true
        },
        {
          label: '认证账号管理',
          icon: require('../img/sub-account-bind.png'),
          isShow: true
        },
        {
          label: '收货地址',
          icon: require('../img/address.png'),
          url: '/pages/shipping/main',
          vip: 1,
          isShow: true
        }
      ],
      newReply: false,
      user: {
        nickName: '胡剑',
        schoolGrade: '校长',
        schoolRole: 1,
        vipLevel: 1,
        schoolId: 5,
        School: {
          name: '清华大学'
        },
        face: 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIg7UeRj3FAxAkxv46w1Oza6dLuFTZLbmgKN5fVGb9ZUeTiasn1VibnU0AorbaqW7v6u3PKygALCQdA/132'
      }
    }
  }


  static options () {
    return {
      statusBar: {
        style: 'dark',
        backgroundColor: 'transparent',
        drawBehind: true
      }
    }
  }

  render () {
    let {user, headList, newReply, tabList} = this.state
    let showMore = user.schoolRole == 3 || user.schoolRole == 1
    return (
      <View style={{flex: 1}}>
        <View style={[styles.myHeader, {position: 'relative'}]}>
          <Image style={styles.myHeader} source={require('../img/user-center-bg.png')}/>
          <View style={styles.myInfo}>
            <View style={[styles.myHeaderImg, styles.myBorder]}>
              <Btn onPress={() => {
                this.toUserDetail()
              }}>
                <Image style={styles.headImg} source={{uri: user.face}}/>
              </Btn>
              {user.nickName === '匿名用户' ? <Btn onPress={() => {
                console.log('点击')
              }}/> : null}
            </View>
            <View style={styles.headerContent}>
              <View style={styles.headContent}>
                <Text style={styles.userNickName}>
                  <Text>{user.nickName}</Text>
                  {showMore && user.schoolGrade ?
                    <Text><Text>·</Text><Text>{user.schoolGrade}</Text></Text> : null}
                </Text>
                {showMore ?
                  <Btn onPress={() => {
                    this.toVipCenter()
                  }}><Image style={styles.keyIcon}
                            source={require('../img/key-icon.png')}/>
                  </Btn>
                  : null}
              </View>
              <View style={[styles.iconContainer, {marginTop: showMore ? rpx(20) : rpx(12)}]}>
                {showMore ?
                  <Image style={{height: rpx(26), width: rpx(26)}}
                         source={require('../img/cer-user-white.png')}/>
                  : null}
                {user.School && showMore ?
                  <Text style={{fontSize: rpx(24), color: '#ffffff', marginLeft: rpx(12)}}>
                    {user.School.name}
                  </Text>
                  : null}
                {user.schoolRole !== 3 && user.schoolRole !== 1 ?
                  <Btn onPress={() => {
                    this.toVipCenter()
                  }}><Image style={{height: rpx(42), width: user.vipLevel ? rpx(89) : rpx(132)}}
                            source={user.vipLevel ? require('../img/vip-user.png') : require('../img/custom-user.png')}/>
                  </Btn>
                  : null}
              </View>
            </View>
          </View>
        </View>
        <View style={[styles.tabList, {flex: 1}]}>
          <View style={{
            paddingVertical: rpx(40),
            flexDirection: 'row',
            backgroundColor: '#f4f9fa',
            borderTopRightRadius: rpx(20),
            borderTopLeftRadius: rpx(20),
          }}>
            {
              headList.map((it, index) => (
                <Btn style={[styles.op, index !== 2 ? styles.rightBorder : '']} key={index}>
                  <Text style={{fontSize: rpx(35), lineHeight: rpx(36), color: '#313332'}}>{it.count}</Text>
                  <Text style={{
                    fontSize: rpx(26),
                    lineHeight: rpx(36),
                    color: '#b1b1b1',
                    marginTop: rpx(28)
                  }}>{it.title}</Text>
                </Btn>
              ))
            }
          </View>

          <ScrollView style={{flex: 1}} contentContainerStyle={styles.tabItemContainer} showsVerticalScrollIndicator={false}>
            {
              tabList.map((ele, idx) => (ele.isShow ? <Btn style={styles.tabItem} key={idx} onPress={() => {
                this.skipUrl(ele, idx)
              }}>
                <View style={{flexDirection: 'row', alignItems: 'center', width: rpx(620)}}>
                  <Image source={ele.icon} style={styles.tabIcon}/>
                  <Text style={{
                    fontSize: rpx(26),
                    color: '#00070f'
                  }}>{ele.label}</Text>
                  {
                    idx == 2 ? <Image source={require('../img/key-icon.png')}
                                      style={{width: rpx(34), height: rpx(38), marginLeft: rpx(22)}}/>
                      : null
                  }
                  <View style={{flex: 1}}></View>
                </View>
                {
                  newReply && idx == 1 ? < View style={{
                    width: rpx(14),
                    height: rpx(14),
                    borderRadius: rpx(7),
                    backgroundColor: 'red',
                    marginRight: rpx(20)
                  }}></View> : null
                }
                <Image source={require('../img/jump-more.png')} style={styles.jumpMore}/>
              </Btn> : null))
            }
          </ScrollView>
        </View>
      </View>)
  }

  toUserDetail = () => {
    console.log('toUserDetail')
    if (this.state.user && this.state.user.School) {
      let userId = this.state.user.userId
      if (userId) {
        // wx.navigateTo({ url: `/pages/userDetail/main?userId=${userId}` })
      }
    }
  }

  toVipCenter = () => {
    if (Platform.OS === 'ios') {
      return
    }

    if (this.state.user.schoolRole === 3 || this.state.user.schoolRole === 1) {
      return
    }
    // wx.navigateTo({ url: '/pages/vipCenter/main?'})
    console.log('toVipCenter')
  }

  skipUrl = (item, idx) => {
    let user = this.state.user
    switch (idx) {
      case -1:
      case -2:
      case 0:
        console.log(idx)
        // wx.navigateTo({url: '/pages/records/main?category_type=' + idx})
        break
      case 1:
        this.setState({
          newReply: false
        })
      case 3:
        // let properties = {
        //userId: user.userId
        // }
        // logger(properties, 'bookPublication', (res) => {
        // })
        // wx.navigateTo({url: '/pages/webView/main?link=' + item.link})
        break
      case 4:
        if (user) {
          let schoolId = user.schoolId
          if (schoolId) {
            // wx.navigateTo({url: '/pages/subBinding/main?schoolId=' + schoolId})
          }
        }
        break
      default:
        if (item.vip) {
          if (user.vipLevel < item.vip) {
            toast('此功能为会员专享')
            return
          }
        }
      // wx.navigateTo({
      //   url: item.url
      // })
    }
  }

  checkReplyNew () {
    this.getApi('user/checkReplyNew', {}, res => {
      if (res.errcode === 0) {
        this.setState({
          newReply: res.data
        })
      }
    })
  }

  onShow () {
    this.print('My', 'onShow')
  }

  onHide () {
    this.print('My', 'onHide')
  }
}


const styles = StyleSheet.create({
  myHeader: {
    width: rpx(750),
    height: rpx(361)
  },
  myInfo: {
    position: 'absolute',
    flexDirection: 'row',
    top: rpx(133),
    left: rpx(30),
    alignItems: 'center',
    fontSize: rpx(32),
    fontWeight: 'bold',
    color: '#00070f'
  },
  myHeaderImg: {
    width: rpx(112),
    height: rpx(112),
    marginRight: rpx(30),
    position: 'relative',
    borderRadius: rpx(56)
  },
  myBorder: {
    borderWidth: rpx(2),
    borderColor: '#fff',
    borderStyle: 'solid'
  },
  headImg: {
    width: rpx(108),
    height: rpx(108),
    borderRadius: rpx(54)
  },
  headerContent: {
    flexDirection: 'column',
    height: rpx(120),
    justifyContent: 'center'
  },
  headContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userNickName: {
    color: '#fefefe',
    fontSize: rpx(30)
  },
  keyIcon: {
    width: rpx(31),
    height: rpx(35),
    marginLeft: rpx(12)
  },
  iconContainer: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  tabList: {
    marginTop: -rpx(30),
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderTopRightRadius: rpx(20),
    borderTopLeftRadius: rpx(20),
    width: rpx(750)
  },
  op: {
    width: rpx(250),
    height: rpx(84),
    flexDirection: 'column',
    alignItems: 'center'
  },
  rightBorder: {
    borderRightColor: '#f4f9fa',
    borderRightWidth: rpx(2),
    borderStyle: 'solid'
  },
  tabItemContainer: {
    paddingHorizontal: rpx(30),
    backgroundColor: '#fff',
  },
  tabItem: {
    width: rpx(690),
    height: rpx(120),
    backgroundColor: '#fff',
    borderBottomWidth: rpx(1),
    borderBottomColor: '#f4f9fa',
    borderStyle: 'solid',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tabIcon: {
    width: rpx(38),
    height: rpx(38),
    marginRight: rpx(20)
  },
  jumpMore: {
    width: rpx(12),
    height: rpx(20)
  }
})
