import React from 'react'
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  TextInput,
  Dimensions,
  FlatList,
  Keyboard,
  KeyboardAvoidingView
} from 'react-native'
import {height, isIphoneX, rpx, statusBarHeight, titleHeight, width, deviceHeight} from '../utils/adapter'
import Base from '../components/base'
import {common} from '../style/common'
import Player from './../components/playerV2'
// import HTML from 'react-native-render-html'
import HTMLView from 'react-native-htmlview'
import NavBar from '../components/navBar.android'
import NewsItem from '../components/newsItem'
import CommentItem from '../components/commentItem'
import Report from '../components/report'
import {thumbAndCommentAndBrowser, timePeriod, formatDate, URL} from '../utils/utils'
import ReplyDetail from '../components/replyDetail'
import AutoSizedImage from '../components/AutoSizedImage'
import ExtModal from '../components/modal'
// import HtmlView from '../components/htmlView'
import {post} from '../request/API'
import PullView from 'react-native-pull/PullView'


export default class VideoDetail extends Base {
  resolveStatusBar () {
    return {
      barStyle: 'dark-content',
      backgroundColor: 'transparent',
      translucent: true
    }
  }


  created () {
    this.state = {
      height1: 0,
      tabType: 0,
      topReply: [],
      otherReply: [],
      commentList: [],
      showReportDialog: false,
      replyId: '',
      itemId: '',
      face: '',
      content: '',
      name: '',
      pageNum: 1,
      pageNum_reply_detail: 1,
      pageSize: 10,
      itemCategoryId: '',
      canLoadMore: true,
      canLoadMore_reply_detail: true,
      dialogShow: false,
      commentBox: false,
      replyDetailDialog: false,
      newsList: [],
      latestComment: [],
      commentDetail: [],
      commentDetailItem: {},
      newsInfo: {
        properties: {},
        Like: [{isLike: 0}],
        Collect: [{isCollect: 0}]
      },
      commentItem: {},
      commentText: '',
      commentType: 1,
      isSharedPage: false,
      startTime: new Date().valueOf(),
      endTime: 0,
      showCommentDialog: false,
      hasNewsList: false,
      hasCommentList: false,
      videoPic: '',
      videoLink: '',
      videoList: [],
      canShowCover: false,
      queryParams: {},
      reportList: [],
      reportReplyItem: {},
      textInputHeight: 0,
      shadowZIndex: 0,
    }
  }

  mounted () {
    console.log(' ========================= mounted =======================')
    let params = this.getParams()
    this.state.queryParams = params
    this.getNewsDetail(params)
    // this.getRecommendItem(params)
    this.getNewsCommentList()
    this.getReportType()
  }

  getNewsDetail(data) {
    let params = {
        itemId: data.itemId,
        itemCategoryId: data.itemCategoryId
    }
    this.getApi('/item/getItem', params, res => {
        if (res.errcode === 0) {
            let results = res.data
            console.log('this.newsInfo ================', params, results)
            results.time = timePeriod(results.createTime)
            if (!results.Like.length) {
                results.Like.push({isLike: 0})
            }
            if (!results.Collect.length) {
                results.Collect.push({isCollect: 0})
            }
            if (!results.ItemCount) {
                results.ItemCount = {
                    collectCount: 0,
                    likeCount: 0,
                    replyCount: 0,
                    viewCount: 0,
                    shareCount: 0
                }
            }
            this.setState({
                newsInfo: results
            })
        }
    })
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

  getRecommendItem (data) {
    let params = {
      itemId: data.itemId
    }
    this.getApi('/item/getRelateItem', params, res => {
      console.log('getRelateItemgetRelateItemgetRelateItemgetRelateItemgetRelateItem', res)
      if (res.errcode === 0) {
        let results = this.formateData(res.data.filter(item => {
          return item.itemTypeId === 1
        }))
        // console.log('getRelateItem----------------------------------', results)
        this.setState({
          newsList: results.length >= 3 ? results.slice(0, 3) : results,
          hasNewsList: results.length
        })
        console.log('getRelateItem111----------------------------------', this.state.newsList)
      }
    })
  }

  getNewsCommentList () {
    let {pageNum, pageSize, queryParams} = this.state
    let params = {
      itemId: queryParams.itemId
    }
    console.log('/item/getItemTopReply', params)
    this.getApi('/item/getItemTopReply', params, res => {
      if (res.errcode !== 0) {
        return ([])
      } else {
        let results = res.data.rows
        res.data.rows.map(item => {
          item.ChildReply && item.ChildReply.length && item.ChildReply.map(el => {
            el.properties = JSON.parse(el.properties)
          })
          item.time = timePeriod(item.createTime)
        })
        // this.setState({
        //     commentList: results,

        // }, () => {
        //     console.log('getItemTopReply', pageNum, pageSize, results.length)
        //     this.getItemOtherReply(pageNum, pageSize, results)
        // })
        console.log('getItemTopReply', pageNum, pageSize, results.length)
        this.getItemOtherReply(pageNum, pageSize, results)
      }
    })
  }

  getItemOtherReply (pageNum, pageSize, commentList) {
      console.log('getItemOtherReplygetItemOtherReply canLoad1', this.state.pageNum)
    if (!this.state.canLoadMore) {
      return
    }
    let {queryParams} = this.state
    let params = {
      itemId: queryParams.itemId,
      start: (pageNum - 1) * 10,
      length: pageSize
    }
    console.log('/item/getItemOtherReply', params)
    this.getApi('/item/getItemOtherReply', params, ret => {
      let arr = ret.data.rows
      let results = commentList.concat(arr)
      console.log('/item/getItemOtherReply11', results.length)
      results.map(item => {
        if (item.Like && item.Like.length === 0) {
          item.Like.push({
            isLike: 0
          })
        }
        item.time = timePeriod(item.createTime)
      })
      this.setState({
        commentList: results,
        hasCommentList: results.length,
        canLoadMore: arr && arr.length >= 10,
        pageNum: pageNum + 1
      }, () => {
        console.log('getItemOtherReplygetItemOtherReply canLoad2', this.state.pageNum)
        // console.log('this.state.commentList', this.state.commentList.length, this.state.commentList)
      })
    })
  }

  shareNewsDetail () {
    sendPostRequest('/user/share', {itemId: this.itemId}, res => {
      // console.log('share', res)
      if (res.errcode === 0) {
        this.newsInfo.ItemCount.shareCount += 1
        console.log('分享成功')
      }
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

  _renderNode (node, index, siblings, parent, defaultRenderer) {
    let name = node.name
    console.log('===========')
    console.log(node)
    if (name == 'div') {
      return (
        <View key={index} style={{lineHeight: rpx(50)}}>
          {defaultRenderer(node.children, parent)}
        </View>
      )
    } else if (name == 'p' || name == 'span') {
      return (
        <Text key={index}>
          {defaultRenderer(node.children, parent)}
        </Text>
      )
    } else if (name == 'img') {
      return (
        <AutoSizedImage
          key={index}
          source={{uri: node.attribs.src}}
          style={{width: rpx(690), height: 0}}>
        </AutoSizedImage>
      )
    } else if (name == 'br') {
      return (<View style={{height: rpx(15)}}></View>)
    }
  }


  _renderHeader () {
    let {height1, hasCommentList, hasNewsList, commentDetailItem, showReportDialog, replyDetailDialog, newsInfo, newsList, commentList, latestComment, commentBox, commentText, name, content} = this.state
    return (
      <View>
        <View style={styles.newsDetailStyle}>
            <View style={{width: rpx(690), marginHorizontal: rpx(30), paddingTop: rpx(20)}}>
                <Text style={styles.newsTitle}>{newsInfo.itemName}</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: rpx(20)}}>
                    <Text
                        style={common.newsDesc}>浏览{newsInfo.ItemCount ? newsInfo.ItemCount.viewCount : 0}次</Text>
                    <Text
                        style={common.newsDesc}>{newsInfo.properties ? newsInfo.properties.author : ''} {newsInfo.time}</Text>
                </View>
                <Image style={{width: rpx(690), height: rpx(426)}}
                    source={{uri: newsInfo.properties ? newsInfo.properties.pic : ''}}/>
                <View style={{width: rpx(690), marginHorizontal: rpx(30), paddingTop: rpx(20)}}>
                {/* {newsInfo.properties.content != undefined ?
                <HTMLView value={newsInfo.properties.content}
                          textComponentProps={{
                            style: {
                              lineHeight: rpx(30)
                            }
                          }}
                          renderNode={this._renderNode}/> : null
              } */}
                </View>
                {
                    hasNewsList ? <Text style={common.recommendTitle}>精彩推荐</Text> : null
                }
                {
                hasCommentList ?
                    <Text style={[common.recommendTitle, {marginTop: rpx(30)}]}>
                    全部评论
                    </Text> : null
                }
                            
            </View>
        </View>
      </View>
    )
  }

 

  renderCommentItem (item, index) {
    return (
      <CommentItem
        it={item}
        likeComment={this.likeComment.bind(this)}
        openReportDialog={this.openReportDialog.bind(this)}
        showCommentBox={(e) => {
          this.showCommentBox(e, 0)
        }}
        showCommentDetail={this.showCommentDetail.bind(this)}></CommentItem>
    )
  }

  _renderFooter () {
    let {canLoadMore, commentList} = this.state
    return (
      <View>
        {
          commentList && commentList.length ? <Text style={common.listTips}>
            {canLoadMore ? '正在加载中...' : '我是有底线的'}
          </Text> : null
        }
      </View>
    )
  }

    _onContentSizeChange(event) {
        this.setState({
            textInputHeight: event.nativeEvent.contentSize.textInputHeight
        });
    }

  render () {
    let {canLoadMore_reply_detail, reportList, pageNum, pageSize, hasCommentList, hasNewsList, commentDetailItem, showReportDialog, replyDetailDialog, newsInfo, newsList, commentList, latestComment, commentBox, commentText, name, content, shadowZIndex} = this.state
    let {onDismiss, navigation} = this.props
    return (
      <View style={styles.newsDetailStyle}>
        <NavBar backgroundType={false} leftBtn={false} fullScreen={true} showLogo={false}/>
        <FlatList
          contentContainerStyle={{justifyContent: 'center'}}
          showsVerticalScrollIndicator={false}
          data={commentList}
          keyExtractor={(item, index) => '' + index}
          ListHeaderComponent={this._renderHeader.bind(this)}//渲染头部组件
          ListFooterComponent={this._renderFooter.bind(this)}//渲染底部组件
          renderItem={({item, index}) => (
            this.renderCommentItem(item, index)
          )}
          onEndReached={() => {
            this.getItemOtherReply(pageNum, pageSize, commentList)
          }}
          onEndReachedThreshold={0.3}
        >
        </FlatList>
        <View style={[styles.bottomCommentBar, {zIndex: shadowZIndex}]}>
              {
                  commentBox ?  
                  <Text style={{fontSize: rpx(20), marginBottom: rpx(10)}}>
                  正在 &nbsp;<Text style={{fontWeight: 'bold'}}>{commentText}</Text>&nbsp;
                  {name}
                </Text>  : null
              }
            <View style={{flex: 1, flexDirection: 'row',  alignItems: 'center', justifyContent: 'center'}}>
            <TextInput 
                ref={'reply'}
                onTouchStart={()=> {
                    if (this.state.commentType) {
                        this.showCommentBox(null, 1)
                    }
                }} 
                pointerEvents="none"
                placeholder={'说点什么吧'}
                textAlignVertical={'top'}
                padding={0}
                multiline={true} 
                value={content}
                onBlur={() => {
                }}
                onChangeText={(text) => this.setState({content: text})}
                onContentSizeChange={this.onContentSizeChange}
            style={[styles.text1, {width: commentBox ? rpx(590) : rpx(390), height: Math.max(35, this.state.textInputHeight)}]}></TextInput>
          {
              commentBox ? 
               <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center'}} onPress={() => {
                this.issueContent()
              }}>
                <Text style={{color: content ? '#d8201d' : '#4f5664', fontSize: rpx(28)}}>发布</Text>
              </TouchableOpacity> :
          
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
            <TouchableOpacity>
              <Image style={styles.icon2}
                     source={require('../imgs/share-icon.png')}></Image>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              this.collectNews()
            }}>
              <Image style={[styles.icon2, {width: rpx(44), height: rpx(44)}]}
                     source={newsInfo.Collect[0].isCollect ? require('../imgs/have-collect.png') : require('../imgs/no-collect.png')}></Image>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              this.likeNews()
            }}>
              <Image style={styles.icon2}
                     source={newsInfo.Like[0].isLike ? require('../imgs/have-thumb.png') : require('../imgs/no-thumb.png')}></Image>
            </TouchableOpacity>
          </View>
          }
        </View>
        </View>

       
        <ReplyDetail 
                    visible={replyDetailDialog}
                     showCommentBox={(e) => {
                       this.showCommentBox(e, 0)
                     }}
                     canLoadMore={canLoadMore_reply_detail}
                     isVideoDetail={false}
                     commentDetailItem={commentDetailItem}
                     latestComment={latestComment}
                     getCommentOtherReply={this.getCommentOtherReply.bind(this)}
                     likeComment={this.likeComment.bind(this)}
                     openReportDialog={this.openReportDialog.bind(this)}
                     onDismiss={() => {
                       this.setState({replyDetailDialog: false})
                     }}>
        </ReplyDetail>

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


        <ExtModal animationType="fade" zIndex={shadowZIndex - 1} fullScreen={true} visible={commentBox}
                  onDismiss={() => {
                    this.setState({commentBox: false, commentType: 1, shadowZIndex: 999}, () => {
                        Keyboard.dismiss()
                    })
                  }}>
          {/* <View style={{flex: 1, flexDirection: 'row-reverse', position: 'absolute', flexDirection: 'row'}}>
            <View style={{backgroundColor: 'white', width: rpx(750), padding: rpx(20)}}> */}
                {/* <Text>123123</Text> */}
              {/* <Text style={{fontSize: rpx(20), marginBottom: rpx(10)}}>
                正在 &nbsp;<Text style={{fontWeight: 'bold'}}>{commentText}</Text>&nbsp;
                {name}
              </Text> */}
              {/* <KeyboardAvoidingView
                                behavior='position'
                                contentContainerStyle={{ width: rpx(750), height: rpx(98) }}> */}
              {/* <TextInput
                autoFocus={true}
                multiline={true}
                onChangeText={(text) => this.setState({content: text})}
                value={content}
                style={{
                  flex: 1, backgroundColor: 'red', height: rpx(140), fontSize: rpx(26)
                }}

              /> */}
              {/* </KeyboardAvoidingView> */}
              {/* <TouchableOpacity onPress={() => {
                this.issueContent()
              }}>
                <Text style={{marginLeft: 'auto', color: content ? '#d8201d' : '#4f5664'}}>发布</Text>
              </TouchableOpacity> */}
            {/* </View>
          </View> */}
        </ExtModal>
        <View style={{width: rpx(750), height: rpx(100)}}></View>
      </View>
    )
  }

  issueContent = () => {
    let {content, itemId, replyId, commentText, commentType} = this.state
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
        this.toast(
          commentText ? '评论成功' : '回复成功'
        )
        // @param commentType 1 详情下方评论
        this.setState({
          content: '',
          commentBox: false
        }, () => {
          if (commentType === 1 && commentText === '评论') {
            res.data.Like = [{isLike: 0}]
            res.data.ReplyCount = {
              replyCount: 0,
              likeCount: 0
            }
            res.data.User = {
              face: 'http://v1.qzone.cc/avatar/201407/07/00/24/53b9782c444ca987.jpg!200x200.jpg',
              nickName: '123123123'
            }
            res.data.isBan = Number(res.data.isBan)
            res.data.properties = JSON.parse(res.data.properties)
            res.data.ItemReport = []
            res.data.createTime = new Date().valueOf()
            res.data.time = timePeriod(new Date())
            // console.log('asdasdasdasdasdasdasdasdasd1111', this.state.commentList)
            let arr = this.state.commentList
            arr.push(res.data)
            this.setState({
              commentList: arr
            }, () => {
              // console.log('asdasdasdasdasdasdasdasdasd222222', this.state.commentList)
              // let newsInfo = this.state.newsInfo
              // newsInfo.ItemCount.replyCount += 1
              // this.setState({
              //     newsInfo: newsInfo
              // })
              // console.log('asdasdasdasdasdasdasdasdasd', this.state.commentList)
            })
            // console.log(this.latestComment)
          } else if (commentType === 3 && commentText === '评论') {
            res.data.Like = [{isLike: 0}]
            res.data.ReplyCount = {
              replyCount: 0,
              likeCount: 0
            }
            res.data.pUser = {
              face: this.face,
              nickName: this.name
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
            let arr = this.state.latestComment
            arr.unshift(res.data)
            this.setState({
              latestComment: arr
            }, () => {
              // console.log('latestCommentlatestCommentlatestCommentlatestCommentlatestComment', this.state.latestComment)

            })
          }
          if (commentType == 2 || commentType == 3) {
            let commentItem = this.state.commentItem
            commentItem.ReplyCount.replyCount += 1
            this.setState({
                shadowZIndex: 999,
              commentItem: commentItem
            })
          }
            this.refs.reply.blur()

        })

      }
    })
  }

  likeNews = () => {
    // if (wx.getStorageSync('userInfo').nickName === '匿名用户') {
    //     wx.navigateTo({url: '/pages/loginView/main?userType=0'})
    //     return
    // }
    let item = this.state.newsInfo
    let params = {itemId: item.itemId, authorId: item.UserInfo.distinctId}
    let isLike = item.Like[0].isLike
    let path = isLike ? 'unLike' : 'like'
    this.postApi(`/user/${path}`, params, res => {
      // console.log(res)
      if (res.errcode === 0) {
        item.Like = [{isLike: Number(!item.Like[0].isLike)}]
        if (isLike) {
          item.ItemCount.likeCount = item.ItemCount.likeCount - 1
        } else {
          item.ItemCount.likeCount = item.ItemCount.likeCount + 1
        }
        this.toast(
          isLike ? '取消成功' : '点赞成功'
        )
        this.setState({
          newsInfo: item
        })
      }
    })
  }

  likeComment = (item) => {
    // console.log('likeComment', item)
    let params = {replyId: item.replyId, authorId: item.userId}
    let isLike = item.Like[0].isLike
    let path = isLike ? 'unLike' : 'like'
    post(this, `/user/${path}`, params, res => {
      // console.log(res)
      if (res.errcode === 0) {
        let arr = item.type ? this.state.latestComment : this.state.commentList
        item.Like = [{isLike: Number(!item.Like[0].isLike)}]
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
            latestComment: arr
          })
        } else {
          this.setState({
            commentList: arr
          })
        }

      }
    })
    // console.log('likeComment1111111', item)
    // console.log('========================================================', this.state.commentList)
  }

  collectNews = () => {
    // if (wx.getStorageSync('userInfo').nickName === '匿名用户') {
    //     wx.navigateTo({url: '/pages/loginView/main?userType=0'})
    //     return
    // }
    let item = this.state.newsInfo
    let isCollect = item.Collect[0].isCollect
    let path = item.Collect[0].isCollect ? 'unCollect' : 'collect'
    this.postApi(`/user/${path}`, {itemId: item.itemId}, res => {
      if (res.errcode === 0) {
        item.Collect = [{isCollect: !item.Collect[0].isCollect}]
        if (isCollect) {
          item.ItemCount.collectCount = item.ItemCount.collectCount - 1
        } else {
          item.ItemCount.collectCount = item.ItemCount.collectCount + 1
        }
        this.toast(
          isCollect ? '取消成功' : '收藏成功'
        )
        this.setState({
          newsInfo: item
        })
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
    this.refs.reply.focus()
    this.setState({
      commentItem: item,
      commentBox: true,
      commentText: type ? '评论' : '回复',
      commentType: type,
      shadowZIndex: type === 1 ? 999 : 99999
    }, () => {
        console.log(this.state.commentBox)
      if (this.state.commentType === 0) {
        this.setState({
          itemId: item.itemId,
          name: item.name,
          name: item.User ? item.User.nickName : '匿名用户',
          face: item.User.face
        })
      } else if (this.state.commentType === 1) {
        this.setState({
          itemId: this.state.newsInfo.itemId,
          name: this.state.newsInfo.properties.author
        })
      } else if (this.state.commentType === 2 || this.state.commentType === 3) {
        this.setState({
          itemId: item.itemId,
          replyId: item.replyId,
          name: item.User ? item.User.nickName : '匿名用户',
          face: item.User.face
        })
      }
      // console.log('this.state.replyDetailDialog', this.state.name)
      // console.log('this.state.replyDetailDialog', this.state.commentType)
      // console.log('this.state.replyDetailDialog', this.state.replyDetailDialog)
    })

  }

  showCommentDetail = (item) => {
    console.log('showCommentDetail', this.state.replyDetailDialog, item)
    if (this.state.replyDetailDialog) {
      return
    }
    this.setState({
      shadowZIndex: 999,
      pageNum_reply_detail: 1,
      canLoadMore_reply_detail: true,
      commentDetailItem: item,
      latestComment: [],
      replyDetailDialog: true,
    }, () => {
      let params = {
        start: 0,
        length: 10,
        replyId: item.replyId
      }
      this.getApi('/item/getLikeUser', params, res => {
        if (res.errcode === 0) {
          item.faceList = res.data.rows && res.data.rows.length >= 8 ? res.data.rows.slice(0, 8) : res.data.rows
          item.flag = true
        }
      })
      this.getApi('/item/getCommentTopReply', {replyId: item.replyId}, ret => {
        if (ret.errcode === 0) {
          let results = ret.data.rows
          console.log('getCommentTopReply', results.length)
          this.getCommentOtherReply(results)
        }
      })
    })
  }

  getCommentOtherReply (latestComment) {
    let {pageNum_reply_detail, pageSize, canLoadMore_reply_detail} = this.state
    let item = this.state.commentDetailItem
    console.log('getCommentOtherReply')
    let params = {
      replyId: item.replyId,
      start: (pageNum_reply_detail - 1) * 10,
      length: pageSize
    }
    console.log('getCommentOtherReply', params)
    this.getApi('/item/getCommentOtherReply', params, res => {
      if (res.errcode === 0) {
        let arr = res.data.rows
        let results = latestComment.concat(arr)
        results.map(item => {
          if (!item.Like.length) {
            item.Like.push({
              isLike: 0
            })
          }
          item.hideComment = 1
          item.time = timePeriod(item.createTime)
        })
        this.setState({
          latestComment: results,
          canLoadMore_reply_detail: arr && arr.length >= pageSize,
          pageNum_reply_detail: pageNum_reply_detail + 1
        })
      }
    })
  }

  reportDetails (it) {
    let replyItem = this.state.reportReplyItem
    let params = {
      itemId: this.state.queryParams.itemId,
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

  openReportDialog = (item) => {
    this.setState({
      showReportDialog: true,
      reportReplyItem: item
    }, () => {
      console.log('222adsasdasdasd', item)
    })
  }
}

const styles = StyleSheet.create({
  newsDetailStyle: {
    width: rpx(750),
    flex: 1,
    // height: deviceHeight,
    backgroundColor: '#f8fafc',
    position: 'relative',
  },
  newsTitle: {
    fontSize: rpx(28),
    fontWeight: 'bold',
    lineHeight: rpx(40),
    color: '#00070f'
  },
  bottomCommentBar: {
      borderTopColor: '#ccc',
      borderTopWidth: rpx(1),
      borderStyle: 'solid',
    width: rpx(750),
    // height: rpx(98),
    backgroundColor: 'white',
    paddingVertical: rpx(20),
    paddingHorizontal: rpx(30),
    position: 'absolute',
    bottom: 0,
    left: 0,
    flexDirection: 'column',
    // alignItems: 'center'
  },
  text1: {
    backgroundColor: '#f3f6fa',
    borderRadius: rpx(16),
    paddingLeft: rpx(30),
    paddingVertical: rpx(10),
    fontSize: rpx(26),
    textAlignVertical: 'center'
  },
  icon2: {
    width: rpx(40),
    height: rpx(40),
  },
  subscribeBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: rpx(30),
    backgroundColor: '#f3f6fa',
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
  videoOutBlock: {
    width: rpx(750),
  },
  leftImage: {
    backgroundColor: 'black',
    // marginTop: rpx(20),
    // position: 'absolute',
    zIndex: 999,
    top: rpx(10),
    // left: rpx(50),
    width: rpx(22),
    height: rpx(40),
    marginRight: rpx(5),
    resizeMode: 'contain',
  }
})
