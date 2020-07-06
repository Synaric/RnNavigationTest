import {FlatList, View} from 'react-native'
import React from 'react'
import BaseComponent from './baseComponents'
import {rpx} from '../util/adapterUtils'

export default class ListView extends BaseComponent {

  constructor (props) {
    super(props)
    this.flatList = null
    this.state = {}
  }

  render () {
    return (
      <FlatList
        ref={(ref) => {
          this.flatList = ref
        }}
        initialNumToRender={10}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={this.renderDefaultSeparator}
        ListFooterComponent={this.renderDefaultFooter}
        ItemSeparatorComponent={this.renderDefaultSeparator}
        {...this.props}>
      </FlatList>
    )
  }

  renderDefaultSeparator = () => (
    <View style={{width: rpx(750), height: rpx(30)}}/>
  )

  renderDefaultFooter = () => {
    let {hasMoreData} = this.props
    return <>
      {this.renderDefaultSeparator()}
      {hasMoreData ? this.renderDefaultSeparator() : null}
    </>
  }

  /**
   * 暴露scrollToOffset，使外部钩子函数HPageViewHoc()可以操作FlatList
   */
  scrollToOffset (params) {
    this.flatList.scrollToOffset(params)
  }
}
