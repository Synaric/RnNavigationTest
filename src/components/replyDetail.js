import React, {Component} from 'react'
import {common} from '../style/common'
import {Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, FlatList} from 'react-native'
import ExtModal from './modal'
import {rpx, deviceHeight, statusBarHeight} from '../utils/adapter'
import {imgHeader} from '../utils/config'
import {get, post} from '../request/API'
import {formatFloat} from '../utils/arts'
import Toast from 'react-native-root-toast'
import navigationService from '../utils/navigationService'
import CommentItem from './commentItem'
import PropTypes from 'prop-types';

export default class ReplyDetail extends Component {
    static propTypes = {
        isVideoDetail: PropTypes.bool
    };

    static defaultProps = {
        isVideoDetail: false
    };

    constructor (props) {
        super(props)
        this.state = {
            specGoodsInfo: null,
            specArr: [],
            buyNum: 1,
            pageNum: 1,
            pageSize: 10,
        }
    }

    openReportDialog = (item, flag) => {
        item.type = flag ? 'reply-reply' : 'reply-self'
        console.log('reply openReportDialog',item.type, item)
        this.props.openReportDialog(item)
    }

    _renderHeader () {
        let {commentDetailItem, latestComment} = this.props
        return (
            <View>
            <View style={{
                borderTopWidth: rpx(1),
                borderStyle: 'solid',
                borderTopColor: '#cdd3dc',
                paddingTop: rpx(20)
            }}>

            </View>
            <CommentItem
                showCommentDetail={() => {}}
                it={commentDetailItem}
                likeComment={this.likeComment1.bind(this)}
                showCommentBox={(e) => {this.showCommentBox(e)}}
                openReportDialog={(e) => {this.openReportDialog(e, 0)}}/>
             <View>
                 {
                     latestComment && latestComment.length ? <Text style={styles.listTitle}>最新回复</Text> : null
                 }
                 
            </View>
            </View>
        )
    }
    
    renderCommentItem (item, index) {
        return (
             <CommentItem
                showCommentDetail={() => {}}
                likeComment={this.likeComment.bind(this)}
                it={item}
                showCommentBox={(e) => {this.showCommentBox(e)}}
                openReportDialog={(e) => {this.openReportDialog(e, 1)}}/>
        )
    }
    
    _renderFooter () {
        let {latestComment, canLoadMore} = this.props
        return (
            <View>
                {
                    latestComment && latestComment.length ?   <Text style={common.listTips}>
                    {canLoadMore ? '正在加载中...' : '我是有底线的'}
                    </Text> : null
                }
            </View>
        )
    }

    render () {
        let {visible, placeOrderMode, onDismiss, type, commentDetailItem, latestComment, isVideoDetail} = this.props
        let {specGoodsInfo, specList, specArr, buyNum, pageNum, pageSize} = this.state
        let thumbList = [
            {
                face: 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqXN0g9W4axhp4Idz23t9RzD5Iia4QiclS1FvMbPsoUoAsMDx4MxrxBKaffrfJBh48Y6y6Cux3NTubQ/132',
                nickName: '钱多多',
                time: '2019-41-12'
            },
            {
                face: 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqXN0g9W4axhp4Idz23t9RzD5Iia4QiclS1FvMbPsoUoAsMDx4MxrxBKaffrfJBh48Y6y6Cux3NTubQ/132',
                nickName: '钱多多',
                time: '2019-41-12'
            },
            {
                face: 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqXN0g9W4axhp4Idz23t9RzD5Iia4QiclS1FvMbPsoUoAsMDx4MxrxBKaffrfJBh48Y6y6Cux3NTubQ/132',
                nickName: '钱多多',
                time: '2019-41-12'
            }
        ]
            // 9999
        return (
            <ExtModal animationType="fade"  fullScreen={true} visible={visible} zIndex={9999}
                      onDismiss={onDismiss}>
                <View style={[styles.replyAndThumbDialog, {height: deviceHeight - (isVideoDetail ? 230 : statusBarHeight) }]}>
                    <View style={{position: 'relative', paddingVertical: rpx(30)}}>
                        <TouchableOpacity onPress={onDismiss} style={[styles.cancelIcon, {padding: rpx(30), zIndex: 99}]}>
                            <Image style={{width: rpx(35), height: rpx(35)}}
                                   source={require('../imgs/cancel-icon.png')}/>
                        </TouchableOpacity>
                        <Text style={styles.dialogTitle}>评论详情</Text>
                    </View>

                    <FlatList
                        contentContainerStyle={{justifyContent: 'center'}}
                        // style={styles.itContainer}
                        showsVerticalScrollIndicator={false}
                        data={latestComment}
                        keyExtractor={(item,index) => '' + index}
                        ListHeaderComponent = {this._renderHeader.bind(this)}//渲染头部组件
                        ListFooterComponent = {this._renderFooter.bind(this)}//渲染底部组件
                        renderItem={({item, index}) => (
                            this.renderCommentItem(item, index)
                        )}
                        onEndReached={() => {
                            this.getLatestComment()
                        }}
                        onEndReachedThreshold={0.1}
                    >
                    </FlatList>

                                 {/* <CommentItem
                                     showCommentDetail={() => {}}
                                     likeComment={this.likeComment.bind(this)}
                                     it={latestComment}
                                     showCommentBox={(e) => {this.showCommentBox(e)}}
                                     openReportDialog={this.openReportDialog.bind(this)}/> */}
                </View>
            </ExtModal>
        )
    }

    getLatestComment = () => {
        console.log('m,m,m,m,m,m,m,', this.props.canLoadMore)
        // if (!this.props.canLoadMore) {
        //     return
        // }
        this.props.getCommentOtherReply(this.props.latestComment)
    }


    showCommentBox = (item) => {
        this.props.showCommentBox(item, 0)
    }

    likeComment = (item) => {
        item.type = 2
        this.props.likeComment(item)
    }

    likeComment1 = (item) => {
        this.props.likeComment(item)
    }

}

const styles = StyleSheet.create({
    replyAndThumbDialog: {
        width: rpx(750),
        height: (deviceHeight - 500),
        backgroundColor: 'white',
        borderTopRightRadius: rpx(20),
        borderTopLeftRadius: rpx(20),
    },
    cancelIcon: {
        position: 'absolute',
        top: rpx(0),
        left: rpx(0),
    },
    dialogTitle: {
        textAlign: 'center',
        color: '#00070f',
        fontSize: rpx(28),
        fontWeight: 'bold'
    },
    listTitle: {
        color: '#00070f',
        fontSize: rpx(28),
        fontWeight: 'bold',
        backgroundColor: '#f3f6fa',
        paddingVertical: rpx(30),
        paddingLeft: rpx(30)
    }
})
