import React from 'react'
import {Image, Platform, StyleSheet, TouchableOpacity, View, Text, ScrollView} from 'react-native'
import {rpx} from '../utils/adapter'
import {imgHeader} from '../utils/config'
import PropTypes from 'prop-types'
import {common} from '../style/common'
import TabBar from '../components/tabBar'


import Swiper from 'react-native-swiper'
// import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view';

export default class CategoryItem extends React.Component {
    static propTypes = {
        categoryList: PropTypes.array,
        showMoreChannel: PropTypes.bool,
    }

    static defaultProps = {
        showMoreChannel: false
    }

    constructor (props) {
        super(props)
        this.state = {cateType: 1}
    }

    // componentDidMount () {
    //     this.state = {
    //         cateType: 1
    //     }
    // }

    render () {
        let {categoryList, showMoreChannel} = this.props
        let {cateType} = this.state
        return (
            <View style={styles.container}>
                <ScrollView style={{width: rpx(670)}}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            pagingEnabled={true}>
                    <View style={styles.cateContainer}>
                        {
                            categoryList && categoryList.map((it, index) => (
                                <TouchableOpacity onPress={() => {
                                    this.selectCate(index)
                                }}>
                                    <View style={{
                                            padding: rpx(15),
                                            marginRight: rpx(30),
                                            alignItems: 'center',
                                        }}>
                                    <Text
                                        style={[cateType === index ? common.tagActiveText : common.tagNormalText]}>{it.ItemCategory.categoryName}</Text>
                                    </View>
                                   
                                </TouchableOpacity>
                            ))
                        }
                    </View>
                </ScrollView>
                {
                    showMoreChannel ? <TouchableOpacity style={[styles.moreChannel]} onPress={() => {
                        this.openChannelDialog()
                    }}>
                        <Image style={styles.moreChannel} source={require('../imgs/more-channel.png')}/>
                    </TouchableOpacity> : null
                }
            </View>
        )
    }

    openChannelDialog = () => {
        this.props.openChannelDialog(true)
    }

    selectCate = (idx) => {
        if (this.state.cateType === idx) {
            return
        }
        console.log('selectCate', this.state.cateType)
        this.setState({cateType: idx}, () => {
            this.props.selectCate(idx)
        })
    }
}

const styles = StyleSheet.create({
    container: {
        width: rpx(750),
        paddingHorizontal: rpx(20),
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: rpx(15)
    },
    cateContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    wrapper: {
        width: rpx(750),
        height: rpx(360),
    },
    categoryNameStyle: {
        marginRight: rpx(50),
        color: '#4f5661'
    },
    moreChannel: {
        width: rpx(38),
        height: rpx(38),
        marginLeft: 'auto',
        marginBottom: rpx(3)
    }
})
