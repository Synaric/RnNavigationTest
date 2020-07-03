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
    FlatList, ActivityIndicator, Dimensions
} from 'react-native'
import Base from '../components/base'
import NavBar from '../components/navBar'
import Banner from '../components/banner'
import {PullView} from 'react-native-pull'
import A from '../components/titleText'
import {deviceHeight, rpx} from '../utils/adapter'
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
import {common} from '../style/common'

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
            pageNum: 1,
            pageSize: 10,
            newsList: [],
            categoryList: [],
            categoryItem: {},
            allChannel: [],
            myChannel: [],
            articles: [],
            bannerList: [],
            courseList: [],
            videoInfo: null,
            showMoreChannelDialog: false,
            refreshing: false,
            canLoadMore: true
        }
        this.onPullRelease = this.onPullRelease.bind(this)
        this.topIndicatorRender = this.topIndicatorRender.bind(this)
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
        console.log('aasdasdasdas')
        let params = {
            itemCategoryId: 2
        }
        console.log('refreshing', this.state.refreshing)
        this.getApi('/item/getCategoryTopItems', params, (res) => {
            if (res.errcode === 0) {
                let results = this.reductionData(res.data ? res.data : [], 1)
                console.log('getCategoryTopItems', results)
                this.setState({
                    newsList: results,
                    canLoadMore: true
                }, () => {
                    this.getCategoryItems(1, this.state.pageSize, results)
                })
            }
        })
    }

    getCategoryItems (pageNum, pageSize, newsList) {
        console.log('loadMore', this.state.canLoadMore)
        if (!this.state.canLoadMore) {
            return
        }
        let params = {
            appRuleId: 2,
            itemCategoryId: 2,
            start: (pageNum - 1) * 10,
            length: pageSize
        }
        this.getApi('/item/getCategoryItems', params, (res) => {
            if (res.errcode === 0) {
                let results = this.reductionData(res.data ? res.data : [], 0)
                this.setState({newsList: newsList.concat(results)})
                this.setState({canLoadMore: results && results.length >= pageSize, pageNum: pageNum + 1})
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
                style={{width: rpx(750), height: rpx(220), paddingLeft: rpx(30)}}
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

    renderNewsItem (item, index) {
        return (
            item.itemTypeId === 1 ?
                <TouchableOpacity key={index}
                                  style={[styles.itInnerBlock]}
                                  onPress={() => {
                                      this.skipToNewsDetail(item)
                                  }}>
                    {/* 文章关注 */}
                    {/*{*/}
                    {/*item.UserInfo.User.isFollowable ?*/}
                    {/*<View style={styles.subscribeBlock}>*/}
                    {/*<View style={styles.edFace}>*/}
                    {/*<TouchableOpacity onPress={() => {*/}
                    {/*this.skipToEdIntroduce(item)*/}
                    {/*}}>*/}
                    {/*<Image style={{*/}
                    {/*width: rpx(80),*/}
                    {/*height: rpx(80),*/}
                    {/*borderRadius: rpx(40)*/}
                    {/*}} source={{uri: item.UserInfo.User.face}}/>*/}
                    {/*</TouchableOpacity>*/}
                    {/*</View>*/}
                    {/*<View style={styles.edDetails}>*/}
                    {/*<Text style={styles.edName}>{item.UserInfo.User.nickName}</Text>*/}
                    {/*<Text style={styles.edIntrod}>{item.UserInfo.User.intro}</Text>*/}
                    {/*</View>*/}
                    {/*<TouchableOpacity*/}
                    {/*onPress={() => {this.subscribeEd(item)}}>*/}
                    {/*<Text style={[item.subscribeStatus ? common.haveSubscribe : common.noSubscribe, {*/}
                    {/*width: rpx(134),*/}
                    {/*height: rpx(54),*/}
                    {/*textAlign: 'center',*/}
                    {/*lineHeight: rpx(54),*/}
                    {/*marginLeft: 'auto',*/}
                    {/*borderRadius: rpx(28),*/}
                    {/*fontSize: rpx(24),*/}
                    {/*letterSpacing: rpx(3)*/}
                    {/*}]*/}
                    {/*}>{item.subscribeStatus ? '已关注' : '关注'}</Text>*/}
                    {/*</TouchableOpacity>*/}
                    {/*</View> : null*/}
                    {/*}*/}

                    {/* 文章标题*/}
                    <View style={{position: 'relative'}}>
                        <View
                            style={item.showType === 1 ? styles.newsTitle1 : styles.newsTitle}>
                            <Text numberOfLines={2} style={{lineHeight: rpx(40)}}>
                                {item.isTop ?
                                    <Text style={styles.newsIsTop}>置顶&nbsp;&nbsp;&nbsp;</Text>
                                    : null}
                                {item.title ? item.title : item.itemName}</Text>
                        </View>
                        {/* 文章图片*/}
                        {
                            item.showType === 0 ?
                                (item.picList ? <View style={styles.newsPicList}>
                                    <View style={styles.newsPicItem}>
                                        {
                                            item.picList && item.picList.map((itPic, index) => (
                                                <Image style={styles.newsPicStyle1}
                                                       source={{uri: itPic}}/>
                                            ))
                                        }
                                    </View>
                                </View> : null)
                                :
                                (item.pic && item.picList ? <Image
                                    style={[styles.newsPicStyle, item.showType === 2 ? styles.newsBanner : styles.newsSurface]}
                                    source={item.showType === 1 ? {uri: item.picList[0]} : {uri: item.pic}}/> : null)

                        }
                        {/* 文章评论 点赞 浏览 and 文章出处*/}
                        <View style={item.showType == 1 ? styles.newsData : {
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            <Text style={styles.newsThumb}>{item.adjectives}</Text>
                            <Text style={styles.newsProvenance}>{!item.UserInfo.User.isFollowable ?
                                <Text>{item.author}&nbsp;</Text> : null} {item.time}</Text>
                        </View>
                    </View>
                </TouchableOpacity> : null
            // item.itemTypeId === 3 ?
            // <TouchableOpacity
            //     onPress={() => {
            //         this.skipToVideoDetail(item)
            //     }}
            //     style={[styles.itInnerBlock, {flexDirection: 'row'}]}>
            //     <Image style={styles.coursePic}
            //            source={{uri: item.pic}}/>
            //     <View style={{flex: 1, paddingTop: rpx(20), paddingBottom: rpx(25)}}>
            //         <Text numberOfLines={1} style={styles.courseName}>{item.itemName}</Text>
            //         <Text numberOfLines={3} style={styles.courseDetail} >{item.detail}</Text>
            //         <View style={{marginTop: 'auto', flexDirection: 'row', justifyContent: 'space-between'}}>
            //             <Text style={{color: '#787878', fontSize: rpx(20)}}>{item.author}</Text>
            //             <Text style={{color: '#787878', fontSize: rpx(20)}}>浏览{item.ItemCount.viewCount}次</Text>
            //         </View>
            //
            //     </View>
            // </TouchableOpacity> : null
        )
    }

    skipToNewsDetail = (item) => {
        console.log(item.itemId)
        navigationService.navigate('NewsDetail', {itemId: item.itemId})
    }

    onPressBannerItem () {

    }

    _renderHeader () {
        let {bannerList} = this.state
        return (
            <View style={{flex: 1}}>
                <View style={{width: rpx(750), height: rpx(420)}}>
                <Banner banners={bannerList}></Banner>
                </View>
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
            </View>
        )
    }

    _renderFooter () {
        let {canLoadMore, newsList} = this.state
        return (
            <View>
                {
                    newsList && newsList.length ?   <Text style={common.listTips}>
                    {canLoadMore ? '正在加载中...' : '我是有底线的'}
                    </Text> : null
                }
            </View>
        )
    }

    render () {
        let {pageNum, pageSize, showMoreChannelDialog, categoryList, newsList, allChannel, myChannel, bannerList} = this.state
        let {navigation, addSub} = this.props
        return (

            <View style={styles.homeStyle}>
                {/*<TouchableOpacity onPress={this.props.minusSub()}>*/}
                {/*<Text>--------</Text>*/}
                {/*</TouchableOpacity>*/}
                
                <NavBar backgroundType={false} leftBtn={false} fullScreen={true} showLogo={true}/>
                {/*<ScrollView>*/}
                {/*<PullView style={{width: Dimensions.get('window').width}} onPullRelease={this.onPullRelease}*/}
                          {/*topIndicatorRender={this.topIndicatorRender} topIndicatorHeight={40}>*/}




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
                    
                    <FlatList
                        contentContainerStyle={{justifyContent: 'center'}}
                        style={styles.itContainer}
                        showsVerticalScrollIndicator={false}
                        data={newsList}
                        keyExtractor={(item,index) => '' + index}
                        ListHeaderComponent = {this._renderHeader.bind(this)}//渲染头部组件
                        ListFooterComponent = {this._renderFooter.bind(this)}//渲染底部组件
                        renderItem={({item, index}) => (
                            this.renderNewsItem(item, index)
                        )}
                        onEndReached={() => {
                            this.getCategoryItems(pageNum, pageSize, newsList)
                        }}
                        onEndReachedThreshold={0.3}
                        refreshing={true}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                colors={['#ff0000', '#00ff00', '#0000ff']}
                                progressBackgroundColor={'#ffffff'}
                                onRefresh={() => {
                                    this.getCategoryTopItems()
                                }}
                            />
                        }
                    >
                    </FlatList>

                    {/*<NewsItem*/}
                    {/*navigation={navigation}*/}
                    {/*newsList={newsList}*/}
                    {/*itemCategoryId={categoryItem.ItemCategory ? categoryItem.ItemCategory.itemCategoryId : 0}*/}
                    {/*loadMore={this.getCategoryItems.bind(this)}*/}
                    {/*_onRefresh={this.getCategoryTopItems.bind(this)}*/}
                    {/*subscribeEd={this.subscribeEd.bind(this)}*/}
                    {/*>*/}
                    {/*</NewsItem>*/}

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
                {/*</PullView>*/}

                {/*</ScrollView>*/}
            </View>
        )
    }

    show () {
        // this.props.addSub()
    }

    onPullRelease (resolve) {
        //do something
        setTimeout(() => {
            resolve()
        }, 3000)
    }

    topIndicatorRender (pulling, pullok, pullrelease) {
        const hide = {position: 'absolute', left: 10000}
        const show = {position: 'relative', left: 0}
        setTimeout(() => {
            if (pulling) {
                this.txtPulling && this.txtPulling.setNativeProps({style: show})
                this.txtPullok && this.txtPullok.setNativeProps({style: hide})
                this.txtPullrelease && this.txtPullrelease.setNativeProps({style: hide})
            } else if (pullok) {
                this.txtPulling && this.txtPulling.setNativeProps({style: hide})
                this.txtPullok && this.txtPullok.setNativeProps({style: show})
                this.txtPullrelease && this.txtPullrelease.setNativeProps({style: hide})
            } else if (pullrelease) {
                this.txtPulling && this.txtPulling.setNativeProps({style: hide})
                this.txtPullok && this.txtPullok.setNativeProps({style: hide})
                this.txtPullrelease && this.txtPullrelease.setNativeProps({style: show})
            }
        }, 1)
        return (
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 40}}>
                <ActivityIndicator size="small" color="gray"/>
                <Text ref={(c) => {
                    this.txtPulling = c
                }}>下拉刷新...</Text>
                <Text ref={(c) => {
                    this.txtPullok = c
                }}>松开刷新......</Text>
                <Text ref={(c) => {
                    this.txtPullrelease = c
                }}>玩命刷新中......</Text>
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
    },
    itContainer: {
        width: rpx(750),
        flexDirection: 'column'
    },
    itInnerBlock: {
        width: rpx(690),
        marginHorizontal: rpx(30),
        marginVertical: rpx(10),
        padding: rpx(30),
        backgroundColor: 'white',
        borderRadius: rpx(20),
        position: 'relative'
    },
    subscribeBlock: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: rpx(25),
        alignItems: 'center',
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
        flex: 1,
        fontSize: rpx(26),
        fontWeight: 'bold',
        color: '#313332',
    },
    edIntrod: {
        fontSize: rpx(20),
        color: '#787878',
        lineHeight: rpx(30)
    },
    edSubscribe: {},
    newsTitle1: {
        width: rpx(404),
        marginBottom: rpx(30),
        minHeight: rpx(88)
    },
    newsTitle: {
        fontSize: rpx(28),
        fontWeight: 'bold',
        color: '#00070f',
        lineHeight: rpx(22),
        marginBottom: rpx(25)
    },
    newsIsTop: {
        width: rpx(70),
        fontSize: rpx(28),
        fontWeight: 'bold',
        color: '#ed161c'
    },
    newsPicList: {
        flex: 1,
        marginBottom: rpx(30),
        flexDirection: 'row'
    },
    newsPicItem: {
        width: rpx(196),
        height: rpx(146),
        borderRadius: rpx(20),
        flex: 1,
        flexDirection: 'row'
    },
    newsPicStyle1: {
        width: rpx(196),
        height: rpx(146),
        marginRight: rpx(20),
        borderRadius: rpx(10),
        backgroundColor: 'black'
    },
    newsData: {
        width: rpx(404),
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    newsThumb: {
        fontSize: rpx(20),
        color: '#b1b1b1'
    },
    newsProvenance: {
        fontSize: rpx(20),
        color: '#4f5661'
    },
    newsBanner: {
        width: rpx(630),
        height: rpx(470),
        marginBottom: rpx(30)
    },
    newsSurface: {
        position: 'absolute',
        top: rpx(0),
        right: rpx(0),
        width: rpx(196),
        height: rpx(146)
    },
    newsPicStyle: {
        borderRadius: rpx(10),
    },
    // coursePic: {
    //     width: rpx(220),
    //     height: rpx(220),
    //     borderRadius: rpx(20),
    //     marginRight: rpx(28)
    // },
    // courseName: {
    //     color: '#313332',
    //     fontWeight: 'bold',
    //     fontSize: rpx(26),
    // },
    courseDetail: {
        color: '#787878',
        fontSize: rpx(20),
        marginTop: rpx(17),
        lineHeight: rpx(30)
    }
})

const mapStateToProps = state => ({
    subArr: state.subArr.haveOrNoSub
})

export default connect(mapStateToProps, {addSub, minusSub})(Home)
