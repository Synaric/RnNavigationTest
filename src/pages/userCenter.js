import React from 'react'
import Base from '../components/base'
import {
    AsyncStorage,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Platform,
    ScrollView,
    FlatList,
    TextInput
} from 'react-native'
import ExtModal from '../components/modal'
import {common} from '../style/common'
import {rpx} from '../utils/adapter'
import navigationService from '../utils/navigationService'
import {wxLogin} from '../utils/third'
import PropTypes from 'prop-types'
import NavBar from '../components/navBar.android'
import CategoryItem from '../components/categoryItem'
import NewsItem from '../components/newsItem'
import ReplyAndThumbDialog from '../components/replyAndThumbDialog'
import Report from '../components/report'
import {thumbAndCommentAndBrowser, timePeriod} from '../utils/utils'

export default class Mine extends Base {
    resolveStatusBar () {
        return {
            barStyle: 'dark-content',
            backgroundColor: 'transparent',
            translucent: true
        }
    }

    created () {
        this.state = {
            currentTab: -1,
            pageNum: 1,
            pageNum_reply: 1,
            pageSize: 10,
            newsList: [],
            commentList: [],
            showReplyDialog: false,
            showThumbDialog: false,
            showReportDialog: false,
            replyItem: {},
            unReadReply: [],
            haveReadReply: [],
            canLoadMore: true,
            content: '',
            commentBox: false,
            commentType: 0,
            replyId: '',
            itemId: '',
            face: '',
            name: '',
            reportList: [],
            reportReplyItem: {}
        }
    }

    getPicList (list) {
        try {
            return JSON.parse(list).slice(0, 3)
        } catch (e) {
            return []
        }
    }

    mounted () {
        let params = this.getParams()
        this.getReportType()
        this.setState({currentTab: params.currentTab}, () => {
            this.refs.categoryItem.selectCate(params.currentTab)
            if (params.currentTab !== 1) {
                this.getDataByTab()
            } else {
                this.getMyComment()
            }
        }, () => {
        })
        console.log('currentTab', params.currentTab)
    }

    likeComment = (item) => {
        console.log('likeComment', item)
        let params = { replyId: item.replyId, authorId: item.userId }
        let isLike = item.Like[0].isLike
        let path = isLike ? 'unLike' : 'like'
        this.postApi(`/user/${path}`, params, res => {
            console.log(`/user/${path}=======`, params, res)
            if (res.errcode === 0) {
                let arr = item.type ? this.state.haveReadReply : this.state.unReadReply
                item.Like = [{ isLike: Number(!item.Like[0].isLike) }]
                arr.map(it => {
                    if (it.replyId == item.replyId) {
                        console.log('zzzzzzzzzzzzzzzz')
                        if (isLike) {
                            it.ReplyCount.likeCount = it.ReplyCount.likeCount - 1
                        } else {
                            it.ReplyCount.likeCount = it.ReplyCount.likeCount + 1
                        }
                    }
                })
                this.toast(
                    isLike ? '取消成功' : '点赞成功'
                )
                if (item.type) {
                    this.setState({
                        haveReadReply: arr
                    })
                } else {
                    this.setState({
                        unReadReply: arr
                    })
                }

            }
        })
    }

    showCommentBox = (item, type) => {
        console.log('我要点击 下方的评论资讯内容')
        console.log(item)
        // **
        // this.commentType   0 - 回复评论   1 - 点击详情下方的评论按钮  2 -   点击评论的评论
        // */
        // console.log('111111111111111', item)
        // console.log('22222', type)
       
        if (type === 3) {
            this.setState({
                commentItem: item,
                commentBox: !this.state.commentBox,
                commentText: type ? '评论' : '回复',
                commentType: type,
                itemId: item.itemId,
                replyId: item.replyId,
                name: item.User ? item.User.nickName : '匿名用户',
                face: item.User.face
            })
        }
    }

    issueContent = () => {
        let { content, itemId, replyId, commentText, commentType } = this.state
        if (!content) {
            this.toast('内容不为空')
            return
        }
        // let data = {
        //     content: content
        // }
        let data = {
            detail: content,
            itemId: itemId,
            replyId: replyId
        }
        this.postApi('/user/reply', data, (res) => {
            // console.log('replyreplyreplyreplyreplyreplyreply', res.data, commentText, commentType)
            if (res.errcode === 0) {
                this.toast('回复成功')
                this.setState({
                    
                }, () => {
                   if (commentType === 3 && commentText === '评论') {
                        res.data.Like = [{ isLike: 0 }]
                        res.data.hideComment = true
                        res.data.ReplyCount = {
                            replyCount: 0,
                            likeCount: 0
                        }
                        res.data.pUser = {
                            face: this.state.face,
                            nickName: this.state.name
                        }
                        res.data.User = {
                            // face: wx.getStorageSync('userInfo').face,
                            // nickName: wx.getStorageSync('userInfo').nickName
                        }
                        res.data.properties = JSON.parse(res.data.properties)
                        res.data.isBan = Number(res.data.isBan)
                        res.data.ItemReport = []
                        res.data.createTime = new Date().valueOf()
                        res.data.time = timePeriod(new Date())
                        let arr = this.state.haveReadReply
                        arr.unshift(res.data)
                        this.setState({
                            content: '',
                            commentBox: false,
                             haveReadReply: arr
                        })
                    }
                    // if (commentType == 2 || commentType == 3) {
                    //     let commentItem = this.state.commentItem
                    //     commentItem.ReplyCount.replyCount += 1
                    //     this.setState({
                    //         commentItem: commentItem
                    //     })
                    // }
                })
            }
        })
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
        // pic 问题
        return data.map(item => {
            if (item.itemTypeId !== 3) {
                return {
                    showItem: this.category_type === 2 ? 1 : 0,
                    itemId: item.itemId,
                    itemTypeId: item.itemTypeId,
                    itemName: item.itemName,
                    showType: item.properties.showType,
                    pic: item.properties.pic.startsWith('https') ? item.properties.pic : (item.properties.pic ? URL + '/' + item.properties.pic : JSON.parse(item.properties.picList)[0]),
                    link: item.properties.link ? URL + '/' + item.properties.link : '',
                    picList: this.getPicList(item.properties.picList),
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
            } else {
                return {
                    itemId: item.itemId,
                    itemTypeId: item.itemTypeId,
                    itemName: item.itemName,
                    properties: item.properties,
                    Like: item.Like,
                    UserInfo: item.UserInfo
                }
            }
        })
    }

    getDataByTab () {
        let tab = this.state.currentTab
        let {pageNum, canLoadMore, newsList, pageSize} = this.state
        console.log('getDataByTab=========================', tab, canLoadMore)
        if (!canLoadMore) {
            return
        }
        let params = {
            start: (pageNum - 1) * 10,
            length: pageSize
        }
        let path = ''
        switch (tab) {
            case 0:
                path = 'getCollect'
                break
            case 2:
                path = 'getMyLike'
                break
            case 3:
                path = 'getHistory'
                break
            case 4:
                path = 'getFollow'
                break
            case 5:
                path = 'getFollowMe'
                break
            default:
        }
        this.getApi(`/user/${path}`, params, res => {
            console.log(`/user/${path}`, params, res)
            if (res.errcode === 0) {
                let results = res.data.rows ? res.data.rows : []
                console.log('results.length', results.length)
                if (tab === 0 || tab === 2 || tab === 3) {
                    results = results && results.filter(item => {
                        return item.itemTypeId === 1 || item.itemTypeId === 2  || item.itemTypeId === 3
                    })
                    // results.length && results.forEach(item => {
                    //     item.subscribeStatus = wx.getStorageSync('mySubscribe').indexOf(item.UserInfo.User.userId) === -1 ? 0 : 1
                    // })
                    console.log('results.length', results.length)
                    results = this.reductionData(results)
                } else if (tab === 4) {
                    // results.length && results.forEach(item => {
                    //     item.subscribeStatus = 1
                    // })
                } else if (tab === 5) {
                    // results.length && results.forEach(item => {
                    //     item.subscribeStatus = wx.getStorageSync('mySubscribe').indexOf(item.User.userId) === -1 ? 0 : 1
                    // })
                } else {
                }
                if (pageNum === 1) {
                    this.setState({newsList: []}, () => {
                        this.setState({newsList: results})
                    })
                } else {
                    this.setState({newsList: newsList.concat(results)})
                }
                this.setState({canLoadMore: results && results.length >= pageSize, pageNum: pageNum + 1})
                console.log('getMyDataByType', this.state.newsList)
            }
        })
    }

    getMyComment () {
        let {pageNum, canLoadMore, commentList, pageSize} = this.state
        console.log('getMyComment=========================', canLoadMore)
        if (!canLoadMore) {
            return
        }
        let params = {
            start: (pageNum - 1) * 10,
            length: pageSize
        }
        console.log('getMyReply', params)
        this.getApi('/user/getMyReply', params, res => {
            console.log(res)
            if (res.errcode === 0) {
                let results = res.data.rows ? res.data.rows : []
                results.map(item => {
                    // 现在的时间戳
                    // 过去的时间戳
                    // 差值
                    item.time = timePeriod(item.createTime)
                })
                if (pageNum === 1) {
                    this.setState({commentList: []}, () => {
                        this.setState({commentList: results})
                    })
                } else {
                    this.setState({
                        commentList: commentList.concat(results)
                    })
                }
                this.setState({
                    canLoadMore: results && results.length >= 10,
                    pageNum: pageNum + 1
                })
                console.log('commentList', this.state.commentList)
            }
        })
    }


    renderCollectAndThumbAndHistory () {
        let {newsList, canLoadMore} = this.state
        let {navigation} = this.props
        return (
            <View style={{flex: 1}}>
                {
                    newsList && newsList.length ? 
                <NewsItem  newsList={newsList} canLoadMore={canLoadMore} loadMore={this.getDataByTab.bind(this)} navigation={navigation}></NewsItem>
            : <Text style={styles.loadingTips}>加载中</Text>}
                </View>    
        )
    }

    skipToNewsDetail = (item) => {
        console.log('skipToNewsDetail', item)
        let path = item.ItemInfo.itemTypeId === 1 ? 'NewsDetail' : 'VideoDetail'
        this.props.navigation.push(path, {itemId: item.itemId})
    }

    renderCommentItem (item, index) {
        return (
            <View style={{backgroundColor: 'white', borderRadius: rpx(20), marginBottom: rpx(20)}} key={index}>
                <View style={{
                    paddingTop: rpx(27),
                    paddingHorizontal: rpx(30),
                    paddingBottom: rpx(31),
                    borderBottomWidth: rpx(2),
                    borderStyle: 'solid',
                    borderBottomColor: '#f3f6fa'
                }}>
                    <Text
                        style={styles.commentContent}>
                        {item.properties.detail}
                    </Text>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: rpx(30),
                        marginBottom: rpx(35)
                    }}>
                        <Text style={common.newsDesc}>{item.time}</Text>
                        <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => {
                            this.openReportDialog(item)
                        }}>
                            <Text style={common.newsDesc}>举报</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                        <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => {
                            this.openReplyDialog(item)
                        }}>
                            <Image style={[common.icon1, {marginTop: rpx(0)}]}
                                   source={require('../imgs/comment-icon.png')}/><Text>&nbsp;&nbsp;回复{item.ReplyCount.replyCount}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => {
                            this.openThumbDialog()
                        }}>
                            <Image style={common.icon1}
                                   source={require('../imgs/no-thumb.png')}/><Text>&nbsp;&nbsp;点赞{item.ReplyCount.likeCount}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{padding: rpx(30)}}>
                    <TouchableOpacity onPress={() => {this.skipToNewsDetail(item)}}>
                    <Text style={{color: '#00070f', fontSize: rpx(28), lineHeight: rpx(40)}}><Text
                        style={{color: 'red'}}></Text>{item.ItemInfo.itemName}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    _renderFooter () {
        let {canLoadMore, commentList} = this.state
        return (
            <View>
                {
                    commentList && commentList.length ?   <Text style={common.listTips}>
                    {canLoadMore ? '正在加载中...' : '我是有底线的'}
                    </Text> : null
                }
            </View>
        )
    }

    renderCommentList () {
        let {commentList} = this.state
        return (
            <View style={{flex: 1}}>
            {
                commentList && commentList.length ? 
            
            <FlatList style={{width: rpx(690), marginHorizontal: rpx(30)}}
                      showsVerticalScrollIndicator={false}
                      data={commentList}
                      renderItem={({item, index}) => (
                          this.renderCommentItem(item, index)
                      )}
                      ListFooterComponent = {this._renderFooter.bind(this)}//渲染底部组件
                      onEndReached={() => {
                          this.getMyComment()
                      }}
                      onEndReachedThreshold={0.2}>
            </FlatList>
        : <Text style={styles.loadingTips}>加载中</Text>}
        </View>
        )
    }

    renderSubScribeAndFans () {
        let {currentTab} = this.state
        let list = [
            {

                'userId': 66,
                'face': 'https://wx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEJlw0SPxibPMLbaaq6IIs6icrc5JGcrvpBO248zKm0oZ441tanLNTnGVJb7KCGicRuVKuaF4hkyglzZg/132',
                'nickName': '步页',
                'intro': '大家好，我是步页',
                'Role': {
                    'roleName': '个人认证',
                    'pic': 'https://weixinfactory.di1game.com/Icon/202014/12855402-d014-415e-94b2-b6c9eb54f65b.jpg'
                },
                'School': null

            },
            {

                'userId': 66,
                'face': 'https://wx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEJlw0SPxibPMLbaaq6IIs6icrc5JGcrvpBO248zKm0oZ441tanLNTnGVJb7KCGicRuVKuaF4hkyglzZg/132',
                'nickName': '步页',
                'intro': '光明教育家的介，做多两行最多两行最多两行最多两行最多两行最多两行最多两两行...',
                'Role': {
                    'roleName': '个人认证',
                    'pic': 'https://weixinfactory.di1game.com/Icon/202014/12855402-d014-415e-94b2-b6c9eb54f65b.jpg'
                },
                'School': null

            }
        ]

        return (
            <ScrollView>
                <View>
                    {
                        list && list.map((item, index) => (
                            <View style={styles.subscribeBlock}>
                                <View style={styles.edFace}>
                                    <TouchableOpacity onPress={() => {
                                        // this.skipToEdIntroduce()
                                    }}>
                                        <Image style={{
                                            width: rpx(80),
                                            height: rpx(80),
                                            borderRadius: rpx(40)
                                        }} source={{uri: item.face}}/>
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.edDetails, {marginTop: currentTab == 5 ? rpx(0) : rpx(10)}]}>
                                    <Text style={styles.edName}>{item.nickName}</Text>
                                    {
                                        currentTab == 5 ? null :
                                            <Text numberOfLines={2} style={styles.edIntrod}>{item.intro}</Text>

                                    }
                                </View>
                                <View
                                    style={[common.haveSubscribe, {
                                        width: rpx(134),
                                        height: rpx(54),
                                        borderRadius: rpx(28),
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginLeft: 'auto',
                                        fontSize: rpx(24),
                                        letterSpacing: rpx(3)
                                    }]
                                    }>
                                    <Text>关注</Text>
                                </View>
                            </View>
                        ))
                    }
                </View>
            </ScrollView>
        )
    }

    getReportType () {
        this.getApi('/item/getReportType', {}, res => {
          if (res.errcode === 0) {
            this.setState({
              reportList: res.data
            })
          }
        })
      }

    render () {
        let {reportList, commentBox, name, content, commentText, currentTab, showReplyDialog, showThumbDialog, showReportDialog, unReadReply, haveReadReply} = this.state
        let categoryList = [
            {ItemCategory: {categoryName: '收藏'}},
            {ItemCategory: {categoryName: '评论'}},
            {ItemCategory: {categoryName: '点赞'}},
            {ItemCategory: {categoryName: '浏览历史'}},
            // {ItemCategory: {categoryName: '关注'}},
            // {ItemCategory: {categoryName: '粉丝'}}
        ]
        return (
            <View style={styles.userCenterStyle}>
                <NavBar inputSearch={false} title={'我的'} backgroundType={false} leftBtn={false} fullScreen={true}/>
                <CategoryItem ref={'categoryItem'} categoryList={categoryList} selectCate={this.selectCate.bind(this)}/>
                {
                    (currentTab == 0 || currentTab == 2 || currentTab == 3) && this.renderCollectAndThumbAndHistory()
                }
                {
                    currentTab == 1 && this.renderCommentList()
                }
                {
                    (currentTab == 4 || currentTab == 5) && this.renderSubScribeAndFans()
                }

                {
                    currentTab == 1 && <ReplyAndThumbDialog
                        showCommentBox={(e) => {this.showCommentBox(e, 3)}}
                        likeComment={this.likeComment.bind(this)}
                        unReadReply={unReadReply}
                        haveReadReply={haveReadReply}
                        openReportDialog={this.openReportDialog.bind(this)}
                        visible={showReplyDialog}
                        type={0}
                        onDismiss={() => {
                            this.setState({showReplyDialog: false})
                        }}>
                    </ReplyAndThumbDialog>
                }

                {
                    currentTab == 1 && <ReplyAndThumbDialog
                        visible={showThumbDialog}
                        type={1}
                        onDismiss={() => {
                            this.setState({showThumbDialog: false})
                        }}>
                    </ReplyAndThumbDialog>
                }

            <ExtModal animationType="fade" zIndex={9999999} fullScreen={true} visible={showReportDialog}
                  onDismiss={() => {
                    this.setState({showReportDialog: false})
                  }}>
          <View style={common.reportStyle}>
            <View style={{borderRadius: rpx(10), backgroundColor: 'white'}}>
              {
                reportList && reportList.map((it, index) => (
                  <TouchableOpacity
                    onPress={() => {
                      this.reportDetails(it)
                    }}
                    style={{
                      paddingVertical: rpx(30),
                      borderBottomColor: '#cdd3dc',
                      borderBottomWidth: rpx(1),
                      borderStyle: 'solid'
                    }}>
                    <Text style={{textAlign: 'center', fontSize: rpx(28), color: '#4f5661'}}>{it.reportName}</Text>
                  </TouchableOpacity>
                ))
              }
            </View>
            <TouchableOpacity activeOpacity={1} onPress={() => {
              this.setState({showReportDialog: false})
            }}
                              style={{
                                borderRadius: rpx(10),
                                backgroundColor: 'white',
                                paddingVertical: rpx(30),
                                marginVertical: rpx(20)
                              }}>
              <Text style={{textAlign: 'center', fontSize: rpx(28), color: '#4f5661'}}>取消</Text>
            </TouchableOpacity>
          </View>
        </ExtModal>

                {/* {
                    currentTab == 1 && <Report visible={showReportDialog}
                                               onDismiss={() => {
                                                   this.setState({showReportDialog: false})
                                               }}>>

                    </Report>
                } */}

                <ExtModal animationType="fade" zIndex={9999999} fullScreen={true} visible={commentBox}
                    onDismiss={() => {
                        this.setState({ commentBox: false })
                    }} style={{ bottom: rpx(500), backgroundColor: 'red' }}>
                    <View style={{ flex: 1, position: 'absolute', bottom: rpx(500), flexDirection: 'row' }}>
                        <View style={{ backgroundColor: 'white', width: rpx(750), padding: rpx(20) }}>
                            <Text style={{ fontSize: rpx(20), marginBottom: rpx(10) }}>
                                正在 &nbsp;<Text style={{ fontWeight: 'bold' }}>{commentText}</Text>&nbsp;
                                {name}
                            </Text>
                            {/* <KeyboardAvoidingView
                                behavior='position'
                                contentContainerStyle={{ width: rpx(750), height: rpx(98) }}> */}
                                <TextInput
                                    autoFocus={true}
                                    multiline={true}
                                    onChangeText={(text) => this.setState({ content: text })}
                                    value={content}
                                    style={{
                                        flex: 1, backgroundColor: 'red', height: rpx(140), fontSize: rpx(26)
                                    }}

                                />
                            {/* </KeyboardAvoidingView> */}
                            <TouchableOpacity onPress={() => {
                                this.issueContent()
                            }}>
                                <Text style={{ marginLeft: 'auto', color: content ? '#d8201d' : '#4f5664' }}>发布</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ExtModal>

            </View>
        )
    }

    selectCate (idx) {
        this.setState({
            currentTab: idx,
            pageNum: 1,
            canLoadMore: true,
            newsList: [],
            commentList: []
        }, () => {
            if (idx === 1) {
                this.getMyComment()
                return
            }
            this.getDataByTab()
        })
    }

    openReplyDialog = (item) => {
        let {pageNum_reply, pageSize} = this.state
        this.setState({
            pageNum_reply: 1,
            replyItem: item,
            unReadReply: [],
            haveReadReply: [],
            canLoadMore: true,
            showReplyDialog: true
        }, () => {
            // this.unReadReply
            this.getApi('/item/getUnReadReply', {replyId: item.replyId}, res => {
                console.log('/item/getUnReadReply', res.data.rows)
                if (res.errcode === 0) {
                    let results = res.data.rows
                    results.map(item => {
                        if (!item.Like.length) {
                            item.Like.push({isLike: 0})
                        }
                        item.hideComment = true
                        item.time = timePeriod(item.createTime)
                    })
                    this.setState({
                        unReadReply: results
                      }, () => {
                          this.getReadReply(pageNum_reply, pageSize, [])
                        console.log('/item/getReadReply1111', this.state.unReadReply)}
                    )
                }
            })
        })
    }

    getReadReply (pageNum, pageSize, list) {
        let {canLoadMore, replyItem} = this.state
        if (!canLoadMore) {
            return
        }
        this.getApi('/item/getReadReply', {replyId: replyItem.replyId}, res => {
            console.log('/item/getReadReply', res.data.rows)
            if (res.errcode === 0) {
              let results = res.data.rows
              results.map(item => {
                if (!item.Like.length) {
                  item.Like.push({isLike: 0})
                }
                item.hideComment = true
                item.time = timePeriod(new Date(item.createTime))
              })
              if (pageNum === 1) {
                this.setState({
                    haveReadReply: results
                  })
              } else {
                this.setState({
                    haveReadReply: list.concat(results)
                  })
              }
              this.setState({
                canLoadMore: results && results.length >= pageSize,
                pageNum_reply: pageNum + 1
              })
            }
          })
    }

    openThumbDialog = () => {
        this.setState({
            showThumbDialog: true
        })
    }

    openReportDialog = (item) => {
        this.setState({
            showReportDialog: true,
            reportReplyItem: item
        })
    }

    reportDetails (it) {
        let replyItem = this.state.reportReplyItem
        let params = {
          itemId: replyItem.itemId,
          reportType: it.reportTypeId,
          replyId: replyItem.replyId
        }
        console.log('reportDetails', params)
        this.postApi('/user/reportItem', params, res => {
          console.log('举报成功', res)
          if (res.errcode === 0) {
            let arr = replyItem.type === 'reply-reply' ? this.state.latestComment : this.state.commentList
            let index = arr.findIndex(el => {
              return el.replyId === replyItem.replyId
            })
            if (index !== -1) {
              arr.splice(index, 1)
              if (replyItem.type === 'reply-reply') {
                this.state.commentDetailItem.ReplyCount.replyCount = this.state.commentDetailItem.ReplyCount.replyCount - 1
                this.setState({
                  commentDetailItem: this.state.commentDetailItem
                })
              }
              this.setState({
                replyDetailDialog: replyItem.type === 'reply-reply',
                showReportDialog: false
              })
            }
            this.toast('举报成功')
          }
        })
        // console.log('222', this.state.reportList, it, this.state.reportReplyItem)
      }
}

const styles = StyleSheet.create({
    userCenterStyle: {
        width: rpx(750),
        backgroundColor: '#fafcfd',
        flex: 1,
    },
    commentContent: {
        fontSize: rpx(26),
        lineHeight: rpx(44),
        color: '#4f5661'
    },
    subscribeBlock: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: rpx(25),
        alignItems: 'center',
        padding: rpx(30),
        marginHorizontal: rpx(30),
        backgroundColor: '#ffffff',
        borderRadius: rpx(20),
    },
    edFace: {
        width: rpx(80),
        height: rpx(80),
        marginRight: rpx(15)
    },
    edDetails: {
        width: rpx(374),
        flex: 1,
        flexDirection: 'column'
    },
    edName: {
        fontSize: rpx(26),
        fontWeight: 'bold',
        color: '#313332',
    },
    edIntrod: {
        fontSize: rpx(20),
        color: '#787878',
        lineHeight: rpx(30),
    },
    loadingTips: {
        color: '#000',
        fontSize: rpx(26),
        textAlign: 'center'
    }
})
