import React from 'react'
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    RefreshControl,
    AsyncStorage,
    FlatList
} from 'react-native'
import Base from '../components/base'
import NavBar from '../components/navBar'
import Banner from '../components/banner'
import A from '../components/titleText'
import {rpx} from '../utils/adapter'
import {imgHeader} from '../utils/config'
import {timeStampToTime} from '../utils/arts'
import navigationService from '../utils/navigationService'
import CategoryItem from '../components/categoryItem'
import NewsItem from '../components/newsItem'
import MoreChannel from '../components/moreChannel'
import Report from '../components/report'
import {thumbAndCommentAndBrowser, timePeriod, URL} from '../utils/utils'
import {addSub, minusSub} from '../store/actions'
import {connect} from 'react-redux'

class Home extends Base {
    resolveStatusBar () {
        return {
            barStyle: 'dark-content',
            backgroundColor: 'transparent',
            translucent: true
        }
    }

    created () {
        this.state = {
            banners: [],
            pageNum: 0,
            newsList: [],
            categoryList: [],
            categoryItem: {},
            allChannel: [],
            myChannel: [],
            articles: [],
            bannerList: [],
            courseList: [],
            videoInfo: null,
            showMoreChannelDialog: false
        }
    }

    mounted () {
        // this.props.addSub = this.props.addSub.bind(this)
        // this.props.minusSub = this.props.minusSub.bind(this)
        // this.getMySubscribe()
        // this.getMyCategory()
        // this.getAllChannel()
        // this.getPromoVideo();
        // this.getArticles();
        this.getCategoryTopItems()
        this.getActivity()
        // this.getCategoryItems()
    }

    getMySubscribe () {
        this.getApi(`/user/getFollow`, {}, res => {
            console.log('getFollow', res)
            if (res.errcode === 0) {
                let data = []
                if (res.data.rows.length) {
                    data = res.data.rows.map(item => {
                        return item.FollowUser.userId
                    })
                }
                console.log('getFollow  mySubscribemySubscribemySubscribe', data)
                AsyncStorage.setItem('mySubscribe', JSON.stringify(data))
            }
        })
    }

    onNetworkConnected () {
        // this.getBanners();
        // this.getPromoVideo();
        // this.getArticles();
    }

    getMyCategory () {
        this.getApi('/user/getMyCategory', {ruleType: 1}, (res) => {
            console.log('getMyCategory', res)
            if (res.errcode === 0) {
                this.setState({
                    categoryList: res.data.rows,
                    categoryItem: res.data.rows[1]
                }, () => {
                    this.getCategoryTopItems()
                })
                // this.getNewsList()
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

    getArticlesLimit (pageNum, pageSize, articleList) {
        let params = {
            page_num: this.state.pageNum,
            page_size: this.state.pageSize
        }
        this.postApi('users/get_all_articles', params, (res) => {
            if (res.code === 0) {
                let results = res.results
                if (pageNum === 0) {
                    this.setState({articleList: []}, () => {
                        this.setState({articleList: results})
                    })
                } else {
                    this.setState({articleList: articleList.concat(results)})
                }
                this.setState({loadMore: results && results.length >= pageSize, pageNum: pageNum + 1})
            }
        })
    }

    // 用户优化 列表每个Item的渲染速度 故再做一次处理 将无用的数据剔除
    reductionData (data, type) {
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
                isTop: type,
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

    formateData (data, flag) {
        data && data.map(item => {
            item.defPic = 'https://weixinfactory.di1game.com/web/header-images/logo.png'
            item.UserInfo = item.UserInfo ? item.UserInfo : {User: {}}

            AsyncStorage.getItem('mySubscribe', (error, results) => {
                console.log('AsyncStorageAsyncStorageAsyncStorageAsyncStorage', results)
                item.subscribeStatus = JSON.parse(results).indexOf(item.UserInfo ? item.UserInfo.User.userId : -1) === -1 ? 0 : 1
            })
            // item.subscribeStatus = AsyncStorage.getItem('mySubscribe', (results) => {
            //     console.log('AsyncStorageAsyncStorageAsyncStorageAsyncStorage', results)
            //     // results.indexOf(item.UserInfo ? item.UserInfo.User.userId : -1) === -1 ? 0 : 1
            // })
            item.isTop = flag
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
        console.log('formateData', data)
        return data
    }

    getActivity () {
        console.log('/123123123123123/')
        let params = {
            start: 0,
            length: 10
        }
        this.getApi('/item/getActivity', params, res => {
            console.log('/item/getActivity', res)
            if (res.errcode === 0) {
                let courseList = res.data.rows.filter(item => {
                    return item.itemTypeId === 3
                })
                let bannerList = res.data.rows.filter(item => {
                    return item.itemTypeId === 5
                })
                console.log('/item/getActivity', courseList)
                this.setState({
                    courseList: courseList,
                    bannerList: bannerList
                })
            }

        })
    }

    getCategoryTopItems () {
        let params = {
            // appRuleId: this.state.categoryItem.ItemCategory.appRuleId,
            itemCategoryId: 2
        }
        this.getApi('/item/getCategoryTopItems', params, (res) => {
            if (res.errcode === 0) {
                let results = this.formateData(res.data ? res.data : [], 1)
                console.log('getCategoryTopItems', results)
                this.setState({
                    newsList: results,
                }, () => {
                    this.getCategoryItems()
                })
            }
        })
    }

    getCategoryItems () {
        console.log('loadMore')
        let params = {
            appRuleId: 2,
            itemCategoryId: 2
        }
        this.getApi('/item/getCategoryItems', params, (res) => {
            if (res.errcode === 0) {
                let results = this.reductionData(res.data ? res.data : [], 0)
                console.log('getCategoryItems1 =====', results)
                console.log('getCategoryItems2 =====', this.state.newsList)
                let a = this.state.newsList.concat(results)
                console.log('getCategoryItems111 =====', a)
                this.setState({
                    newsList: a
                })
            }
        })
    }

    subscribeEd (item) {
        console.log('subscribeEd==========', item)
        // navigationService.navigate('loginView', {})
        // console.log(123123123123123)
        // return
        // AsyncStorage.getItem('userInfo', (error, result) => {
        //     console.log('resultresultresult', result)
        //     let status = JSON.parse(result).nickName
        //     console.log('statusstatusstatusstatusstatus', status)
        //     if (status == '匿名用户') {
        //         console.log('statusstatusstatusstatusstatus2222222', status)
        //         navigationService.navigate('loginView', {})
        //     }
        //     return
        // })
        let isSubscribe = item.subscribeStatus
        let path = isSubscribe ? 'unFollow' : 'follow'
        this.postApi(`/user/${path}`, {followUserId: item.UserInfo.distinctId}, res => {
            console.log(res)
            console.log(1111111111)
            if (res.errcode === 0) {
                let list = this.state.newsList
                list.map(it => {
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
                        console.log('123123123123123', JSON.parse(results))
                    })
                    console.log('22222222222')

                })

                this.toast(
                    item.subscribeStatus ? '关注成功' : '取消关注'
                )
                this.setState({
                    newsList: list
                })
            }
        })
    }

    getAllChannel () {
        this.getApi('/user/getAllCategory', {ruleType: 1}, (res) => {
            console.log('getAllCategory', res)
            if (res.errcode === 0) {
                let allChannel = res.data.rows.filter(item => {
                    return item.isOnline !== 1
                })
                let myChannel = res.data.rows.filter(item => {
                    return item.isOnline === 1
                })
                this.setState({
                    allChannel: allChannel,
                    myChannel: myChannel
                })
            }
        })
    }

    skipToDetail (item) {
        switch (Number(item.type)) {
            case 0:
                navigationService.navigate('GoodsDetail', {goodsId: item.data_id})
                break
            case 1:
                navigationService.navigate('HotelDetail',
                    {
                        hotelsId: item.data_id,
                        startTime: new Date(new Date().toLocaleDateString()).getTime(),
                        endTime: new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000
                    })
                break
            case 2:
                navigationService.navigate('TicketDetail', {ticketsId: item.data_id})
                break
        }
    }

    getBanners () {
        this.postApi('users/get_all_home_items', {}, res => {
            if (res.code === 0) {
                this.setState({banners: res.results})
            }
        })
    }

    getPromoVideo () {
        this.postApi('users/get_promotional_video', {}, res => {
            if (res.code === 0) {
                let r = res.results
                r.video_url = imgHeader + r.video_url
                r.poster = imgHeader + r.poster
                this.setState({videoInfo: res.results})
            }
        })
    }

    getArticles () {
        this.postApi('users/get_all_articles', {page_num: 0, page_size: 10}, res => {
            if (res.code === 0) {
                let r = res.results.filter(it => (it.is_best === 1))
                    .map(it => {
                        it.create_time = timeStampToTime(new Date(it.create_time * 1000), 1)
                        return it
                    })
                this.setState({articles: r})
            }
        })
    }

    skipToArticleDetails = (item) => {
        if (Number(item.link_type) === 0) {
            navigationService.navigate('ArticleDetail', {articleId: item.article_id})
            return
        }
        navigationService.navigate('WebViewPage', {url: item.skip_url})
    }

    // renderBanners () {
    //     let {bannerList} = this.state
    //     return (
    //         bannerList.map((it, index) => (
    //             <TouchableOpacity style={{width: rpx(750), height: rpx(360), backgroundColor: '#f2f2f2'}} key={index}
    //                               onPress={() => {
    //                                   this.skipToDetail(it)
    //                               }}>
    //                 <Image style={{width: rpx(750), height: rpx(360), backgroundColor: '#f2f2f2'}} key={index}
    //                        source={{uri: imgHeader + it.poster}}/>
    //             </TouchableOpacity>
    //         ))
    //     )
    // }

    skipToVideoDetail (item) {
        navigationService.navigate('VideoDetail', {itemId: item.itemId})
    }

    renderCourseItem (item, index) {
        let {newsList, navigation} = this.props
        return (
            <TouchableOpacity style={styles.courseItemBlock} onPress={() => {
                this.skipToVideoDetail(item)
                // navigation.navigate('NewsDetail', {itemId: item.itemId})
            }}>
                <View style={styles.courseItem}>
                    <View style={styles.redDiv}></View>
                    <Text numberOfLines={2} style={styles.courseName}>{item.itemName}</Text>
                    <Image style={styles.coursePic} source={{uri: item.properties.pic}}></Image>
                    <Image style={styles.moreCourseDetail}
                           source={{uri: 'https://weixinfactory.di1game.com/jinmai/Icon/20200408/184719/58f0ac349681ea05fa2930cee928065c.jpg'}}></Image>
                </View>
            </TouchableOpacity>
        )
    }

    renderCourseList () {
        let {courseList} = this.state
        return (
            <FlatList
                style={{width: rpx(750), paddingLeft: rpx(30)}}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                data={courseList}
                renderItem={({item, index}) => (
                    this.renderCourseItem(item, index)
                )}
            >
            </FlatList>
        )
    }

    show () {
        // this.props.addSub()
    }

    render () {
        let {videoInfo, categoryItem, showMoreChannelDialog, categoryList, newsList, allChannel, myChannel, bannerList} = this.state
        let {navigation, addSub} = this.props
        return (
            <View style={styles.homeStyle}>
                {/*<TouchableOpacity onPress={this.props.minusSub()}>*/}
                {/*<Text>--------</Text>*/}
                {/*</TouchableOpacity>*/}
                <NavBar backgroundType={false} leftBtn={false} fullScreen={true} showLogo={true}/>
                <ScrollView>
                    <Banner banners={bannerList}></Banner>
                    <View style={styles.tipsWordStyle}>
                        <View style={[{position: 'relative'}, styles.tipsWordStyle]}>
                            <Text style={styles.tipsWord}>推荐</Text>
                            <View style={{
                                marginHorizontal: rpx(6),
                                width: rpx(6),
                                height: rpx(6),
                                backgroundColor: 'black',
                                borderRadius: rpx(3)
                            }}></View>
                            <Text style={styles.tipsWord}>课程
                            </Text>
                        </View>
                        <View style={styles.bottomLine}></View>
                    </View>

                    {this.renderCourseList()}

                    <View style={styles.tipsWordStyle}>
                        <View style={[{position: 'relative'}, styles.tipsWordStyle]}>
                            <Text style={styles.tipsWord}>推荐</Text>
                            <View style={{
                                marginHorizontal: rpx(6),
                                width: rpx(6),
                                height: rpx(6),
                                backgroundColor: 'black',
                                borderRadius: rpx(3)
                            }}></View>
                            <Text style={styles.tipsWord}>资讯
                            </Text>
                        </View>
                        <View style={styles.bottomLine}></View>
                    </View>
                    {/*<A a={'课程'}></A>*/}
                    {/*<CategoryItem categoryList={categoryList} showMoreChannel={true} selectCate={this.selectCate.bind(this)}*/}
                    {/*openChannelDialog={this.openChannelDialog.bind(this)}/>*/}
                    {/*<Text>{this.props.subArr}</Text>*/}
                    {/*<TouchableOpacity onPress={ () => {this.props.addSub()}}>*/}
                    {/*<Text>++++++++</Text>*/}
                    {/*</TouchableOpacity>*/}
                    {/*<TouchableOpacity onPress={ () => {this.props.minusSub()}}>*/}
                    {/*<Text>--------</Text>*/}
                    {/*</TouchableOpacity>*/}
                    <NewsItem
                        navigation={navigation}
                        newsList={newsList}
                        itemCategoryId={categoryItem.ItemCategory ? categoryItem.ItemCategory.itemCategoryId : 0}
                        loadMore={this.getCategoryItems.bind(this)}
                        _onRefresh={this.getCategoryTopItems.bind(this)}
                        subscribeEd={this.subscribeEd.bind(this)}
                    >
                    </NewsItem>

                    <MoreChannel visible={showMoreChannelDialog}
                                 editStatus={false}
                                 allChannel={allChannel}
                                 myChannel={myChannel}
                                 minusChannel={this.minusChannel}
                                 addChannel={this.addChannel}
                                 onDismiss={() => {
                                     this.setState({showMoreChannelDialog: false})
                                 }}>>
                    </MoreChannel>
                </ScrollView>
            </View>
        )
    }

    minusChannel = (it, index) => {
        console.log('minusChannel === minusChannel ', it, index)
        let params = {
            itemCategoryId: it.ItemCategory.itemCategoryId,
            ruleType: 1
        }
        this.postApi('/user/removeCategory', params, res => {
            if (res.errcode === 0) {
                console.log('removeCategory', res)
                // 不关心返回结果，提升流畅度
                // this.myChannel.push(item)
                // this.allChannel.splice(index, 1)
            }
        })
        let {myChannel, allChannel} = this.state
        myChannel.splice(index, 1)
        allChannel.push(it)
        this.setState({
            myChannel: myChannel,
            allChannel: allChannel,
            categoryList: myChannel
        })
    }

    addChannel = (it, index) => {
        console.log('addChannel === addChannel ', it, index)
        let params = {
            itemCategoryId: it.ItemCategory.itemCategoryId,
            ruleType: 1
        }
        this.postApi('/user/addCategory', params, res => {
            if (res.errcode === 0) {
                console.log('addCategory', res)
                // 不关心返回结果，提升流畅度
                // this.myChannel.splice(index, 1)
                // this.allChannel.unshift(item)
            }
        })
        let {myChannel, allChannel} = this.state
        allChannel.splice(index, 1)
        myChannel.push(it)
        this.setState({
            myChannel: myChannel,
            allChannel: allChannel,
            categoryList: myChannel
        })
    }

    openChannelDialog () {
        console.log(this.state.showMoreChannelDialog)
        this.setState({showMoreChannelDialog: true})
    }

    selectCate (idx) {
        this.setState({
            currentTab: idx,
            categoryItem: this.state.categoryList[idx]
        }, () => {
            this.getCategoryTopItems()
        })
    }
}

const styles = StyleSheet.create({
    homeStyle: {
        backgroundColor: '#fafcfd',
        flex: 1
    },
    subHeader: {
        width: rpx(750),
        height: rpx(110),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: rpx(30)
    },
    title: {
        fontSize: rpx(32),
        color: 'black',
        flex: 1
    },
    article: {
        width: rpx(750),
        height: rpx(360),
        position: 'relative',
        marginBottom: rpx(30)
    },
    articlePoster: {
        width: rpx(750),
        height: rpx(360),
        position: 'absolute'
    },
    articleInfo: {
        width: rpx(750),
        paddingHorizontal: rpx(20),
        paddingTop: rpx(30),
        paddingBottom: rpx(15),
        flexDirection: 'column',
        backgroundColor: 'rgba(23, 137, 76, 0.5)',
        position: 'absolute',
        bottom: 0
    },
    tipsWordStyle: {
        flex: 1,
        flexDirection: 'row',
        width: rpx(750),
        // height: rpx(100),
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: rpx(10)
    },
    tipsWord: {
        fontSize: rpx(28),
        fontWeight: '500'
    },
    bottomLine: {
        position: 'absolute',
        zIndex: -1,
        bottom: rpx(22),
        width: rpx(130),
        height: rpx(6),
        backgroundColor: 'red'
    },
    courseItemBlock: {
        width: rpx(500),
        height: rpx(220),
        padding: rpx(30),
        backgroundColor: '#ffffff',
        marginRight: rpx(30),
    },
    courseItem: {
        flex: 1,
        // boxShadow: rpx(1) rpx(2) rpx(15) 0px,
        // rgba(77, 76, 76, 0.16);
        borderRadius: rpx(12),
        position: 'relative',
    },
    redDiv: {
        width: rpx(4),
        height: rpx(26),
        backgroundColor: '#d3251c',
        position: 'absolute',
        top: rpx(0),
    },
    courseName: {
        width: rpx(204),
        position: 'absolute',
        top: rpx(0),
        left: rpx(20)
    },
    coursePic: {
        width: rpx(160),
        height: rpx(160),
        // box-shadow: 0px 0px 10px 0px
        // rgba(0, 0, 0, 0.19);
        borderRadius: rpx(12),
        position: 'absolute',
        right: rpx(0),
        top: rpx(0),
    },
    moreCourseDetail: {
        width: rpx(155),
        height: rpx(41),
        // box-shadow: 0px 0px 10px 0px
        // rgba(0, 0, 0, 0.19);
        position: 'absolute',
        left: rpx(50),
        bottom: rpx(0),
    }
})

const mapStateToProps = state => ({
    subArr: state.subArr.haveOrNoSub
})

export default connect(mapStateToProps, {addSub, minusSub})(Home)
