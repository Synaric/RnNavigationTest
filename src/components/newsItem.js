import React from 'react'
import {
    FlatList,
    Image,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    ScrollView,
    RefreshControl
} from 'react-native'
import {rpx} from '../utils/adapter'
import {imgHeader} from '../utils/config'
import PropTypes from 'prop-types'
import {common} from '../style/common'
import {formatFloat} from '../utils/arts'
import navigationService from '../utils/navigationService'

/**
 * author - Money
 * params -
 * @ showType: 2     = 大图
 * @ showType: 1     = 右侧小图
 * @ showType: 0     = 一般模式 三图分布 list 遍历
 */
export default class NewsItem extends React.Component {
    static propTypes = {
        newsList: PropTypes.array,
        itemCategoryId: PropTypes.number
    }

    static defaultProps = {
        itemCategoryId: 0
    }

    constructor (props) {
        super(props)
        this.state = {
            refreshing: false
        }
    }

    skipToNewsDetail = (item) => {
        console.log(item.itemId)
        this.props.navigation.push('NewsDetail', {itemId: item.itemId})
    }

    skipToVideoDetail = (item) => {
        console.log(item.itemId)
        this.props.navigation.push('VideoDetail', {itemId: item.itemId})
    }

    skipToEdIntroduce (item) {
        console.log(item)
        navigationService.navigate('EdIntroduce', {userId: item.UserInfo ? item.UserInfo.distinctId : 0})
    }

    // callBackFunction = () => {
    //     this.props.refreshData()
    // }

    subscribeEd = (item) => {
        this.props.subscribeEd(item)
    }


    renderNewsItem (item, index) {
        let {newsList, navigation} = this.props
        return (
            item.itemTypeId === 1 ?
                <TouchableOpacity key={index}
                                  style={[styles.itInnerBlock]}
                                  onPress={() => {
                                      this.skipToNewsDetail(item)
                                      console.log(navigation)
                                      // navigation.navigate('NewsDetail', {itemId: item.itemId})
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
                                (item.picList && item.picList.length ? <View style={styles.newsPicList}>
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
                </TouchableOpacity> : 
                // 课程
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
            
            //     </View>
            // </TouchableOpacity> : null
        )
    }

    _renderFooter () {
        let {canLoadMore, newsList} = this.props
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
        let {newsList} = this.props
        return (
            <FlatList
                contentContainerStyle={{justifyContent: 'center'}}
                style={styles.itContainer}
                showsVerticalScrollIndicator={false}
                data={newsList}
                renderItem={({item, index}) => (
                    this.renderNewsItem(item, index)
                )}
                ListFooterComponent = {this._renderFooter.bind(this)}//渲染底部组件
                // refreshing={true}
                // refreshControl={
                //     <RefreshControl
                //         refreshing={this.state.refreshing}
                //         colors={['#ff0000', '#00ff00', '#0000ff']}
                //         progressBackgroundColor={'#ffffff'}
                //         onRefresh={() => {
                //             this._onRefresh()
                //         }}
                //     />
                // }
                onEndReached={() => {
                    this.loadMore()
                }}
                onEndReachedThreshold={0.2}
            >
            </FlatList>
        )
    }

    loadMore = () => {
        console.log(123123123123)
        this.props.loadMore()
    }

    _onRefresh = () => {
        console.log(22222222222222)
        this.props._onRefresh()
    }
}

// render() {
//     let {itemData} = this.props;
//     return (
//         <TouchableOpacity style={styles.container} onPress={this.onPressItem}>
//             <Image style={[styles.goodsPic, {position: 'absolute', left: rpx(12), top: rpx(22)}]} source={{uri: itemData.photo}} />
//             <Text style={[styles.goodsName, {position: 'absolute', left: rpx(20), top: rpx(350)}]} numberOfLines={2}>{itemData.goods_name}</Text>
//             <Text style={{position: 'absolute', left: rpx(20), bottom: rpx(32), color: 'red', fontSize: rpx(26)}}>￥</Text>
//             <Text style={{position: 'absolute', left: rpx(50), bottom: rpx(32), color: 'red', fontSize: rpx(36)}}>{formatFloat(itemData.true_price / 100, 2)}</Text>
//             <Text style={{position: 'absolute', right: rpx(20), bottom: rpx(32), color: '#787878', fontSize: rpx(26)}}>已售{itemData.sales}{itemData.goods_unit}</Text>
//         </TouchableOpacity>
//     )
// }
// }


const styles = StyleSheet.create({
    itContainer: {
        flexDirection: 'column'
    },
    itInnerBlock: {
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
    courseItemBlock: {
        width: rpx(690),
        height: rpx(220),
        padding: rpx(30),
        marginHorizontal: rpx(30),
        marginVertical: rpx(10),
        backgroundColor: '#ffffff',
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
})
