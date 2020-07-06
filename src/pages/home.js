import {StyleSheet, Text, View} from "react-native";
import React from "react";
import BasePage from "./basePage";
import ViewPager from '@react-native-community/viewpager';
import {rpx} from "../util/adapterUtils";
import Btn from "../components/btn";
import ListView from "../components/listView";
import {getStorage, setStorage, setStorageSync} from "../util/storage";
import NewsDetail from "./newsDetail";

export default class Home extends BasePage {

  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      content: [1, 1, 1, 1, 1, 1]
    };
  }

  static resolveStatusBar() {
    return {
      style: 'light',
      backgroundColor: 'red'
    }
  }

  static options() {
    return {
      statusBar: {
        style: 'dark',
        backgroundColor: '#d8201e'
      }
    }
  }

  render() {
    let {content} = this.state

    return (
      <View style={{flex: 1}}>
        <Btn style={styles.tabBar} onPress={() => {
          // this.navigator.push('NewsDetail', {itemId: '32678', itemCategoryId: 21})
          this.navigator.push('NewsDetail', {itemId: '32653', itemCategoryId: 21})
        }} />
        <ViewPager style={{flex: 1}}
                   initialPage={0} showPageIndicator={false}>
          <ListView style={{width: rpx(750), flex: 1}}
                    key="1"
                    data={content}
                    renderItem={this.renderCard}
                    keyExtractor={(item, index) => String(index)}
                    refreshing={false}
                    onRefresh={this.onRefresh} />
          <View key="2">
            <Text>Second page</Text>
          </View>
        </ViewPager>
      </View>
    );
  }

  renderCard = (item, index) => (
    <Btn style={{width: rpx(690), height: rpx(300), marginLeft: rpx(30), backgroundColor: 'white'}}/>
  )

  onRefresh = () => {

  }

  onLoad() {
  }

  onShow() {
    this.print('Home', 'onShow')
  }

  onHide() {
    this.print('Home', 'onHide')
  }

  getContentHeight = () => {
    return this.getWindowHeight() - rpx(90)
  }
}

const styles = StyleSheet.create({

  header: {
    width: rpx(750),
    height: rpx(300),
    backgroundColor: 'red'
  },
  tabBar: {
    width: rpx(750),
    height: rpx(90),
    backgroundColor: 'green'
  }
})
