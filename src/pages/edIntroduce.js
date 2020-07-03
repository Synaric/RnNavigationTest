import React from 'react'
import Base from '../components/base'
import {Image, Platform, StyleSheet, TouchableOpacity, View, Text, ScrollView, AsyncStorage, DeviceEventEmitter} from 'react-native'
import {rpx} from '../utils/adapter'
import {imgHeader} from '../utils/config'
import PropTypes from 'prop-types'
import {common} from '../style/common'
// import HTML from 'react-native-render-html'
import NavigationService from '../utils/navigationService'
import {get} from '../request/API'

export default class edIntroduce extends Base {

    constructor (props) {
        super(props)
        this.state = {
            tabType: 0,
            edInfo: {}
        }
    }

    mounted () {
        let params = this.getParams()
        this.getEdDetail(params)
        console.log('mounted ------------------------------------')
    }

    getEdDetail (params) {
        get(this, '/user/getUserById', {userId: params.userId}, (res) => {
            console.log('getUserById', res)
            if (res.errcode === 0) {
                console.log('res.data', res.data)
                AsyncStorage.getItem('mySubscribe', (error, results) => {
                    console.log('AsyncStorageAsyncStorageAsyncStorageAsyncStorage11', results)
                    // this.state.edInfo.subscribeStatus = Number(JSON.parse(results).indexOf(res.data.UserInfo ? res.data.UserInfo.User.userId : -1) === -1 ? 0 : 1)
                    this.setState({
                        edInfo: Object.assign({}, res.data, {subscribeStatus: JSON.parse(results).indexOf(res.data.userId) === -1 ? 0 : 1})
                    })
                })


                // this.edInfo =
                //     Object.assign({}, res.data, {subscribeStatus: wx.getStorageSync('mySubscribe').indexOf(res.data.userId) === -1 ? 0 : 1})

                console.log('AsyncStorageAsyncStorageAsyncStorageAsyncStorage22', this.state.edInfo)
            }
        })
    }

    navigationBackPage () {
        DeviceEventEmitter.emit('changeSubscribe', this.state.edInfo);
        NavigationService.goBack()
    }

    render () {
        let {tabType, edInfo} = this.state
        return (
            <ScrollView>
            <View style={styles.container}>
                <View style={styles.edIntrodPoster}>
                    <TouchableOpacity style={{ position: 'absolute', zIndex: 999, top: rpx(20), left: rpx(20)}} onPress={() => {
                        this.navigationBackPage()
                    }}>
                    <Image style={{width: rpx(60), height: rpx(60)}} source={require('../imgs/arrow_back.png')}/>
                    </TouchableOpacity>
                    <Image style={{width: rpx(750), height: rpx(420)}}
                           source={{uri: edInfo.background}}/>
                </View>
                <View style={styles.edCard}>
                    <View style={{height: rpx(20), width: rpx(750)}}></View>
                    <View style={styles.edFace}>
                        <Image style={{width: rpx(140), height: rpx(140), borderRadius: rpx(70)}}
                               source={{uri: edInfo.face}}/>
                    </View>
                    <TouchableOpacity
                        onPress={() => {this.subscribeEd(edInfo)}}>
                        <Text style={[edInfo.subscribeStatus ? common.haveSubscribe : common.noSubscribe, {
                            width: rpx(134),
                            height: rpx(54),
                            textAlign: 'center',
                            lineHeight: rpx(54),
                            marginLeft: 'auto',
                            marginRight: rpx(30),
                            borderRadius: rpx(28),
                            fontSize: rpx(24),
                            letterSpacing: rpx(3)
                        }]
                        }>{edInfo.subscribeStatus ? '已关注' : '关注'}</Text>
                    </TouchableOpacity>
                    <View style={styles.edData}>
                        <Text style={{
                            fontSize: rpx(26),
                            fontWeight: 'bold',
                            color: '#313332'
                        }}>{edInfo.nickName}</Text>
                        <Text style={{
                            fontSize: rpx(20),
                            lineHeight: rpx(30),
                            color: '#787878',
                            marginTop: rpx(10),
                            marginBottom: rpx(25)
                        }}>{edInfo.intro}</Text>
                    </View>
                    <View style={styles.edInfoTab}>
                        <TouchableOpacity onPress={() => {
                            this.selectTab(0)
                        }}>
                            <Text style={[tabType === 0 ? common.tabActiveText : common.tabNormalText, ,{
                                lineHeight: rpx(83)
                            }]}>介绍</Text>
                        </TouchableOpacity>
                        {/*<TouchableOpacity onPress={() => {*/}
                            {/*this.selectTab(1)*/}
                        {/*}}>*/}
                            {/*<Text style={[tabType === 1 ? common.tabActiveText : common.tabNormalText, {*/}
                                {/*lineHeight: rpx(83)*/}
                            {/*}]}>干货</Text>*/}
                        {/*</TouchableOpacity>*/}
                    </View>
                </View>

                {/* 教育家介绍 富文本*/}
                {/*<View style={{width: rpx(750), paddingLeft: rpx(30), backgroundColor: 'white', paddingTop: rpx(30)}}>*/}
                    {/*<View style={{width: rpx(690), marginBottom: rpx(110)}}>*/}
                        {/*<HTML allowFontScaling={false} html={goodsInfo.description} imagesMaxWidth={rpx(690)}/>*/}
                    {/*</View>*/}
                {/*</View>*/}
                <View style={{width: rpx(750), backgroundColor: '#fff', marginTop: rpx(30), flex: 1, paddingLeft: rpx(30), paddingTop: rpx(30)}}>
                    {/*<Image style={{width: rpx(690), height: rpx(350)}} source={{uri: 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqXN0g9W4axhp4Idz23t9RzD5Iia4QiclS1FvMbPsoUoAsMDx4MxrxBKaffrfJBh48Y6y6Cux3NTubQ/132'}}/>*/}
                   <Text style={{lineHeight: rpx(44), fontSize: rpx(26), marginVertical: rpx(20)}}>
                       {edInfo.detail}
                 </Text>
                </View>
            </View>
            </ScrollView>
        )
    }

    selectTab = (type) => {
        if (this.state.tabType === type) {
            return
        }
        this.setState({
            tabType: type
        })
    }

    subscribeEd (item) {
        console.log('subscribeEd==========', item)
        // AsyncStorage.getItem('userInfo', (error, result) => {
        //     console.log('resultresultresult', result)
        //     let status = JSON.parse(result).nickName
        //     console.log('statusstatusstatusstatusstatus', status)
        //     if (status == '匿名用户') {
        //         console.log('statusstatusstatusstatusstatus2222222', status)
        //         NavigationService.navigate('loginView', {})
        //     }
        //     return
        // })
        let isSubscribe = item.subscribeStatus
        let path = isSubscribe ? 'unFollow' : 'follow'
        this.postApi(`/user/${path}`, {followUserId: item.userId}, res => {
            console.log(res)
            console.log(1111111111)
            if (res.errcode === 0) {
                item.subscribeStatus = !item.subscribeStatus
                this.setState({
                    edInfo: item
                }, () => {
                    AsyncStorage.getItem('mySubscribe', (error, results) => {
                        console.log('mySubscribemySubscribe', results)
                        let arr = JSON.parse(results)
                        let id = item.userId
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
                            console.log('123123123123123',JSON.parse(results))
                        })
                    })

                    this.toast(
                        item.subscribeStatus ? '关注成功' : '取消关注'
                    )
                })
            }
        })
    }
}

const styles = StyleSheet.create({
    container: {
        width: rpx(750),
        flex: 1,
        backgroundColor: '#f3f6fa'
    },
    edIntrodPoster: {
        position: 'relative',
        width: rpx(750),
        height: rpx(420)
    },
    edCard: {
        width: rpx(750),
        backgroundColor: '#fff',
        justifyContent: 'center'
    },
    edFace: {
        width: rpx(140),
        height: rpx(140),
        position: 'absolute',
        left: rpx(40),
        top: rpx(-70),
        alignItems: 'center',
        justifyContent: 'center'
    },
    edData: {
        flexDirection: 'column',
        marginTop: rpx(20),
        marginLeft: rpx(40),
    },
    edInfoTab: {
        width: rpx(690),
        height: rpx(83),
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopWidth: rpx(1),
        borderTopColor: '#cdd3dc',
        borderStyle: 'solid',
        fontSize: rpx(26),
        color: '#4f5661',
        marginHorizontal: rpx(30)
    }
})
