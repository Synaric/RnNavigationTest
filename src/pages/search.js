import React from 'react'
import Base from '../components/base'
import {AsyncStorage, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {rpx, titleHeight} from '../utils/adapter'
import NavBar from '../components/navBar'
import NewsItem from '../components/newsItem'
import {thumbAndCommentAndBrowser, timePeriod, URL} from '../utils/utils'

export default class Search extends Base {
    resolveStatusBar () {
        return {
            barStyle: 'dark-content',
            backgroundColor: 'transparent',
            translucent: true
        }
    }


    created () {
        this.textInput = null
        this.state = {
            searchKey: null,
            showHistory: true,
            searchHistory: [],
            goodsList: [],
            pageNum: 1,
            pageSize: 10,
            canLoadMore: true,
            newsList: [],
            hasNewsList: true,
            categoryItem: {},
        }
    }

    mounted () {
        AsyncStorage.getItem('searchHistory', (err, v) => {
            if (!v) return
            this.setState({searchHistory: JSON.parse(v)})
        })
    }

    onClickSearch (text) {
        this.setState({
            hasNewsList: true,
            canLoadMore: true,
            pageNum: 1,
            searchKey: text
        }, () => {
            this.getSearch()
        })
    }

    getSearch () {
        let {searchKey} = this.state
        console.log('111111111111')
            if (!searchKey) {
                this.toast('请输入搜索的商品名称')
                return
            }
            // this.textInput ? this.textInput.blur() : null
            this.saveToHistory(searchKey)
            this.getNewsList(true)
            this.setState({showHistory: false})
    }

    getNewsList (refresh) {
        console.log('loadMore news item')
        let {pageNum, pageSize, newsList} = this.state
        if (refresh) {
            pageNum = 1
            this.setState({pageNum: pageNum}, () => {
                this.getNewsListInner(pageNum, pageSize, newsList)
            })
        } else {
            this.getNewsListInner(pageNum, pageSize, newsList)
        }
    }

    getPicList (list) {
        try {
            return JSON.parse(list).slice(0, 3)
        } catch (e) {
            return []
        }
    }

    // 用户优化 列表每个Item的渲染速度 故再做一次处理 将无用的数据剔除
    reductionData (data) {
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
                pic: item.properties.pic.startsWith('https') ? item.properties.pic : (item.properties.pic ? URL + '/' + item.properties.pic : JSON.parse(item.properties.picList)[0]),
                link: item.properties.link ? URL + '/' + item.properties.link : '',
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

    getNewsListInner (pageNum, pageSize, newsList) {
        if (!this.state.canLoadMore) {
            return
        }
        let params = {
            start: (pageNum - 1) * 10,
            length: 10,
            search: this.state.searchKey
        }
        console.log('/item/search111', params, this.state.canLoadMore)
        this.getApi('/item/search', params, (res) => {
            console.log('/item/search', res)
            if (res.errcode === 0 && res.data.rows) {
                let arr = res.data.rows.filter(item => {
                    return item.itemTypeId === 1 || item.itemTypeId === 2 || item.itemTypeId === 3
                })
                console.log('/9999999999', arr)
                let results = this.reductionData(arr ? arr : [])
                console.log('/item/search123123123', results)
                if (pageNum === 1) {
                    this.setState({newsList: []}, () => {
                        this.setState({newsList: results})
                    })
                } else {
                    this.setState({newsList: newsList.concat(results)})
                }
                this.setState({canLoadMore: results && results.length >= pageSize, pageNum: pageNum + 1})
            } else {
                console.log(77777777777)
                this.setState({newsList: [], hasNewsList: false})
            }
        })
    }

    saveToHistory (query) {
        AsyncStorage.getItem('searchHistory', (err, v) => {
            let history = v ? JSON.parse(v) : []
            let index = history.findIndex((item) => {
                return item === query
            })
            if (index === 0) {
                return
            }
            if (index > 0) {
                history.splice(index, 1)
            }
            history.unshift(query)
            if (history.length > 5) {
                history.pop()
            }
            this.setState({searchHistory: history})
            AsyncStorage.setItem('searchHistory', JSON.stringify(history))
        })
    }

    clearHistory = () => {
        this.setState({searchHistory: []})
        AsyncStorage.setItem('searchHistory', JSON.stringify([]))
    }

    deleteCurrentHistory = (query) => {
        AsyncStorage.getItem('searchHistory', (err, v) => {
            let history = v ? JSON.parse(v) : []
            let index = history.findIndex((item) => {
                return item === query
            })
            this.log(history, query)
            if (index > -1) {
                history.splice(index, 1) // 删除掉
            }
            this.setState({searchHistory: history})
            AsyncStorage.setItem('searchHistory', JSON.stringify(history))
        })
    }

    renderHistory () {
        let {searchHistory} = this.state
        return (
            <View style={{
                position: 'absolute',
                top:  titleHeight,
                flexDirection: 'column',
                backgroundColor: 'white'
            }}>
                <View style={styles.history}>
                    <Text style={{fontSize: rpx(24), color: '#787878', flex: 1}}>搜索历史</Text>
                    <TouchableOpacity onPress={this.clearHistory}>
                        <Image style={{width: rpx(30), height: rpx(30)}} source={require('../imgs/delete_icon.jpg')}/>
                    </TouchableOpacity>
                </View>
                {
                    searchHistory.map((it, index) => (
                        <TouchableOpacity style={styles.history} onPress={() => {
                            this.setState({searchKey: it, showHistory: false}, () => {
                                this.getNewsList(true)
                            })
                        }}>
                            <Text style={{fontSize: rpx(24), color: 'black', flex: 1}} numberOfLines={1}>{it}</Text>
                            <TouchableOpacity onPress={() => {
                                this.deleteCurrentHistory(it)
                            }}>
                                <Image style={{width: rpx(30), height: rpx(30)}}
                                       source={require('../imgs/delete_icon.jpg')}/>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))
                }
            </View>
        )
    }

    render () {
        let {navigation} = this.props
        let {hasNewsList, goodsList, canLoadMore, searchKey, showHistory, searchHistory, newsList, categoryItem} = this.state
        let height = this.getWindowHeight() - rpx(188)
        return (
            <View style={{flex: 1, backgroundColor: '#fafcfd', alignItems: 'center'}}>
                <NavBar
                    hasSearchBtn={true}
                    backgroundType={false} leftBtn={false} fullScreen={true} showLogo={false} editable={true}
                    onClickSearch={this.onClickSearch.bind(this)}/>
                <View style={{width: rpx(750), height: rpx(20)}}></View>
                <NewsItem
                    newsList={newsList}
                    // itemCategoryId={categoryItem.ItemCategory ? categoryItem.ItemCategory.itemCategoryId : 0}
                    loadMore={this.getNewsList.bind(this)}
                    canLoadMore={canLoadMore}
                    navigation={navigation}
                    _onRefresh={() => {
                    }}
                    subscribeEd={this.subscribeEd.bind(this)}
                >
                </NewsItem>
                {
                     showHistory && searchHistory.length ?
                        this.renderHistory() :
                        null
                }
                {
                    hasNewsList ?
                        null
                        :
                        <Text style={{fontSize: rpx(28), color: '#b1b1b1', flex: 1}}>暂无匹配信息</Text>
                }
            </View>
        )
    }

    subscribeEd () {

    }
}

const styles = StyleSheet.create({
    homeStyle: {
        backgroundColor: '#fafcfd',
        flex: 1
    },
    btnSearch: {
        width: rpx(110),
        height: rpx(100),
        lineHeight: rpx(100),
        textAlign: 'center',
        fontSize: rpx(26),
        color: 'black'
    },
    searchBar: {
        flex: 1,
        height: rpx(60),
        borderRadius: rpx(30),
        backgroundColor: 'white',
        paddingHorizontal: rpx(30),
        flexDirection: 'row',
        alignItems: 'center'
    },
    searchInput: {
        flex: 1,
        height: rpx(50),
        fontSize: rpx(26),
        padding: 0,
        marginLeft: rpx(10)
    },
    goodsContainer: {
        width: rpx(750),
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: rpx(30),
        justifyContent: 'space-between'
    },
    history: {
        width: rpx(750),
        height: rpx(84),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: rpx(38)
    }
})
