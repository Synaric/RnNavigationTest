import {FlatList, Image, StyleSheet, Text, View} from "react-native";
import React from "react";
import BasePage from "./basePage";
import {getStatusBarHeight, rpx} from "../util/adapterUtils";
import {HPageViewHoc} from "react-native-head-tab-view";
import Btn from "../components/btn";
import ListView from "../components/listView"
import Player from "../components/playerV2"
import NavBar from "../components/navBar";

const HFlatList = HPageViewHoc(ListView)

export default class VewsDetail extends BasePage {

  constructor(props) {
    super(props);
    this.state = {
      fullScreen: false,
      tabs: ['FlatList', 'FlatList', 'FlatList'],
      content: [1, 1, 1, 1, 1, 1]
    };
  }

  static resolveStatusBar() {
    return {
      visible: true,
      style: 'dark',
      backgroundColor: 'transparent',
      drawBehind: true
    }
  }

  render() {
    let {fullScreen} = this.state
    let statusBarHeight = getStatusBarHeight()
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        {
          fullScreen ? null :
            <>
              <View style={{height: statusBarHeight}}/>
              <NavBar title={'光明教育家'} navigator={this.navigator} />
              <View style={styles.container}>
                <Text style={styles.newsTitle} numberOfLines={2}>这是一个标题这是一个标题这是一个标题这是一个标题这是一个标题这是一个标题这是一个标题这是一个标题</Text>
                <View style={styles.space} />
                <View style={styles.header}>
                  <Image style={styles.avatar} />
                  <Text style={styles.nickName}>昵称</Text>
                  <Text style={styles.publishTime}>2020-07-01</Text>
                </View>
              </View>
            </>
        }

        {/*<TabView*/}
          {/*tabs={this.state.tabs}*/}
          {/*renderScene={this.renderScene}*/}
          {/*makeHeaderHeight={() => { return rpx(180) }}*/}
          {/*renderScrollHeader={this.renderScrollHeader}*/}
        {/*/>*/}
        <View style={styles.container}>
          <Player
            videoStyle={{width: rpx(690), height: rpx(400)}}
            url={'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400'}
            title={'test'}
            maxPlayTime={0}
            onFullScreenChange={this.onFullScreenChange}/>
        </View>
      </View>
    );
  }

  renderScrollHeader = () => {
    return (
      <Text style={{height: rpx(180), lineHeight: rpx(180), textAlign: 'center', backgroundColor: 'yellow'}}>
        header
      </Text>
    )
  }

  renderScene = (sceneProps: { item: string, index: number }) => {
    return <HFlatList
      {...sceneProps}
      data={this.state.content}
      renderItem={this.renderCard}
      keyExtractor={(item, index) => index.toString()}
    />
  }

  renderCard = (item, index) => (
    <Btn style={{width: rpx(690), height: rpx(300), marginLeft: rpx(30), backgroundColor: 'white'}}/>
  )

  onShow() {
    this.print('NewsDetail', 'onShow')
  }

  onHide() {
    this.print('NewsDetail', 'onHide')
  }

  onFullScreenChange = (fullScreen) => {
    if (!fullScreen) {
      this.navigator.mergeOptions({
        statusBar: NewsDetail.resolveStatusBar()
      })
    }
    this.setState({
      fullScreen
    })
  }
}

const styles = StyleSheet.create({

  container: {
    paddingHorizontal: rpx(30)
  },

  newsTitle: {
    maxHeight: rpx(96),
    lineHeight: rpx(48),
    fontSize: rpx(36),
    color: '#313332',
    marginTop: rpx(18)
  },

  space: {
    height: rpx(20),
    borderBottomWidth: rpx(1),
    borderBottomColor: '#f4f9fa'
  },

  header: {
    height: rpx(125),
    flexDirection: 'row',
    alignItems: 'center'
  },

  avatar: {
    width: rpx(64),
    height: rpx(64),
    borderRadius: rpx(32),
    backgroundColor: '#f4f9fa'
  },

  nickName: {
    fontSize: rpx(26),
    color: '#313332',
    marginLeft: rpx(16),
    flex: 1
  },

  publishTime: {
    fontSize: rpx(26),
    color: '#b1b1b1'
  }
})
