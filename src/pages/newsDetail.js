import {
  Platform, Image, KeyboardAvoidingView, Modal, ScrollView, StyleSheet, Text, TextInput, View,
  TouchableOpacity
} from "react-native";
import React from "react";
import BasePage from "./basePage";
import {rpx} from "../util/adapterUtils";
import {HPageViewHoc} from "react-native-head-tab-view";
import ListView from "../components/listView"
import Player from "../components/playerV2"
import NavBar from "../components/navBar";
import {formatDate, getFullPicUrl, ScrollViewReachBottom, timePeriod} from "../util/artUtils";
import {common} from "../common/style";
import HTML from 'react-native-render-html';
import ImageViewer from 'react-native-image-zoom-viewer';
import NewsBottomArea from "../components/newsBottomArea";
import CommentItem from "../components/commentItem";
import Btn from "../components/btn";
import EmptyView from "../components/emptyView";
import ReplyBox from "../components/replyBox";
import {getStorage} from "../util/storage";

const HFlatList = HPageViewHoc(ListView)

export default class NewsDetail extends BasePage {

  constructor(props) {
    super(props);
    this.state = {
      itemId: null,
      showLoading: true,
      fullScreen: false,
      scrollEnabled: true,
      enableShare: false,
      preview: false,
      newsInfo: null,
      showPreviewImage: false,
      showReplyBox: false,
      previewImages: [],
      commentList: [],
      commentListCount: 0,
      detailComPageNum: 1,
      isDetailComLastPage: false,
      replyAction: 1,
      replyTarget: null,
      targetReplyItem: null,
      userInfo: null
    };
    this.contentScrollView = null
    this.replyBox = null
  }

  // static options() {
  //   return {
  //     statusBar: {
  //       style: 'dark',
  //       backgroundColor: 'white'
  //     }
  //   }
  // }

  static resolveStatusBar() {
    return {
      visible: true,
      style: 'dark',
      backgroundColor: 'white'
    }
  }

  render() {
    let {showLoading, newsInfo, fullScreen, scrollEnabled} = this.state
    return (
      showLoading ?
        <View style={common.loadingContainer}>
          <Image style={common.loading} source={require('../img/loading.gif')} />
        </View> :
        <View style={{flex: 1, backgroundColor: 'white', position: 'relative'}}>
          {
            fullScreen ? null : <NavBar title={'光明教育家'} navigator={this.navigator} />
          }
          <ScrollView ref={(ref) => {this.contentScrollView = ref}}
                      style={{flex: 1}}
                      nestedScrollEnabled={true}
                      scrollEnabled={scrollEnabled}
                      onScroll={this.onScroll}
                      onMomentumScrollEnd={this.onMomentumScrollEnd}>
            {/*主要视图*/}
            {
              this.renderHeader()
            }
            {
              this.renderContent()
            }
            {
              this.renderContentFooter()
            }
            {
              this.renderCommentList()
            }
          </ScrollView>
          {
            this.renderBottomArea()
          }
          {
            this.renderReplyBox()
          }
          {
            this.renderPreviewImageModal()
          }
        </View>
    );
  }

  renderHeader() {
    let {fullScreen, newsInfo} = this.state
    let avatar = newsInfo.UserInfo.User.School.pic || newsInfo.UserInfo.User.face
    let nickName =  newsInfo.UserInfo.User.School.name || newsInfo.properties.author
    return (
      fullScreen || !newsInfo ? null :
        <>
          <View style={styles.container}>
            <Text style={styles.newsTitle} numberOfLines={2}>{newsInfo.itemName}</Text>
            <View style={styles.space} />
            <View style={styles.header}>
              <Image style={styles.avatar} source={{uri: avatar}} />
              <View style={styles.headerInfoWrapper}>
                <Text style={styles.nickName}>{nickName}</Text>
                <Text style={styles.publishTime}>{newsInfo.time}</Text>
              </View>
              {/*<Follow isFollow={true} onPress={this.onFollowStateChange} />*/}
            </View>
          </View>
        </>
    )
  }

  renderContent() {
    let {newsInfo} = this.state
    return (
      <View style={styles.container}>
        {
          newsInfo.itemTypeId === 2 ?
            <Player
              videoStyle={{width: rpx(690), height: rpx(400)}}
              url={newsInfo.videoLink}
              canShowCover={true}
              cover={newsInfo.videoPic}
              maxPlayTime={0}
              onFullScreenChange={this.onFullScreenChange}/> : null
        }
        <HTML html={newsInfo.properties.content} imagesMaxWidth={rpx(690)} onDOMImagePress={this.onDOMImagePress} />
      </View>
    )
  }

  renderContentFooter() {
    let {newsInfo} = this.state
    return (
      <View style={styles.contentFooter}>
        <Btn style={styles.likeContainer} onPress={this.likeNews}>
          <Image style={{width: rpx(30), height: rpx(30)}}
                 source={newsInfo.Like[0].isLike ? require('../img/have-thumb.png') : require('../img/bottom-thumb.png')} />
        </Btn>
        <Text style={styles.likeDesc}>{newsInfo.ItemCount ? newsInfo.ItemCount.likeCount : 0}人觉得学到了</Text>
      </View>
    )
  }

  renderCommentList() {
    let {commentList, commentListCount, isDetailComLastPage} = this.state
    return (
      <>
        <View style={{height: rpx(12), backgroundColor: '#f4f9fa'}}/>
        <View style={styles.commentListHeader}>
          <Text style={{fontSize: rpx(32)}}>思考区</Text>
          <Text style={{fontSize: rpx(22)}}>（{commentListCount}）</Text>
        </View>
        {
          commentList && commentList.length ? commentList.map((item, index) => (
            <CommentItem comment={item}
                         key={item.replyId}
                         onReply={this.reply}
                         onToggleLike={this.likeComment} />
          )) : null
        }
        {
          commentList && commentList.length && isDetailComLastPage ?
            <Text style={styles.noMoreComment}>我是有底线的</Text> : null
        }
        {
          !commentList || !commentList.length ? <EmptyView hint={'快来当第一个发布思考的人吧'} /> : null
        }
      </>
    )
  }

  renderPreviewImageModal() {
    let {showPreviewImage, previewImages} = this.state
    return (
      <Modal visible={showPreviewImage} transparent={true}
             onRequestClose={() => {this.setState({showPreviewImage: false})}}
             onDismiss={() => {this.setState({showPreviewImage: false}) }}>
        <ImageViewer imageUrls={previewImages}/>
      </Modal>
    )
  }

  renderBottomArea() {
    let {newsInfo}  = this.state
    return (
      <NewsBottomArea
        isLike={newsInfo.Like[0].isLike}
        isCollect={newsInfo.Collect[0].isCollect}
        onReply={this.reply}
        onToggleLike={this.likeNews}
        onToggleCollect={this.collectNews} />
    )
  }

  renderReplyBox() {
    let {showReplyBox, replyAction, replyTarget} = this.state
    return (
      <ReplyBox
        ref={ref => {this.replyBox = ref}}
        showReplyBox={showReplyBox}
        action={replyAction}
        target={replyTarget}
        onComplete={this.onReplyBoxComplete}
        onDismiss={() => {  this.setState({showReplyBox: false}) }}/>
    )
  }

  onLoad() {
    let {itemId, itemCategoryId} = this.props
    this.getDetail(itemId, itemCategoryId, () => {
      this.getCommentList()

      this.scrollViewReachBottom = new ScrollViewReachBottom()
      this.scrollViewReachBottom.bindOnReachEnd(this.onReachEnd)
    })

    getStorage('userInfo', (user) => {
      this.setState({userInfo: user})
    })
  }

  getDetail(itemId, itemCategoryId, callback) {
    let {preview} = this.state

    let params = {
      itemId: itemId,
      itemCategoryId: itemCategoryId
    }
    this.getApi('item/getItem', params, res => {
      let data = res.data
      let enableShare = !(data.online !== 1 || preview)
      data.pic = data.properties.pic || (data.properties.picList ? getFullPicUrl(JSON.parse(data.properties.picList)[0]) : '')
      data.share = getFullPicUrl(data.properties.share)
      data.time = formatDate(new Date(data.createTime))
      if (data.itemTypeId === 2) {
        data.videoPic = getFullPicUrl(data.properties.pic)
        data.videoLink = getFullPicUrl(data.properties.link)
      }
      if (!data.Like) {
        data.Like = []
      }
      if (!data.Like.length) {
        data.Like.push({ isLike: 0 })
      }
      if (!data.Collect) {
        data.Collect = []
      }
      if (!data.Collect.length) {
        data.Collect.push({ isCollect: 0 })
      }
      if (!data.ItemCount) {
        data.ItemCount = {
          collectCount: 0,
          likeCount: 0,
          replyCount: 0,
          viewCount: 0,
          shareCount: 0
        }
      }
      if (data.UserInfo.User.School) {
        data.UserInfo.User.School.pic = getFullPicUrl(data.UserInfo.User.School.pic)
      }

      this.setState({
        itemId,
        enableShare,
        showLoading: false,
        newsInfo: data
      }, callback)
    })
  }

  getCommentList() {
    let {itemId, commentList, detailComPageNum, isDetailComLastPage} = this.state

    if (isDetailComLastPage) {
      return
    }

    let params = {
      itemId: itemId,
      start: (detailComPageNum - 1) * 10,
      length: 10
    }
    this.getApi('item/getItemTopReply', params, res => {
      if (res.errcode !== 0) {
        return
      }
      let results = res.data.rows
      let commentListCount = res.data.count

      results.forEach(item => {
        item.ChildReplyLength = item.ChildReply.length
        item.ChildReply = item.ChildReply.slice(0, 2)
        item.ChildReply.forEach(el => {
          el.properties = JSON.parse(el.properties)
        })

        if (item.Like && item.Like.length === 0) {
          item.Like.push({
            isLike: 0
          })
        }
        item.time = timePeriod(item.createTime)
      })

      let isDetailComLastPage = results.length < 10
      if (detailComPageNum === 1) {
        this.setState({
          commentList: results,
          isDetailComLastPage,
          commentListCount,
          detailComPageNum: detailComPageNum + 1
        })
      } else {
        this.setState({
          commentList: commentList.concat(results),
          isDetailComLastPage,
          commentListCount,
          detailComPageNum: detailComPageNum + 1
        })
      }
    })
  }

  reply = (action, target, targetReplyItem) => {
    let {newsInfo} = this.state
    this.setState({
      showReplyBox: true,
      replyAction: action,
      replyTarget: target || newsInfo.properties.author,
      targetReplyItem
    })
  }

  likeNews = () => {
    let {newsInfo} = this.state
    if (!newsInfo) {
      return
    }
    let params = {itemId: newsInfo.itemId, authorId: newsInfo.UserInfo.distinctId}
    let isLike = newsInfo.Like[0].isLike
    let path = isLike ? 'unLike' : 'like'
    this.postApi(`user/${path}`, params, res => {
      if (res.errcode === 0) {
        newsInfo.Like = [{ isLike: Number(!newsInfo.Like[0].isLike) }]
        if (isLike) {
          newsInfo.ItemCount.likeCount = newsInfo.ItemCount.likeCount - 1
        } else {
          newsInfo.ItemCount.likeCount = newsInfo.ItemCount.likeCount + 1
        }
        this.setState({newsInfo})
      }
    })
  }

  likeComment = (item) => {
    let {userInfo} = this.state
    if (!userInfo) {
      return
    }

    let params = { replyId: item.replyId, authorId: item.userId }
    let isLike = item.Like[0].isLike
    let path = isLike ? 'unLike' : 'like'
    this.postApi(`user/${path}`, params, res => {
      if (res.errcode === 0) {
        item.Like = [{ isLike: !item.Like[0].isLike }]
        if (isLike) {
          item.ReplyCount.likeCount = item.ReplyCount.likeCount - 1
        } else {
          item.ReplyCount.likeCount = item.ReplyCount.likeCount + 1
        }

        this.$forceUpdate()
      }
    })
  }

  collectNews = () => {
    let {newsInfo} = this.state
    if (!newsInfo) {
      return
    }
    let isCollect = newsInfo.Collect[0].isCollect
    let path = newsInfo.Collect[0].isCollect ? 'unCollect' : 'collect'
    this.postApi(`user/${path}`, {itemId: newsInfo.itemId}, res => {
      if (res.errcode === 0) {
        newsInfo.Collect = [{isCollect: !newsInfo.Collect[0].isCollect}]
        if (isCollect) {
          newsInfo.ItemCount.collectCount = newsInfo.ItemCount.collectCount - 1
        } else {
          newsInfo.ItemCount.collectCount = newsInfo.ItemCount.collectCount + 1
        }
        this.setState({newsInfo})
      }
    })
  }

  onReplyBoxComplete = (action, content) => {
    if (!content) {
      this.toast('内容不为空')
      return
    }
    this.postApi('msgCheck', {data: {content}}, res => {
      if (JSON.parse(res.data).errcode !== 0) {
        this.toast('内容违规')
        return
      }

      let {targetReplyItem} = this.state
      let params = {
        detail: content,
        itemId: this.state.itemId,
        replyId: targetReplyItem ? targetReplyItem.replyId : null
      }
      this.postApi('user/reply', params, res => {
        this.toast(action === 0 ? '回复成功' : '评论成功')
        this.setState({showReplyBox: false})



        let {commentList, commentListCount, targetReplyItem, userInfo}  =this.state
        let comment = res.data
        comment.hideComment = true
        // @param commentType 1 详情下方评论
        if (action === 1) {
          comment.hideComment = false
          comment.Like = [{ isLike: 0 }]
          comment.ReplyCount = {
            replyCount: 0,
            likeCount: 0
          }
          comment.User = {
            face: userInfo.face,
            nickName: userInfo.nickName
          }
          comment.isBan = Number(comment.isBan)
          comment.properties = JSON.parse(comment.properties)
          comment.ItemReport = []
          comment.createTime = new Date().valueOf()
          comment.time = timePeriod(new Date())

          commentList.unshift(comment)
          commentListCount = commentListCount + 1
        } else {
          let replyIndex = commentList.findIndex(item => item.replyId === targetReplyItem.replyId)
          if (!commentList[replyIndex].hasOwnProperty('ChildReplyLength')) {
            commentList[replyIndex].ChildReplyLength = 0
          }
          commentList[replyIndex].ChildReplyLength += 1
          if (commentList[replyIndex].ChildReplyLength <= 2) {

            let childReply = {
              ReplyCount: {
                replyCount: 0,
                likeCount: 0,
                unReadLikeCount: 0,
                unReadReplyCount: 0
              },
              User: {
                face: userInfo ? userInfo.face : '',
                nickName: userInfo ? userInfo.nickName : ''
              },
              isBan: 0,
              isDelete: 0,
              isRead: 0,
              createTime: new Date().valueOf(),
              pUser: {
                face: targetReplyItem.User.face,
                nickName: targetReplyItem.User.nickName || '匿名用户'
              },
              properties: { detail: this.content }
            }
            if (!commentList[replyIndex].hasOwnProperty('ChildReply')) {
              commentList[replyIndex].ChildReply = []
            }
            commentList[replyIndex].ChildReply.push(childReply)
          }
        }

        this.setState({
          commentList,
          commentListCount
        })
        this.replyBox.clear()
      })
    })
  }

  onScroll = (e) => {
    // 判断是否滑动到底部
    this.scrollViewReachBottom.onScroll(e)
  }

  onMomentumScrollEnd = () => {
    this.scrollViewReachBottom.onMomentumScrollEnd()
  }

  onReachEnd = () => {
    this.getCommentList()
  }

  onFullScreenChange = (fullScreen) => {
    if (fullScreen) {
      this.contentScrollView.scrollTo({x: 0, y: 0, animated: false})
      this.navigator.mergeOptions({
        statusBar: {
          visible: false
        }
      })
    } else {
      this.navigator.mergeOptions({
        statusBar: NewsDetail.resolveStatusBar()
      })
    }
    this.setState({
      fullScreen,
      scrollEnabled: !fullScreen
    })
  }

  onFollowStateChange = () => {

  }

  onDOMImagePress = (e) => {
    this.print('onDOMImagePress', e)
    this.setState({
      showPreviewImage: true,
      previewImages: [{url: e.source.uri}]
    })
  }
}

const styles = StyleSheet.create({

  container: {
    paddingHorizontal: rpx(30)
  },

  newsTitle: {
    maxHeight: rpx(96),
    lineHeight: rpx(48),
    fontSize: rpx(36),
    color: '#313332',
    marginTop: rpx(18)
  },

  space: {
    height: rpx(20),
    borderBottomWidth: rpx(1),
    borderBottomColor: '#f4f9fa'
  },

  header: {
    height: rpx(125),
    flexDirection: 'row',
    alignItems: 'center'
  },

  avatar: {
    width: rpx(64),
    height: rpx(64),
    borderRadius: rpx(32),
    backgroundColor: '#f4f9fa'
  },

  headerInfoWrapper: {
    flex: 1,
    flexDirection: 'column',
    height: rpx(64),
    justifyContent: 'center',
    marginLeft: rpx(16)
  },

  nickName: {
    fontSize: rpx(26),
    color: '#313332'
  },

  publishTime: {
    fontSize: rpx(26),
    color: '#b1b1b1'
  },

  contentFooter: {
    marginVertical: rpx(30),
    alignItems: 'center'
  },

  likeContainer: {
    width: rpx(96),
    height: rpx(96),
    borderRadius: rpx(48),
    backgroundColor: '#f4f9fa',
    justifyContent: 'center',
    alignItems: 'center'
  },

  likeDesc: {
    color: '#b1b1b1',
    marginTop: rpx(20),
    fontSize: rpx(24)
  },

  commentListHeader: {
    height: rpx(90),
    paddingHorizontal: rpx(30),
    flexDirection: 'row',
    alignItems: 'center',
    color: '#313332'
  },

  noMoreComment: {
    textAlign: 'center',
    color: '#b1b1b1',
    fontSize: rpx(24),
    marginBottom: rpx(88)
  }
})
