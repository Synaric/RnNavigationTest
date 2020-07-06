import {StyleSheet} from "react-native";
import {rpx} from "../util/adapterUtils";

export const common = StyleSheet.create({

  followWrapper: {
    width: rpx(105),
    height: rpx(40)
  },

  follow: {
    width: rpx(105),
    height: rpx(40),
    borderRadius: rpx(20),
    backgroundColor: '#d8201e',
    color: 'white',
    fontSize: rpx(24),
    textAlign: 'center',
    lineHeight: rpx(40)
  },

  hasFollowed: {
    width: rpx(105),
    height: rpx(40),
    borderRadius: rpx(20),
    borderWidth: rpx(1),
    borderColor: '#b1b1b1',
    color: '#b1b1b1',
    fontSize: rpx(24),
    textAlign: 'center',
    lineHeight: rpx(40)
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },

  loading: {
    width: rpx(100),
    height: rpx(100)
  }
})
