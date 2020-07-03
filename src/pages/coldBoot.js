import React from 'react'
import Base from '../components/base'
import {FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {rpx} from '../utils/adapter'
import {formatDate} from '../utils/arts'
import NavBar from '../components/navBar'
import {common} from '../style/common'
import {imgHeader} from '../utils/config'
import navigationService from '../utils/navigationService'

export default class AllArticles extends Base {
    created() {
        this.state = {
            allChannel: [],
            myChannel: []
        }
    }

    mounted() {
        this.getUserTag()
    }

    getUserTag () {
        this.getApi('/user/getUserTag', {}, (res) => {
            console.log('getUserTag', res)
            if (res.errcode === 0) {
                this.setState({
                    allChannel: res.data
                })
                this.myChannel.forEach(item => {
                    item.hasPushed = false
                })
            }
        })
    }

    render() {
        let {allChannel, myChannel} = this.state
        return (
            <View style={{
                flex: 1,
                paddingVertical: rpx(50),
                alignItems: 'center',
                flexDirection: 'column',
                backgroundColor: 'rgb(243, 246, 250)'
            }}>
                <Text style={{color: '#00070f', fontWeight: 'bold', fontSize: rpx(48)}}>选择你的频道</Text>
                <Text style={{color: '#4f5661', fontSize: rpx(26), marginTop: rpx(20)}}>为你推荐更多合适内容</Text>
                <View style={{marginTop: rpx(134), width: rpx(645), flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
                    {

                        allChannel && allChannel.map((it, index) => (
                            <TouchableOpacity onPress={() => {
                                this.chooseClick(it)
                            }}>
                                <View style={styles.loadCategoryItem}>
                                    {
                                        it.chooseStatus ? <Image style={styles.addChannel}
                                                                 source={require('../imgs/add-channel.png')}/> : null
                                    }
                                    <Text numberOfLines={1} style={styles.categoryText}>{it.tagName}</Text>
                                </View>
                            </TouchableOpacity>

                        ))

                    }
                </View>
                <TouchableOpacity
                    style={[styles.confirmBtn, {backgroundColor: myChannel && myChannel.length ? 'red' : '#b1b1b1'}]}
                    onPress={() => {
                    this.setUserTag()
                }}>
                        <Text style={{color: 'white'}}>确定</Text>
                </TouchableOpacity>
            </View>
        )
    }

    chooseClick = (it) => {
        let {allChannel} = this.state
        for (let i = 0; i < allChannel.length; i++) {
            if (it == allChannel[i]) {
                allChannel[i].chooseStatus = !allChannel[i].chooseStatus
            }
        }
        let newChannel = allChannel.filter(item => {
            return item.chooseStatus
        })
        this.setState({
            allChannel: allChannel,
            myChannel: newChannel
        })
    }

    setUserTag = () => {
        let list = this.state.myChannel
        console.log(this.state.myChannel)
        if (!list.length) {
            this.toast('请勾选标签')
            return
        }
        let params = {
            list: list
        }
        console.log('list', list)
        this.postApi('/user/setUserTag', params, res => {
            console.log('setUserTag', res)
            if (res.errcode === 0) {
               navigationService.navigate('Main', {})
            }
        })
    }
}

const styles = StyleSheet.create({
    loadCategoryItem: {
        width: rpx(175),
        height: rpx(64),
        backgroundColor: 'white',
        borderRadius: rpx(6),
        marginRight: rpx(40),
        marginBottom: rpx(40),
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
    },
    categoryText: {
        width: rpx(116),
        fontSize: rpx(28),
        fontWeight: 'bold',
        color: '#4f5661'
    },
    confirmBtn: {
        width: rpx(460),
        height: rpx(90),
        fontSize: rpx(32),
        fontWeight: 'bold',
        color: 'white',
        marginTop: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
        borderRadius: rpx(6)
    },
    addChannel: {
        width: rpx(30),
        height: rpx(30),
        position: 'absolute',
        top: rpx(-15),
        right: rpx(-15)
    }
})
