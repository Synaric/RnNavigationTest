import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {rpx} from '../utils/adapter'

export default class TabBar extends Component {

  static propTypes = {
    title: PropTypes.array.isRequired,
    onTabPress: PropTypes.func,
    border: PropTypes.bool,
    betweenGap: PropTypes.number
  }

  static defaultProps = {
    border: false,
    betweenGap: 0
  }

  constructor (props) {
    super(props)
    this.state = {
      selectedTab: 0
    }
    this.selectTab = this.selectTab.bind(this)
  }

  selectTab (idx) {
    this.setState({selectedTab: idx})
  }

  render () {
    let tabs = this.props.title.map((it, idx) => {
      return (
        <TouchableOpacity activeOpacity={0.8} style={styles.tab} onPress={this.onTabPress.bind(this, idx)} key={idx}>
          <View style={[{
            height: rpx(86),
            paddingHorizontal: rpx(this.props.betweenGap)
          }, this.props.border && this.state.selectedTab === idx ? styles.textWithLine : styles.textNoLine]}>
            <Text style={this.state.selectedTab === idx ? styles.textSelected : styles.textNormal}>{it}</Text>
          </View>
        </TouchableOpacity>
      )
    })
    return (
      <View style={styles.container}>
        {tabs}
      </View>
    )
  }

  onTabPress (idx) {
    this.setState({selectedTab: idx})
    if (this.props.onTabPress) {
      this.props.onTabPress(idx)
    }
  }
}

const styles = StyleSheet.create({
  container: {
    width: rpx(750),
    height: rpx(88),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  tab: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textNormal: {
    fontSize: rpx(28),
    color: '#b1b1b1',
    paddingLeft: rpx(10),
    paddingRight: rpx(10),
    lineHeight: rpx(88)
  },
  textSelected: {
    fontSize: rpx(28),
    color: '#17894c',
    paddingLeft: rpx(10),
    paddingRight: rpx(10),
    lineHeight: rpx(88)
  },
  textWithLine: {
    borderBottomColor: '#17894c',
    borderBottomWidth: rpx(3)
  },
  textNoLine: {}
})
