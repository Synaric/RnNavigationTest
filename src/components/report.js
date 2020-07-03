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
            reportList: ['营销广告', '淫秽色情', '恶意谩骂', '违法信息']
        }
    }

    reportDetails (it, index) {
        // {replyId: this.replyId, reportType: index}
        console.log('222', this.state.reportList, it, index)
    }

    render () {
        let {reportList} = this.state
        let {visible, placeOrderMode, onDismiss, type} = this.props
        return (
            <ExtModal animationType="fade" zIndex={999999} fullScreen={true} visible={visible}
                      onDismiss={onDismiss}>
                <View style={styles.reportStyle}>
                    <View style={{borderRadius: rpx(10), backgroundColor: 'white'}}>
                    {
                        reportList && reportList.map((it, index) => (
                            <TouchableOpacity 
                                    onPress={() => {
                                        this.reportDetails(it, index)
                                    }}
                                    style={{backgroundColor: 'red', paddingVertical: rpx(30), borderBottomColor: '#cdd3dc', borderBottomWidth: rpx(1), borderStyle: 'solid'}}>
                                <Text style={{textAlign: 'center', fontSize: rpx(28), color: '#4f5661'}}>{it}</Text>
                            </TouchableOpacity>
                        ))
                    }
                    </View>
                    <View style={{borderRadius: rpx(10), backgroundColor: 'white', paddingVertical: rpx(30), marginVertical: rpx(20)}}>
                        <Text style={{textAlign: 'center', fontSize: rpx(28), color: '#4f5661'}}>取消</Text>
                    </View>
                </View>
            </ExtModal>
        )
    }
}

const styles = StyleSheet.create({
    reportStyle: {
        width: rpx(710),
        position: 'relative',
        zIndex: 999
    },
})
