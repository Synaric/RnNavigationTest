import React from 'react'
import {
    Image,
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    ScrollView,
    TextInput,
    KeyboardAvoidingView
} from 'react-native'
import {rpx} from '../utils/adapter'
import Base from '../components/base'
import {common} from '../style/common'
// import HTML from 'react-native-render-html'
import NavBar from '../components/navBar.android'
import NewsItem from '../components/newsItem'
import CommentItem from '../components/commentItem'
import Report from '../components/report'
import {thumbAndCommentAndBrowser, timePeriod, URL, transformNewsItem} from '../utils/utils'
import ReplyDetail from '../components/replyDetail'
import ExtModal from "../components/modal";
import {post} from "../request/API";

export default class NewsDetail extends Base {
    resolveStatusBar() {
        return {
            barStyle: 'dark-content',
            backgroundColor: 'transparent',
            translucent: true
        }
    }

    created() {
        this.state = {
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
            pageNum: 0,
            itemCategoryId: '',
            dynamicHeight: 0,
            commentHeight: 0,
            isLastPage: false,
            dialogShow: false,
            commentBox: false,
            replyDetailDialog: false,
            newsList: [],
            latestComment: [],
            commentDetail: [],
            commentDetailItem: [],
            newsInfo: {
                properties: {},
                Like: [{isLike: 0}],
                Collect: [{isCollect: 0}]
            },
            commentItem: {},
            commentText: '',
            commentType: 0,
            pageDuration: 0,
            isSharedPage: false,
            startTime: new Date().valueOf(),
            endTime: 0,
            showCommentDialog: false,
            hasNewsList: false
        }
    }

    mounted() {
        console.log(' ========================= mounted =======================')
        let params = this.getParams()
        this.getNewsDetail(params)
        this.getRecommendItem(params)
        this.getNewsCommentList(params)
    }

    getNewsDetail(data) {
        let params = {
            itemId: data.itemId,
            itemCategoryId: data.itemCategoryId
        }
        this.getApi('/item/getItem', params, res => {
            if (res.errcode === 0) {
                let results = res.data
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
                console.log('this.newsInfo ================', results)
                this.setState({
                    newsInfo: results
                })
            }
        })
    }

    getRecommendItem(data) {
        let params = {
            itemId: data.itemId
        }
        this.getApi('/item/getRelateItem', params, res => {
            if (res.errcode === 0) {
                let results = transformNewsItem(res.data ? res.data : [], 1)
                this.setState({
                    newsList: results.length >= 3 ? results.slice(0, 3) : results,
                    hasNewsList: results.length
                }, () => {
                })
            }
        })
    }

    getNewsCommentList(params) {
        this.getApi('/item/getItemTopReply', params, res => {
            if (res.errcode === 0) {
                res.data.rows.map(item => {
                    item.ChildReply && item.ChildReply.length && item.ChildReply.map(el => {
                        el.properties = JSON.parse(el.properties)
                    })
                })
                this.setState({
                    topReply: res.data.rows
                }, () => {
                    this.getApi('/item/getItemOtherReply', params, ret => {
                        if (ret.errcode === 0) {
                            let arr = this.state.topReply.concat(ret.data.rows)
                            arr.map(item => {
                                if (!item.User) {
                                    item.User = {
                                        nickName: '哈哈哈',
                                        face: 'https://weixinfactory.di1game.com/web/header-images/logo.png'
                                    }
                                }
                                if (item.Like.length === 0) {
                                    item.Like = [{isLike: 0}]
                                }
                                item.time = timePeriod(item.createTime)
                            })
                            this.setState({
                                commentList: arr
                            }, () => {
                                console.log('getItemOtherReply', this.state.commentList)
                            })
                        }
                    })
                })
            }
        })
    }

    getItemOtherReply(params) {

    }

    shareNewsDetail() {
        sendPostRequest('/user/share', {itemId: this.itemId}, res => {
            // console.log('share', res)
            if (res.errcode === 0) {
                this.newsInfo.ItemCount.shareCount += 1
                console.log('分享成功')
            }
        })
    }

    getPicList(list) {
        try {
            return JSON.parse(list).slice(0, 3)
        } catch (e) {
            return []
        }
    }

    render() {
        let {hasNewsList, commentDetailItem, showReportDialog, replyDetailDialog, newsInfo, newsList, commentList, latestComment, commentBox, commentText, name, content} = this.state
        let {onDismiss, navigation} = this.props
        return (
            <View style={styles.newsDetailStyle}>
                <NavBar backgroundType={false} leftBtn={false} fullScreen={true} showLogo={false}/>
                <ScrollView style={{flex: 1}}>
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
                        {/* <View style={{width: rpx(690), paddingBottom: rpx(30), fontSize: rpx(50), lineHeight: rpx(44)}}> */}
                            {/*<HTML allowFontScaling={false} html={newsInfo.properties ? newsInfo.properties.content : ''}*/}
                            {/*imagesMaxWidth={rpx(690)}/>*/}
                            {/*<WebView source={{uri: 'https://github.com/facebook/react-native'}}></WebView>*/}
                        {/* </View> */}
                        {
                            hasNewsList ? <Text style={common.recommendTitle}>精彩推荐</Text> : null
                        }
                    </View>
                    <View style={{width: rpx(750)}}>
                        <NewsItem newsList={newsList} loadMore={() => {
                        }} navigation={navigation}></NewsItem>
                    </View>
                    {
                        commentList && commentList.length > 0 ?
                            <Text style={[common.recommendTitle, {marginLeft: rpx(30), marginTop: rpx(30)}]}>
                                全部评论
                            </Text> : null
                    }

                    {/* <CommentItem
                        ref={'commentItem'}
                        commentList={commentList}
                        likeComment={this.likeComment.bind(this)}
                        openReportDialog={this.openReportDialog.bind(this)}
                        reportDetails={this.reportDetails.bind(this)}
                        showCommentBox={(e) => {
                            this.showCommentBox(e, 2)
                        }}
                        showCommentDetail={this.showCommentDetail.bind(this)}
                    /> */}
                </ScrollView>


                <View style={styles.bottomCommentBar}>
                    <TouchableOpacity onPress={() => {
                        this.showCommentBox(null, 1)
                    }}>
                        <Text style={styles.text1}>说点什么吧</Text>
                    </TouchableOpacity>
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
                </View>

                {/* <Report visible={showReportDialog}
                        ref={'reportComp'}
                        onDismiss={() => {
                            this.setState({showReportDialog: false})
                        }}>
                </Report> */}

                <ReplyDetail visible={replyDetailDialog}
                             showCommentBox={(e) => {
                                 this.showCommentBox(e, 3)
                             }}
                             commentDetailItem={commentDetailItem}
                             latestComment={latestComment}
                             likeComment={this.likeComment.bind(this)}
                             openReportDialog={this.openReportDialog.bind(this)}
                             onDismiss={() => {
                                 this.setState({replyDetailDialog: false})
                             }}>
                </ReplyDetail>


                <ExtModal animationType="fade" zIndex={999999} fullScreen={true} visible={commentBox}
                          onDismiss={() => {
                              this.setState({commentBox: false})
                          }}>
                    <View style={{flex: 1, flexDirection: 'column', position: 'absolute', bottom: rpx(500)}}>
                        <View style={{backgroundColor: 'blue', width: rpx(750), padding: rpx(20)}}>
                            <KeyboardAvoidingView
                                behavior="padding"
                                contentContainerStyle={{width: rpx(750)}}>
                                <Text style={{fontSize: rpx(20), marginBottom: rpx(10)}}>
                                    正在 &nbsp;<Text style={{fontWeight: 'bold'}}>{commentText}</Text>&nbsp;
                                    {name}
                                </Text>
                                <TextInput
                                    autoFocus={true}
                                    multiline={true}
                                    onChangeText={(text) => this.setState({content: text})}
                                    value={content}
                                    style={{paddingVertical: rpx(20),width: rpx(710),
                                         backgroundColor: 'red', height: rpx(80), fontSize: rpx(26)
                                    }}

                                />
                                <TouchableOpacity onPress={() => {
                                    this.issueContent()
                                }}>
                                    <Text style={{marginLeft: 'auto', color: content ? '#d8201d' : '#4f5664'}}>发布</Text>
                                </TouchableOpacity>
                            </KeyboardAvoidingView>
                        </View>
                    </View>
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
                            commentItem: commentItem
                        })
                    }


                })

            }
        })
        // sendPostRequest('/msgCheck', {data: data}, res => {
        //     if (JSON.parse(res.errcode !== 0)) {
        //         wx.showToast({ title: '内容违规' })
        //     } else {
        //
        //     }
        // })
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
        // if (wx.getStorageSync('userInfo').nickName === '匿名用户') {
        //     wx.navigateTo({url: '/pages/loginView/main?userType=0'})
        //     return
        // }
        // let phoneNumber = havePhoneNumber()
        // if (!phoneNumber) {
        //     wx.navigateTo({url: '/pages/loginView/main?userType=1'})
        //     return
        // }
        // **
        // this.commentType   0 - 回复评论   1 - 点击详情下方的评论按钮  2 -   点击评论的评论
        // */
        // console.log('111111111111111', item)
        // console.log('22222', type)
        this.setState({
            commentItem: item,
            commentBox: !this.state.commentBox,
            commentText: type ? '评论' : '回复',
            commentType: type
        }, () => {
            if (this.state.commentType === 0) {
                this.setState({
                    itemId: item.itemId,
                    name: item.name
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
        // console.log('showCommentDetail', this.state.replyDetailDialog)
        if (this.state.replyDetailDialog) {
            return
        }
        this.setState({
            commentDetailItem: [],
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
            let arr = []
            arr.push(item)
            this.setState({
                commentDetailItem: arr
            }, () => {
                this.getApi('/item/getCommentTopReply', {replyId: item.replyId}, ret => {
                    if (ret.errcode === 0) {
                        this.getApi('/item/getCommentOtherReply', {replyId: item.replyId}, res => {
                            if (res.errcode === 0) {
                                let results = ret.data.rows.concat(res.data.rows)
                                results.map(item => {
                                    if (!item.Like.length) {
                                        item.Like.push({
                                            isLike: 0
                                        })
                                    }
                                    item.time = timePeriod(item.createTime)
                                })
                                this.setState({
                                    latestComment: results
                                })
                            }
                        })
                    }
                })
            })

            // console.log('latestComment =================', this.state.latestComment)
            // console.log('latestComment =================', this.state.commentDetailItem)
        })
    }

    openReportDialog = () => {
        this.setState({
            showReportDialog: true
        })
    }

    reportDetails = (it) => {
        console.log('reportDetails', it)
    }

    selectTab = (type) => {
        if (this.state.tabType === type) {
            return
        }
        this.setState({
            tabType: type
        })
    }
}

const styles = StyleSheet.create({
    newsDetailStyle: {
        width: rpx(750),
        flex: 1,
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
        width: rpx(750),
        height: rpx(98),
        backgroundColor: 'white',
        paddingVertical: rpx(20),
        paddingHorizontal: rpx(30),
        position: 'absolute',
        bottom: 0,
        left: 0,
        zIndex: 99,
        flexDirection: 'row'
    },
    text1: {
        width: rpx(390),
        height: rpx(58),
        backgroundColor: '#f3f6fa',
        borderRadius: rpx(26),
        lineHeight: rpx(58),
        paddingLeft: rpx(30)
    },
    icon2: {
        width: rpx(40),
        height: rpx(40),
    }
})
