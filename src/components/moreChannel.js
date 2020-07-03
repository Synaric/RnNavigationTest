import React, {Component} from 'react'
import {common} from '../style/common'
import {Image, StyleSheet, Text, TouchableOpacity, View, ScrollView} from 'react-native'
import ExtModal from './modal'
import {rpx, deviceHeight, statusBarHeight} from '../utils/adapter'
import {imgHeader} from '../utils/config'
import {get, post} from '../request/API'
import {formatFloat} from '../utils/arts'
import Toast from 'react-native-root-toast'
import navigationService from '../utils/navigationService'
import CommentItem from './commentItem'


export default class Report extends Component {

    constructor (props) {
        super(props)
        this.state = {
            specGoodsInfo: null,
            specArr: [],
            buyNum: 1,
            editStatus: false
        }
    }

    mounted () {
        this.setState({
            editStatus: this.props.editStatus
        })
    }

    minusChannel = (it, index) => {
        if (it.ItemCategory.categoryName === '热点' || it.ItemCategory.categoryName === '推荐' || it.ItemCategory.categoryName === '关注') {
            return
        }
        if (this.state.editStatus) {
            console.log(' this.props.minusChannel(index)', it, index)
            this.props.minusChannel(it, index)
        }
    }

    addChannel = (it, index) => {
        if (this.state.editStatus) {
            console.log(' this.props.addChannel(index)', it, index)
            this.props.addChannel(it, index)
        }
    }

    render () {
        let {allChannel, myChannel, visible, placeOrderMode, onDismiss, type} = this.props
        let {editStatus} = this.state
        return (
            <ExtModal animationType="fade" fullScreen={true} visible={visible}
                      onDismiss={onDismiss}>
                <View style={styles.moreChannelStyle}>
                    <View style={{width: rpx(690), marginHorizontal: rpx(30)}}>
                        <View style={{position: 'relative', paddingVertical: rpx(30)}}>
                            <TouchableOpacity style={[styles.cancelIcon]} onPress={
                                onDismiss
                            }>
                                <Image source={require('../imgs/cancel-icon.png')}/>
                            </TouchableOpacity>
                            <Text style={{
                                textAlign: 'center',
                                fontSize: rpx(32),
                                fontWeight: 'bold',
                                color: '#00070f'
                            }}>全部频道</Text>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: rpx(10),
                            marginVertical: rpx(30)
                        }}>
                            <Text style={[common.recommendTitle, {marginBottom: rpx(0)}]}>我的频道</Text>
                            <TouchableOpacity onPress={() => {
                                this.setState({
                                    editStatus: !editStatus
                                })
                            }}>
                                <Text style={{color: '#00070f', fontSize: rpx(26)}}>{editStatus ? '完成' : '编辑'}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                            {
                                myChannel && myChannel.map((it, index) => (
                                    <TouchableOpacity onPress={() => {
                                       this.minusChannel(it, index)
                                    }}>
                                        <View
                                            style={[styles.channelItem, {marginRight: (index + 1) % 3 == 0 ? rpx(0) : rpx(29)}]}>
                                            {
                                                editStatus && (it.ItemCategory.categoryName !== '热点' && it.ItemCategory.categoryName !== '推荐' && it.ItemCategory.categoryName !== '关注')
                                                    ? <Image style={styles.editIcon}
                                                                    source={require('../imgs/delete-channel.png')}/> : null
                                            }
                                            <Text style={styles.channelText}>
                                                {it.ItemCategory.categoryName}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>

                                ))
                            }
                        </View>
                        <Text style={[common.recommendTitle, {marginVertical: rpx(25)}]}>频道推荐</Text>
                        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                            {
                                allChannel && allChannel.map((it, index) => (
                                    <TouchableOpacity onPress={() => {
                                        this.addChannel(it, index)
                                    }}>
                                        <View
                                            style={[styles.channelItem, {marginRight: (index + 1) % 3 == 0 ? rpx(0) : rpx(29)}]}>
                                            {
                                                editStatus ? <Image style={styles.editIcon}
                                                                    source={require('../imgs/add-channel.png')}/> : null
                                            }
                                            <Text style={styles.channelText}>
                                                {it.ItemCategory.categoryName}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            }
                        </View>
                    </View>
                </View>
            </ExtModal>
        )
    }
}

const styles = StyleSheet.create({
    moreChannelStyle: {
        width: rpx(750),
        height: (deviceHeight - statusBarHeight),
        backgroundColor: '#f3f6fa',
        borderTopRightRadius: rpx(20),
        borderTopLeftRadius: rpx(20),
    },
    cancelIcon: {
        width: rpx(35),
        height: rpx(35),
        position: 'absolute',
        top: rpx(33),
        left: rpx(0),
        zIndex: 99
    },
    channelItem: {
        width: rpx(210),
        height: rpx(64),
        backgroundColor: '#ffffff',
        borderRadius: rpx(10),
        textAlign: 'center',
        lineHeight: rpx(64),
        marginBottom: rpx(20)
    },
    editIcon: {
        width: rpx(30),
        height: rpx(30),
        position: 'absolute',
        right: rpx(-15),
        top: rpx(-15)
    },
    channelText: {
        textAlign: 'center',
        lineHeight: rpx(64)
    }
})
