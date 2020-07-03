import React from 'react'
import Base from '../components/base'
import {AsyncStorage, Image, StyleSheet, Text, TouchableOpacity, View, Platform, ScrollView} from 'react-native'
import {common} from '../style/common'
import {rpx} from '../utils/adapter'
import navigationService from '../utils/navigationService'
import {wxLogin} from '../utils/third'
import PropTypes from 'prop-types'
import NavBar from '../components/navBar.android'
import CategoryItem from '../components/categoryItem'
import NewsItem from '../components/newsItem'
import {thumbAndCommentAndBrowser, timePeriod} from '../utils/utils'

export default class Mine extends Base {
    resolveStatusBar () {
        return {
            barStyle: 'dark-content',
            backgroundColor: 'transparent',
            translucent: true
        }
    }

    created () {
        this.state = {
            newsList: [],
            pageNum: 0,
            categoryItem: {},
            categoryList: [],
            tabList: [
                {label: '我的收藏', icon: 'http://weixinfactory.di1game.com/weixinfactory/Icon/20200219/182422/8d1b58b585c6a97271a4ed168440abfc.png'},
                {label: '我的评论', icon: 'http://weixinfactory.di1game.com/weixinfactory/Icon/20200219/182459/ebff7f10a6e08d8cbee6e4be27d45511.png'},
                {label: '我的点赞', icon: 'http://weixinfactory.di1game.com/weixinfactory/Icon/20200219/182522/4c3214683801f4dcc9cb12957bf4e8c3.png'},
                {label: '浏览历史', icon: 'http://weixinfactory.di1game.com/weixinfactory/Icon/20200219/182537/34bc6d8454a06bebc9e672df49cf2691.png'},
                {label: '我的关注', icon: 'http://weixinfactory.di1game.com/weixinfactory/Icon/20200219/182252/b32ae037b58912374f53e0ec510602a8.png'}
            ]
        }
    }

    mounted () {
        console.log('================= 教育家 =======================')
        // this.getMyCategory()
        this.getCourse()
    }

    getMyCategory () {
        this.getApi('/user/getMyCategory', {ruleType: 2}, (res) => {
            console.log('getMyCategory', res)
            if (res.errcode === 0) {
                this.setState({
                    categoryList: res.data.rows,
                    categoryItem: res.data.rows[0]
                }, () => {
                    this.getCourse()
                })
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

    getCourse () {
        let params = {
            start: this.state.pageNum * 10,
            length: 10
        }
        this.getApi('/item/getCourse', params, (res) => {
            if (res.errcode === 0) {
                console.log('getCourse  .newsList success', res)
                let results = this.formateData(res.data.rows)
                this.setState({
                    newsList: results
                })
                console.log('getCourse  .newsList==========', this.state.newsList)
            }
        })
    }

    render () {
        let {newsList} = this.state
        let {navigation} = this.props
        return (
            <View style={styles.goodsStyle}>
                <NavBar backgroundType={false} leftBtn={false} fullScreen={true} showLogo={true}/>
                <NewsItem
                    navigation={navigation}
                    newsList={newsList}
                    _onRefresh={this.getCourse.bind(this)}
                    loadMore={this.getCourse.bind(this)}></NewsItem>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    goodsStyle: {
        backgroundColor: '#fafcfd',
        flex: 1
    },
    myHeaderImg: {
        width: rpx(120),
        height: rpx(120),
        marginRight: rpx(30),
        flexDirection: 'row',
        alignItems: 'center'
    },
    nickName: {
        fontSize: rpx(32),
        fontWeight: 'bold',
        color: '#00070f'
    },
    tabList: {
        marginTop: rpx(50),
        width: rpx(690),
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    },
    tabItem: {
        width: rpx(330),
        padding: rpx(38),
        borderRadius: rpx(10),
        marginBottom: rpx(30),
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'white'
    }
})


