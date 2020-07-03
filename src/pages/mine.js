// import React from 'react'
// import Base from '../components/base'
// import {AsyncStorage, Image, StyleSheet, Text, TouchableOpacity, View, Platform} from 'react-native'
// import {common} from '../style/common'
// import {rpx} from '../utils/adapter'
// import navigationService from '../utils/navigationService'
// import {wxLogin} from '../utils/third'
//
// export default class Mine extends Base {
//
//   resolveStatusBar () {
//     return {
//       barStyle: 'light-content',
//       backgroundColor: 'transparent',
//       translucent: Platform.OS === 'android'
//     }
//   }
//
//   created () {
//     this.tabList = [
//       {
//         icon: require('../imgs/order_icon.png'),
//         title: '我的订单',
//         url: 'MyOrderList',
//         params: {type: 0},
//         is_custom: 1
//       },
//       {
//         icon: require('../imgs/hotel_icon.png'),
//         title: '酒店订单',
//         url: 'HotelOrderList',
//         params: {type: 0},
//         is_custom: 1
//       },
//       {
//         icon: require('../imgs/ticket_icon.png'),
//         title: '门票订单',
//         url: 'TicketOrderList',
//         params: {type: 0},
//         is_custom: 1
//       },
//       {
//         icon: require('../imgs/shopping_icon.png'),
//         title: '购物车',
//         url: 'ShoppingCart',
//         params: {},
//         is_custom: 1
//       },
//       {
//         icon: require('../imgs/distribution_icon.png'),
//         title: '分销系统',
//         url: 'DistributionCenter',
//         params: {},
//         is_salesman: 1
//       },
//       {
//         icon: require('../imgs/my_collect_icon.png'),
//         title: '我的收藏',
//         url: 'MyStars',
//         params: {},
//         is_custom: 1
//       }
//     ]
//
//     this.state = {
//       userInfo: {},
//       menuList: [],
//       openStatus: false
//     }
//     this.willFocusListener = null
//   }
//
//   mounted () {
//     this.willFocusListener = this.props.navigation.addListener('willFocus', this.getRecentUserInfo)
//     this.getOpenStatus()
//   }
//
//   getRecentUserInfo = () => {
//     this.getApi('users/get_user_info', {}, (res) => {
//       if (res.code === 0) {
//         let results = res.results
//         this.setState({userInfo: results}, () => {
//           let menuList = []
//           if (results.is_salesman) {
//             menuList = this.tabList.filter(item => {
//               return item.is_salesman === 1 || item.is_custom === 1
//             })
//           } else if (results.is_checkman) {
//             menuList = this.tabList.filter(item => {
//               return item.is_checkman === 1 || item.is_custom === 1
//             })
//           } else {
//             menuList = this.tabList.filter(item => {
//               return item.is_custom === 1
//             })
//           }
//           this.setState({menuList: menuList})
//         })
//         AsyncStorage.setItem('__userInfo__', JSON.stringify(results), (err) => {})
//       }
//     })
//   }
//
//
//   getOpenStatus () {
//     this.postApi('version', {}, (res) => {
//       console.log('version----------', res)
//       if (res.code === 0) {
//         this.setState({openStatus: res.results});
//       }
//     })
//   }
//
//   unmounted () {
//     this.willFocusListener.remove()
//   }
//
//   onOpsClick = (item) => {
//     navigationService.navigate(item.url, item.params)
//   }
//
//   skipToUserAccount = () => {
//     navigationService.navigate('PersonalAccount')
//   }
//
//   skipToUserManage = () => {
//     navigationService.navigate('MyInfo')
//   }
//
//   wxLogin = () => {
//     wxLogin().then(data => {
//       this.postApi('users/wx_login', {code: data.code}, res => {
//         if (res.code === 0) {
//           this.getUserInfo((userInfo) => {
//             if (userInfo) {
//               let newUserInfo = Object.assign(userInfo, res.results)
//               this.setState({userInfo: newUserInfo})
//               AsyncStorage.setItem('__userInfo__', JSON.stringify(newUserInfo), (err) => {})
//             }
//           })
//         } else {
//           this.toast('获取用户头像信息失败!')
//         }
//       })
//     })
//   }
//
//   render () {
//     let {menuList, userInfo} = this.state
//     return (
//       <View style={{flex: 1, backgroundColor: '#f2f2f2'}}>
//         <View style={styles.header}>
//           <Image style={{width: rpx(750), height: rpx(330)}} source={require('../imgs/mine_bg_icon.png')}/>
//           <View style={styles.avatarBorder}/>
//
//           {userInfo.face ? <Image style={styles.avatar}
//                                   source={{uri: userInfo.face}}/> :
//             <TouchableOpacity style={styles.avatar} onPress={() => {
//               this.wxLogin()
//             }}>
//               <Image style={{width: rpx(120), height: rpx(120)}}
//                      source={require('../imgs/default_logo_icon.png')}/>
//             </TouchableOpacity>}
//           {userInfo.nick_name ?
//             <View style={styles.mineInfoText}>
//               <Text style={{fontSize: rpx(36), color: '#ffffff', width: rpx(350)}} ellipsizeMode={'tail'}
//                     numberOfLines={1}>{userInfo.custom_nickname ? (userInfo.custom_nickname) : (userInfo.nick_name ? userInfo.nick_name : '湘丰集团')}</Text>
//               <TouchableOpacity style={[styles.accountManage, common.center]} onPress={() => {this.skipToUserManage()}}>
//                 <Text style={{fontSize: rpx(20), color: '#ffffff'}}>账号管理 ></Text>
//               </TouchableOpacity>
//             </View>
//             : <Text style={styles.clickToLogin}>点击头像授权微信信息</Text>
//           }
//
//         </View>
//
//         <TouchableOpacity style={styles.profile} onPress={() => {this.skipToUserAccount()}} activeOpacity={1}>
//           <Image style={{width: rpx(64), height: rpx(64), marginLeft: rpx(40)}}
//                  source={require('../imgs/mine_account_icon.png')}/>
//           <View style={styles.splitBlock}/>
//           <View style={{flexDirection: 'column', paddingVertical: rpx(33), justifyContent: 'space-between'}}>
//             <Text style={{fontSize: rpx(30), color: 'black'}}>时时刻刻了解您的账户</Text>
//             <Text style={{fontSize: rpx(24), color: '#787878', marginTop: rpx(10)}}>点击查看账户金额详情</Text>
//           </View>
//           {userInfo.is_vip ? <View style={styles.accountVip}>
//             <Image source={require('../imgs/vip_card_icon.png')} style={{width: rpx(150), height: rpx(100)}}/>
//           </View> : null}
//         </TouchableOpacity>
//
//         <View style={styles.ops}>
//           {
//             menuList.map((it, index) => (
//               <TouchableOpacity style={styles.op} key={index} onPress={this.onOpsClick.bind(this, it)}>
//                 <Image style={{width: rpx(64), height: rpx(64), padding: rpx(2), marginTop: rpx(50)}} source={it.icon}/>
//                 <Text style={{fontSize: rpx(26), marginTop: rpx(34)}}>{it.title}</Text>
//               </TouchableOpacity>
//             ))
//           }
//         </View>
//       </View>
//     )
//   }
// }
//
// const styles = StyleSheet.create({
//   header: {
//     width: rpx(750),
//     height: rpx(330),
//     position: 'relative'
//   },
//   avatarBorder: {
//     width: rpx(140),
//     height: rpx(140),
//     borderRadius: rpx(70),
//     borderWidth: rpx(1),
//     borderColor: 'white',
//     position: 'absolute',
//     left: rpx(30),
//     top: rpx(100)
//   },
//   avatar: {
//     width: rpx(120),
//     height: rpx(120),
//     borderWidth: rpx(1),
//     borderRadius: rpx(60),
//     position: 'absolute',
//     left: rpx(40),
//     top: rpx(110)
//   },
//   clickToLogin: {
//     fontSize: rpx(26),
//     color: 'white',
//     position: 'absolute',
//     left: rpx(200),
//     top: rpx(157)
//   },
//   profile: {
//     width: rpx(690),
//     height: rpx(140),
//     borderRadius: rpx(20),
//     backgroundColor: 'white',
//     flexDirection: 'row',
//     alignItems: 'center',
//     position: 'absolute',
//     left: rpx(30),
//     top: rpx(270)
//   },
//   splitBlock: {
//     width: rpx(1),
//     height: rpx(80),
//     marginHorizontal: rpx(30),
//     borderColor: '#d2d2d2',
//     borderLeftWidth: rpx(2)
//   },
//   ops: {
//     width: rpx(720),
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginLeft: rpx(30),
//     marginTop: rpx(110)
//   },
//   op: {
//     width: rpx(210),
//     height: rpx(210),
//     borderRadius: rpx(12),
//     backgroundColor: 'white',
//     alignItems: 'center',
//     marginRight: rpx(30),
//     marginBottom: rpx(30)
//   },
//   mineInfoText: {
//     position: 'absolute',
//     left: rpx(200),
//     top: rpx(115)
//   },
//   accountManage: {
//     width: rpx(130),
//     height: rpx(40),
//     marginTop: rpx(15),
//     borderRadius: rpx(10),
//     borderStyle: 'solid',
//     borderWidth: rpx(1),
//     borderColor: '#fff',
//   },
//   accountVip: {
//     width: rpx(150),
//     height: rpx(100),
//     marginLeft: rpx(40)
//   }
// })

import React from 'react'
import Base from '../components/base'
import {AsyncStorage, Image, StyleSheet, Text, TouchableOpacity, View, Platform, ScrollView, DeviceEventEmitter} from 'react-native'
import {common} from '../style/common'
import {rpx} from '../utils/adapter'
import navigationService from '../utils/navigationService'
import {wxLogin} from '../utils/third'
import PropTypes from 'prop-types'
import NavBar from '../components/navBar.android'
import CategoryItem from '../components/categoryItem'
import NewsItem from '../components/newsItem'
import {thumbAndCommentAndBrowser, timePeriod, URL} from '../utils/utils'

export default class Mine extends Base {
    resolveStatusBar () {
        return {
            barStyle: 'dark-content',
            backgroundColor: '#fff',
            translucent: true
        }
    }

    created () {
        this.willFocusListener = null
        this.state = {
            userInfo: {},
            newsList: [],
            tabList: [
                {
                    label: '我的收藏',
                    icon: 'http://weixinfactory.di1game.com/weixinfactory/Icon/20200219/182422/8d1b58b585c6a97271a4ed168440abfc.png'
                },
                {
                    label: '我的评论',
                    icon: 'http://weixinfactory.di1game.com/weixinfactory/Icon/20200219/182459/ebff7f10a6e08d8cbee6e4be27d45511.png'
                },
                {
                    label: '我的点赞',
                    icon: 'http://weixinfactory.di1game.com/weixinfactory/Icon/20200219/182522/4c3214683801f4dcc9cb12957bf4e8c3.png'
                },
                {
                    label: '浏览历史',
                    icon: 'http://weixinfactory.di1game.com/weixinfactory/Icon/20200219/182537/34bc6d8454a06bebc9e672df49cf2691.png'
                },
                // {
                //     label: '我的关注',
                //     icon: 'http://weixinfactory.di1game.com/weixinfactory/Icon/20200219/182252/b32ae037b58912374f53e0ec510602a8.png'
                // }
            ]
        }
    }

    mounted () {
        console.log('================= 我的 =======================')
        this.getRecommendItem()
        this.willFocusListener = DeviceEventEmitter.addListener('changeSubscribe',(e)=>{
            console.log(' ====== changeSubscribe ======', e)
            // this.refreshStatus(e)
        });
        AsyncStorage.getItem('userInfo', (error, e) => {
            this.setState({
                userInfo: JSON.parse(e)
            })
        })
        AsyncStorage.getItem('mySubscribe', (error, results) => {
            console.log('AsyncStorageAsyncStorageAsyncStorageAsyncStorage11', results)
            // this.state.edInfo.subscribeStatus = Number(JSON.parse(results).indexOf(res.data.UserInfo ? res.data.UserInfo.User.userId : -1) === -1 ? 0 : 1)
        })
    }

   unmounted () {
       this.willFocusListener.remove();
   }

    refreshStatus (edInfo) {
        let arr = this.state.newsList
        arr.map(item => {
            if (item.UserInfo.userId == edInfo.userId) {
                item.subscribeStatus = edInfo.subscribeStatus
            }
        })
        this.setState({
            newsList: arr
        })
    }

    getPicList (list) {
        try {
            return JSON.parse(list).slice(0, 3)
        } catch (e) {
            return []
        }
    }

    formateData (data) {
        data && data.map(item => {
            item.showPic = true
            item.defPic = 'https://weixinfactory.di1game.com/web/header-images/logo.png'
            item.UserInfo = item.UserInfo ? item.UserInfo : {User: {}}
            AsyncStorage.getItem('mySubscribe', (error, results) => {
                console.log('AsyncStorageAsyncStorageAsyncStorageAsyncStorage', results)
                item.subscribeStatus = JSON.parse(results).indexOf(item.UserInfo ? item.UserInfo.User.userId : -1) === -1 ? 0 : 1
            })
            // item.subscribeStatus = wx.getStorageSync('mySubscribe').indexOf(item.UserInfo.User.userId) === -1 ? 0 : 1
            item.UserInfo = item.UserInfo ? item.UserInfo : {}
            item.properties.picList = this.getPicList(item.properties.picList)
            // 现在的时间戳
            // 过去的时间戳
            // 差值
            item.showItem = 0
            item.time = timePeriod(item.createTime)
            if (!item.ItemCount) {
                item.ItemCount = {
                    likeCount: 0,
                    replyCount: 0,
                    viewCount: 0
                }
            }
            // 列表选择点赞数、评论数、浏览数*0.3（仅比较时*0.3），三个值中值最大的展示
            item.adjectives = thumbAndCommentAndBrowser(item)
        })
        return data
    }

    // 用户优化 列表每个Item的渲染速度 故再做一次处理 将无用的数据剔除
    reductionData (data) {
        data && data.forEach(item => {
            if (!item.ItemCount) {
                item.ItemCount = {
                    likeCount: 0,
                    replyCount: 0,
                    viewCount: 0
                }
            }
        })
        return data.map(item => {
            return {
                showItem: 0,
                itemId: item.itemId,
                itemTypeId: item.itemTypeId,
                itemName: item.itemName,
                showType: item.properties.showType,
                pic: item.properties.pic.startsWith('https') ? item.properties.pic : (item.properties.pic ? URL + '/' + item.properties.pic : item.properties.picList[0]),
                link: item.properties.link ? URL + '/' + item.properties.link : '',
                // picList: ['https://weixinfactory.di1game.com/jinmai/Icon/20200401/101910/14a20d3464cb105163dbe04b13baf439.png', 'https://weixinfactory.di1game.com/jinmai/Icon/20200401/101910/14a20d3464cb105163dbe04b13baf439.png', 'https://weixinfactory.di1game.com/jinmai/Icon/20200401/101910/14a20d3464cb105163dbe04b13baf439.png'],
                picList: this.getPicList(item.properties.picList),
                acronym: item.UserInfo ? item.UserInfo.User.nickName.substring(0, 1) : '',
                time: timePeriod(item.properties.publishTime * 1000, 1),
                adjectives: thumbAndCommentAndBrowser(item),
                author: item.properties.author,
                Like: item.Like,
                ItemCount: item.ItemCount,
                defPic: 'https://weixinfactory.di1game.com/web/header-images/logo.png',
                UserInfo: item.UserInfo,
            }
        })
    }

    transformNewsItem (data, type) {
        console.log('transformNewsItem1', data)
        data.map(item => {
            return item.itemTypeId <= type
        })
        console.log('transformNewsItem3', data)
        data && data.forEach(item => {
            if (!item.ItemCount) {
                item.ItemCount = {
                    likeCount: 0,
                    replyCount: 0,
                    viewCount: 0
                }
            }
        })
        return data.map((item, index) => {
            let tempPicList = item.properties.picList ? JSON.parse(item.properties.picList) : []
            let pic1 = item.properties.pic.startsWith('https') ? item.properties.pic : (item.properties.pic ? URL + '/' + item.properties.pic : tempPicList[0])
            let picList = tempPicList.length > 0 ? tempPicList : pic1 ? [pic1] : ''
            console.log('transformNewsItem2', picList)
            return {
                showItem: 0,
                itemId: item.itemId,
                itemTypeId: item.itemTypeId,
                itemName: item.itemName,
                showType: pic1 && picList ? 1 : 0,
                pic: pic1,
                link: item.properties.link ? URL + '/' + item.properties.link : '',
                picList: picList,
                acronym: item.UserInfo ? item.UserInfo.User.nickName.substring(0, 1) : '',
                time: timePeriod(item.properties.publishTime * 1000, 1),
                adjectives: thumbAndCommentAndBrowser(item),
                author: item.properties.author,
                Like: item.Like,
                ItemCount: item.ItemCount,
                defPic: 'https://weixinfactory.di1game.com/web/header-images/logo.png',
                UserInfo: item.UserInfo,
                // subscribeStatus: wx.getStorageSync('mySubscribe').indexOf(item.UserInfo.User.userId) === -1 ? 0 : 1
            }
        })
    }

    getRecommendItem () {
        let params = {
            itemId: 1,
            length: 5
        }
        this.getApi('/item/getRelateItem', params, res => {
            console.log('getRelateItem', res)
            if (res.errcode === 0) {
                let results = this.transformNewsItem(res.data ? res.data : [], 1)
                console.log('getRelateItem =====', results)
                this.setState({
                    newsList: results
                }, () => {

                })
            }
        })
    }
    // export default class Mine extends React.Component {
    //     static propTypes = {
    //         title: PropTypes.array,
    //     }
    //
    //     static defaultProps = {
    //         title: [
    //             // {categoryName: '关注'},
    //             // {categoryName: '推荐'},
    //             // {categoryName: '推荐'},
    //             // {categoryName: '推荐'},
    //             // {categoryName: '推荐'}
    //         ]
    //     }

    // constructor (props) {
    //     super(props)
    //     this.state = {cateType: 1}
    // }

    // componentDidMount () {
    //     this.state = {
    //         cateType: 1
    //     }
    // }
    wxLogin () {
        console.log('hello world')
        console.log('wxLoginwxLoginwxLoginwxLoginwxLogin')
        wxLogin().then(data => {
            console.log('111111', data)
            // this.postApi('user/wx', {code: data.code}, res => {
            //     if (res.code == 1) {
            //         if (res.data.status == 1) {
            //             // 已经是注册用户
            //             AsyncStorage.setItem('token', res.data.token.userId + '_' + res.data.token.token, () => {
            //                 this.props.navigation.reset([NavigationActions.navigate({routeName: 'MainTab'})], 0)
            //             })
            //         } else {
            //             // 非注册，绑定手机号
            //             this.props.navigation.navigate('MobilePhone', {type: 'wx', openId: res.data.openId})
            //         }
            //     } else {
            //         this.toast('登陆失败')
            //     }
            // })
        })
    }

    render () {
        let {tabList, newsList, userInfo} = this.state
        return (
            <ScrollView style={styles.mineStyle}>
                <View style={{marginHorizontal: rpx(30)}}>
                    <View style={styles.myHeaderImg}>
                        <TouchableOpacity onPress={() => {
                            this.wxLogin()
                        }}>
                        <Image
                            style={{width: rpx(120), height: rpx(120), borderRadius: rpx(60), marginRight: rpx(30)}}
                            source={{uri: userInfo.face}}></Image>
                        </TouchableOpacity>
                        <Text style={styles.nickName}>{userInfo.nickName}</Text>
                    </View>
                    <View style={styles.tabList}>
                        {
                            tabList && tabList.map((it, index) => (
                                <TouchableOpacity style={styles.tabItem} onPress={() => {
                                    this.selectTab(it, index)
                                }}>
                                    <Image style={{
                                        width: rpx(64),
                                        height: rpx(64),
                                        marginRight: rpx(30)
                                    }} source={{uri: it.icon}}></Image>
                                    <Text style={{
                                        fontSize: rpx(26),
                                        fontWeight: 'bold',
                                        color: '#00070f'
                                    }}>{it.label}</Text>
                                </TouchableOpacity>
                            ))
                        }
                    </View>
                    {
                        newsList && newsList.length > 0 ? <Text style={common.recommendTitle}>精彩推荐</Text> : null
                    }
                </View>
                <NewsItem newsList={newsList}
                          refreshData={this.refreshData.bind(this)}
                          subscribeEd={this.subscribeEd.bind(this)}
                          loadMore={() => {}}>
                </NewsItem>
                <View style={{width: rpx(750), height: rpx(100)}}></View>
            </ScrollView>
        )
    }

    refreshData () {
        let arr = this.state.newsList
        arr.map(item => {

        })
    }

    subscribeEd (item) {
        console.log('subscribeEd==========', item)
        // if (wx.getStorageSync('userInfo').nickName === '匿名用户') {
        //     wx.navigateTo({url: '/pages/loginView/main?userType=0'})
        //     return
        // }
        let isSubscribe = item.subscribeStatus
        let path = isSubscribe ? 'unFollow' : 'follow'
        this.postApi(`/user/${path}`, {followUserId: item.UserInfo.distinctId}, res => {
            console.log(res)
            console.log(1111111111)
            if (res.errcode === 0) {
                let arr = this.state.newsList
                arr.map(it => {
                    if (it.UserInfo.User.userId == item.UserInfo.User.userId) {
                        it.subscribeStatus = !it.subscribeStatus
                    }
                })
                AsyncStorage.getItem('mySubscribe', (error, results) => {
                    console.log('mySubscribemySubscribe', results)
                    let arr = JSON.parse(results)
                    let id = item.UserInfo.distinctId
                    if (item.subscribeStatus) {
                        if (arr.indexOf(id) == -1) {
                            arr.push(id)
                            console.log('push')
                        }
                        AsyncStorage.setItem('mySubscribe', JSON.stringify(arr))
                    } else {
                        if (arr.indexOf(id) > -1) {
                            arr.splice(arr.indexOf(id), 1)
                            console.log('splice')
                        }
                        AsyncStorage.setItem('mySubscribe', JSON.stringify(arr))
                    }
                    AsyncStorage.getItem('mySubscribe', (error, results) => {
                        console.log('123123123123123',JSON.parse(results))
                    })
                    console.log('22222222222')

                })

                this.toast(
                    item.subscribeStatus ? '关注成功' : '取消关注'
                )
                this.setState({
                    newsList: arr
                })
            }
        })
    }

    selectTab = (it, idx) => {
        navigationService.navigate('UserCenter', {currentTab: idx})
        console.log('UserCenter', idx)
    }
}

const styles = StyleSheet.create({
    mineStyle: {
        paddingTop: rpx(80),
        width: rpx(750),
        backgroundColor: '#fafcfd',
        flex: 1
    },
    myHeaderImg: {
        width: rpx(750),
        height: rpx(120),
        marginRight: rpx(30),
        flexDirection: 'row',
        alignItems: 'center'
    },
    nickName: {
        fontSize: rpx(32),
        fontWeight: 'bold',
        color: '#00070f'
    },
    tabList: {
        marginTop: rpx(50),
        width: rpx(690),
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    },
    tabItem: {
        width: rpx(330),
        padding: rpx(38),
        borderRadius: rpx(10),
        marginBottom: rpx(30),
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'white'
    }
})
