import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import React from 'react'
import BaseComponent from './baseComponents'
import {rpx} from "../util/adapterUtils";
import Btn from "./btn";
import {DEFAULT_AVATAR} from "../util/config";

export default class CommentItem extends BaseComponent {

  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    let item = this.props.comment
    let {onToggleLike, onReply} = this.props
    return (
      <View style={styles.commentContainer}>
        <Image style={styles.avatar} source={{uri: item.User ? item.User.face : DEFAULT_AVATAR}} />
        <View style={styles.content}>
          <View style={styles.commentHeader}>
            <Text style={styles.nickName}>{item.User ? item.User.nickName : '匿名用户'}</Text>
            <Btn style={styles.reply} onPress={() => {onReply(0, item.User ? item.User.nickName : '匿名用户', item)}}>
              <Image style={{width: rpx(26), height: rpx(26)}} source={require('../img/comment-icon.png')}/>
            </Btn>
            <Btn style={styles.like} onPress={() => {onToggleLike(item)}}>
              <Image style={{width: rpx(26), height: rpx(26)}}
                     source={item.Like && item.Like[0] && item.Like[0].isLike ? require('../img/have-thumb.png') : require('../img/no-thumb.png')}/>
              <Text style={[styles.likeCount, {color: '#b1b1b1'}]}>{item.ReplyCount.likeCount}</Text>
            </Btn>
          </View>

          <Text style={styles.commentText} numberOfLines={5}>
            {item.ItemReport.length || item.isBan || item.isDelete ? '该评论已删除' : item.properties.detail}</Text>
          {item.ChildReply && item.ChildReply.length ? this.renderSubReply() : null}
          <View style={styles.commentFooter}>
            <Text style={[styles.footerText, {flex: 1}]}>{item.time}</Text>
            <Btn style={styles.report}>
              <Text style={styles.footerText}>举报</Text>
            </Btn>
          </View>
          <View style={styles.divider}/>
        </View>
      </View>
    )
  }

  renderSubReply() {
    let item = this.props.comment
    return (
      <View style={styles.subReplyContainer}>
        {
          item.ChildReply.map((ele, index) => (
            <Text style={styles.commentText}>
              {
                ele.pUser &&
                <>
                  <Text style={{fontWeight: 'bold'}}>{ele.User.nickName}</Text>
                  <Text>回复</Text>
                  <Text style={{fontWeight: 'bold'}}>{ele.pUser.nickName}</Text>
                </>
              }
              {
                !ele.pUser && <Text style={{fontWeight: 'bold'}}>{ele.User.nickName}</Text>
              }
              <Text style={styles.commentText} numberOfLines={3}>{ele.properties.detail}</Text>
            </Text>
          ))
        }
        {
          item.ChildReplyLength > 2 ?
            <Text style={styles.showAllComments}>查看全部{item.ChildReplyLength}条回复</Text> : null
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({

  commentContainer: {
    paddingHorizontal: rpx(30),
    display: 'flex',
    flexDirection: 'row',
    marginBottom: rpx(30)
  },

  avatar: {
    width: rpx(64),
    height: rpx(64),
    borderRadius: rpx(32),
    backgroundColor: '#f4f9fa',
    marginRight: rpx(20)
  },

  content: {
    flex: 1,
    flexDirection: 'column'
  },

  commentHeader: {
    height: rpx(46),
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -rpx(10)
  },

  nickName: {
    flex: 1,
    fontSize: rpx(24),
    color: '#313332',
    fontWeight: 'bold'
  },

  reply: {
    width: rpx(46),
    height: rpx(46),
    justifyContent: 'center',
    alignItems: 'center'
  },

  like: {
    marginLeft: rpx(10),
    flexDirection: 'row',
    alignItems: 'center',
    height: rpx(46)
  },

  likeCount: {
    marginLeft: rpx(11),
    fontSize: rpx(24)
  },

  commentText: {
    color: '#313332',
    fontSize: rpx(24),
    lineHeight: rpx(36)
  },

  subReplyContainer: {
    flexDirection: 'column',
    backgroundColor: '#f4f9fa',
    padding: rpx(20),
    marginTop: rpx(17)
  },

  commentFooter: {
    height: rpx(64),
    flexDirection: 'row',
    alignItems: 'center'
  },

  footerText: {
    color: '#b1b1b1',
    fontSize: rpx(20)
  },

  report: {
    height: rpx(64),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: rpx(10)
  },

  divider: {
    height: rpx(1),
    backgroundColor: '#cccccc',
    marginTop: rpx(10)
  },

  showAllComments: {
    color: '#313332',
    fontSize: rpx(24),
    marginBottom: rpx(20)
  }
})
