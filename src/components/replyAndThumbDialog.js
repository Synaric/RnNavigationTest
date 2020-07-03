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


export default class ReplyAndThumbDialog extends Component {

    constructor (props) {
        super(props)
        this.state = {
            specGoodsInfo: null,
            specArr: [],
            buyNum: 1
        }
    }

    mounted () {
        console.log(this.props.visible)
    }

    likeComment = (item, type) => {
        item.type = type
        // console.log('likeComment', item)
        this.props.likeComment(item)
    }

    showCommentBox = (item) => {
        this.props.showCommentBox(item)
    }
    openReportDialog = (status) => {
        console.log('reply openReportDialog', status)
        this.props.openReportDialog(status)
    }

    _renderHeader () {
        let {unReadReply, haveReadReply} = this.props
        console.log('_renderHeader', this.props.unReadReply)
        return (
            <View>
                {
                    unReadReply && unReadReply.length ? <Text style={styles.listTitle}>最新回复</Text> : null
                }
                {
                    unReadReply.map(it => (
                        <CommentItem  it={it}
                                likeComment={(e) => {this.likeComment(e, 0)}}
                                showCommentBox={this.showCommentBox.bind(this)}
                                openReportDialog={this.openReportDialog.bind(this)}/>
                    ))
                }
                 {
                    haveReadReply && haveReadReply.length ? <Text style={styles.listTitle}>全部回复</Text> : null
                }
                
            </View>
        )
    }

    renderCommentItem (item, index) {
        return (
            <CommentItem 
                it={item}
                likeComment={(e) => {this.likeComment(e, 1)}} 
                showCommentBox={this.showCommentBox.bind(this)}
                // openReportDialog={this.openReportDialog.bind(this)}
                // showCommentBox={(e) => {
                //     this.showCommentBox(e, 2)
                // }}
                // showCommentDetail={this.showCommentDetail.bind(this)}
                >
                    
                </CommentItem>
        )
    }

    render () {
        let {visible, placeOrderMode, onDismiss, type, haveReadReply} = this.props
        let {specGoodsInfo, specList, specArr, buyNum} = this.state
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
        return (
            <ExtModal animationType="fade" fullScreen={true} visible={visible}
                      onDismiss={onDismiss}>
                <View style={styles.replyAndThumbDialog}>

                    <View style={{position: 'relative', paddingVertical: rpx(30)}}>
                        <TouchableOpacity onPress={onDismiss} style={[styles.cancelIcon, {zIndex: 99}]}>
                            <Image style={{width: rpx(35), height: rpx(35)}}
                                   source={require('../imgs/cancel-icon.png')}/>
                        </TouchableOpacity>
                        <Text style={styles.dialogTitle}>{type ? '点赞我的评论' : '回复我的评论'}</Text>
                    </View>
                    <View>
                        {
                            type ? 
                            <View style={{
                                borderTopWidth: rpx(1),
                                borderStyle: 'solid',
                                borderTopColor: '#cdd3dc',
                                paddingTop: rpx(20)
                            }}>
                                {
                                    thumbList && thumbList.map((it, index) => (
                                        <View style={{
                                            width: rpx(690),
                                            marginHorizontal: rpx(30),
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            marginBottom: rpx(30),
                                        }}>
                                            <Image style={{width: rpx(80), height: rpx(80), borderRadius: rpx(40)}}
                                                   source={{uri: it.face}}/>
                                            <View style={{height: rpx(70), marginLeft: rpx(15)}}>
                                                <Text style={{
                                                    color: '#00070f',
                                                    fontSize: rpx(28),
                                                    fontWeight: 'bold'
                                                }}>{it.nickName}</Text>
                                                <Text style={{
                                                    color: '#4f5661',
                                                    fontSize: rpx(20)
                                                }}>{it.time}</Text>
                                            </View>
                                            <Text style={{
                                                color: '#4f5661', marginLeft: 'auto',
                                                fontSize: rpx(26)
                                            }}>赞了我的评论</Text>
                                        </View>
                                    ))

                                }
                            </View> : 
                                
                                <FlatList
                                contentContainerStyle={{justifyContent: 'center'}}
                                showsVerticalScrollIndicator={false}
                                data={haveReadReply}
                                // keyExtractor={(item,index) => '' + index}
                                ListHeaderComponent = {this._renderHeader.bind(this)}//渲染头部组件
                                // ListFooterComponent = {this._renderFooter.bind(this)}//渲染底部组件
                                renderItem={({item, index}) => (
                                    this.renderCommentItem(item, index)
                                )}
                                // onEndReached={() => {
                                //     this.getItemOtherReply(pageNum, pageSize, commentList)
                                // }}
                                // onEndReachedThreshold={0.3}
                                >
                                </FlatList>

                                // <CommentItem openReportDialog={this.openReportDialog.bind(this)}/></View>
                        }
                    </View>
                </View>
            </ExtModal>
        )
    }
}

const styles = StyleSheet.create({
    replyAndThumbDialog: {
        width: rpx(750),
        height: (deviceHeight - statusBarHeight),
        backgroundColor: 'white',
        borderTopRightRadius: rpx(20),
        borderTopLeftRadius: rpx(20),
    },
    cancelIcon: {
        width: rpx(35),
        height: rpx(35),
        position: 'absolute',
        top: rpx(35),
        left: rpx(30),
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
