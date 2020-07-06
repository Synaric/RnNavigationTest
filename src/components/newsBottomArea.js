import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import BaseComponent from "./baseComponents";
import {rpx} from "../util/adapterUtils";
import Btn from "./btn";

export default class NewsBottomArea extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    let {isLike, isCollect, onReply, onToggleLike, onToggleCollect} = this.props
    return (
      <View style={styles.bottomContainer}>
        <Btn style={styles.comment} onPress={() => {onReply(1)}}>
          <Image style={{width: rpx(26), height: rpx(26)}} source={require('../img/comment-icon.png')}/>
          <Text style={styles.commentHint}>来发布你的思考吧</Text>
        </Btn>
        <View style={styles.operations}>
          <Btn style={styles.op} onPress={onToggleLike}>
            <Image style={styles.opIcon} source={isLike ? require('../img/have-thumb.png') : require('../img/no-thumb.png')}/>
          </Btn>
          <Btn style={styles.op} onPress={onToggleCollect}>
            <Image style={styles.opIconStyle2} source={isCollect ? require('../img/have-collect.png') : require('../img/bottom-collect.png')}/>
          </Btn>
          <Btn style={styles.op}>
            <Image style={styles.opIcon} source={ require('../img/bottom-share.png')}/>
          </Btn>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  bottomContainer: {
    height: rpx(98),
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: rpx(30),
    backgroundColor: '#f4f9fa'
  },

  comment: {
    width: rpx(506),
    height: rpx(64),
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: rpx(32),
    paddingHorizontal: rpx(30)
  },

  commentHint: {
    color: '#b1b1b1',
    fontSize: rpx(24),
    marginLeft: rpx(17)
  },

  operations: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    flex: 1,
    paddingHorizontal: rpx(10)
  },

  op: {
    width: rpx(60),
    height: rpx(60),
    alignItems: 'center',
    justifyContent: 'center'
  },

  opIcon: {
    width: rpx(30),
    height: rpx(30)
  },

  opIconStyle2: {
    width: rpx(33),
    height: rpx(30)
  }
})
