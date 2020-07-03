import React from 'react'
import {Image, Platform, StyleSheet, TouchableOpacity, View, Text, ScrollView} from 'react-native'
import {rpx} from '../utils/adapter'
import {imgHeader} from '../utils/config'
import PropTypes from 'prop-types'
import {common} from '../style/common'
import {post, get} from '../request/API'
import TabBar from '../components/tabBar'
import Swiper from 'react-native-swiper'
import ExtModal from './modal'
// import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view';

export default class CommentItem extends React.Component {
    static propTypes = {
        title: PropTypes.array,
    }

    static defaultProps = {
        title: [
        ]
    }

    constructor(props) {
        super(props)
        this.state = {
            cateType: 1,
            showReportDialog: false
        }
    }

    likeComment = (item) => {
       this.props.likeComment(item)
    }

    replyComment = (it) => {
        this.props.showCommentBox(it)
    }

    render() {
        let {showReportDialog} = this.state
        let {commentList, visible, onDismiss, it} = this.props
        return (
            <View style={styles.container}>
                {/* {
                    commentList && commentList.map((it, index) => (
                        <View style={styles.commentBlock}>
                            <Image style={styles.commentFace} source={{uri: it.User.face}}/>
                            <View style={{
                                flex: 1,
                                flexDirection: 'column',
                                borderBottomColor: '#cdd3dc',
                                borderStyle: 'solid',
                                borderBottomWidth: rpx(2)
                            }}>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <Text style={{
                                        fontSize: rpx(28),
                                        fontWeight: 'bold',
                                        color: '#00070f'
                                    }}>{it.User.nickName}</Text>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}}
                                                          onPress={() => {
                                                              this.likeComment(it)
                                                          }}>
                                            <Image style={common.icon1}
                                                   source={it.Like && it.Like[0] && it.Like[0].isLike ? require('../imgs/have-thumb.png') : require('../imgs/no-thumb.png')}/>
                                            <Text style={{marginHorizontal: rpx(20)}}>{it.ReplyCount.likeCount}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}}
                                                          onPress={() => {
                                                              this.replyComment(it)
                                                          }}>
                                            <Image style={common.icon1} source={require('../imgs/comment-icon.png')}/>
                                            <Text style={{marginLeft: rpx(15)}}>{it.ReplyCount.replyCount}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}}
                                                  onPress={() => {
                                                      this.skipCommentDetail(it)
                                                  }}>
                                <Text numberOfLines={3}
                                      style={{fontSize: rpx(26), lineHeight: rpx(44), color: '#4f5661'}}>
                                    {it.properties.detail}</Text>
                                </TouchableOpacity>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginVertical: rpx(30)
                                }}>
                                    <Text style={common.newsDesc}>{it.time}</Text>
                                    <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => {
                                        this.openReportDialog()
                                    }}>
                                        <Text style={common.newsDesc}>举报</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View> 
                    ))
                } */}
                
                <View style={styles.commentBlock}>
                            <Image style={styles.commentFace} source={{uri: it.User.face}}/>
                            <View style={{
                                flex: 1,
                                flexDirection: 'column',
                                borderBottomColor: '#cdd3dc',
                                borderStyle: 'solid',
                                borderBottomWidth: rpx(2)
                            }}>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <Text style={{
                                        fontSize: rpx(28),
                                        fontWeight: 'bold',
                                        color: '#00070f'
                                    }}>{it.User.nickName}</Text>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}}
                                                          onPress={() => {
                                                              this.likeComment(it)
                                                          }}>
                                            <Image style={common.icon1}
                                                   source={it.Like && it.Like[0] && it.Like[0].isLike ? require('../imgs/have-thumb.png') : require('../imgs/no-thumb.png')}/>
                                            <Text style={{marginLeft: rpx(15), marginRight: rpx(35)}}>{it.ReplyCount.likeCount}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}}
                                                          onPress={() => {
                                                              this.replyComment(it)
                                                          }}>
                                            <Image style={common.icon1} source={require('../imgs/comment-icon.png')}/>
                                            {
                                                it.hideComment ? null : <Text style={{marginLeft: rpx(15)}}>{it.ReplyCount.replyCount}</Text>
                                            }
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}}
                                                  onPress={() => {
                                                      this.skipCommentDetail(it)
                                                  }}>
                                <Text numberOfLines={3}
                                      style={{fontSize: rpx(26), marginVertical: rpx(15), lineHeight: rpx(44), color: '#4f5661'}}>
                                    {it.ItemReport.length ? '该条评论已被举报' : it.properties.detail}</Text>
                                </TouchableOpacity>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    // marginVertical: rpx(30),
                                    // backgroundColor: 'blue',
                                    alignItems: 'center',
                                    height: rpx(70)
                                }}>
                                    <Text style={common.newsDesc}>{it.time}</Text>
                                    <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => {
                                        this.openReportDialog(it)
                                    }}>
                                       {
                                        it.ItemReport.length ? null : <Text style={[common.newsDesc, {paddingHorizontal: rpx(15), lineHeight: rpx(70)}]}>举报</Text>
                                       }
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View> 
            



                 

            </View>

        )
    }

    selectCate = (it, idx) => {
        if (this.state.cateType === idx) {
            return
        }
        this.setState({
            cateType: idx
        })
    }

    openReportDialog = (it) => {
        this.props.openReportDialog(it)
    }

    skipCommentDetail = (item) => {
        if (item.ItemReport.length || item.isBan || item.isDelete) {
            return
        }
        this.props.showCommentDetail(item)
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    commentBlock: {
        padding: rpx(30),
        flexDirection: 'row',
    },
    commentFace: {
        width: rpx(80),
        height: rpx(80),
        borderRadius: rpx(40),
        marginRight: rpx(20)
    },
    reportStyle: {
        width: rpx(710),
        position: 'relative',
        zIndex: 999
    },
})
