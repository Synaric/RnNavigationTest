import React, {Component} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {rpx} from "../utils/adapter";
import {timeStampToTime} from "../utils/arts";
import {imgHeader} from "../utils/config";
import NavigationService from "../utils/navigationService";

export default class Comment extends Component {

  constructor(props) {
    super(props);
    this.state = {
      item: {}
    };
  }

  render() {
    const {item} = this.state;
    let picArr = item.photo || [];
    let pl = picArr.map(item => ({url: imgHeader + item}));
    const picListView = picArr.map((it, idx) => {
      return (
        <TouchableOpacity activeOpacity={0.8} key={idx} onPress={() => {
          // this.props.navigation.navigate('PreviewImage', {imageUrls: pl, imgIndex: idx})
          NavigationService.navigate('PreviewImage', {imageUrls: pl, imgIndex: idx})
        }}>
          <Image style={styles.pic} source={{uri: imgHeader + it + '?x-oss-process=image/resize,h_140'}}/>
        </TouchableOpacity>
      )
    });
    return (
      <TouchableOpacity style={styles.cardContainer} activeOpacity={1}>
        <View activeOpacity={0.8} style={styles.avatarContainer}>
          <Image style={styles.avatar} source={{uri: item.face}}/>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.nickname}>{item.custom_nickname || item.nick_name}</Text>
          <Text style={styles.date}>{timeStampToTime(item.create_time, 2)}</Text>
          <Text style={styles.content}>{item.content}</Text>
          <View style={styles.piContainer}>
            {picListView}
          </View>
          <View style={styles.footer}>
            <Text style={{fontSize: rpx(26), color: '#787878'}}>规格: {item.category_tag}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.item !== this.props.item) {
      this.setState({item: this.props.item});
    }
    return true
  }

  componentDidMount() {
    this.setState({item: this.props.item});
  }
}
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  cardContainer: {
    width: rpx(690),
    display: 'flex',
    flexDirection: 'row',
    marginBottom: rpx(30),
    backgroundColor: 'white',
    paddingBottom: rpx(20)
  },
  avatarContainer: {
    width: rpx(100)
  },
  avatar: {
    width: rpx(84),
    height: rpx(84),
    marginTop: rpx(42),
    borderRadius: rpx(42),
    backgroundColor: '#f2f2f2'
  },
  contentContainer: {
    width: rpx(620),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  nickname: {
    fontSize: rpx(28),
    marginTop: rpx(54)
  },
  date: {
    fontSize: rpx(20),
    color: '#b1b1b1',
    marginTop: rpx(20)
  },
  content: {
    width: rpx(500),
    fontSize: rpx(30),
    marginTop: rpx(30),
    lineHeight: rpx(40)
  },
  piContainer: {
    width: rpx(465),
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  pic: {
    width: rpx(140),
    height: rpx(140),
    backgroundColor: '#f2f2f2',
    marginTop: rpx(15),
    marginRight: rpx(15)
  },
  footer: {
    width: rpx(590),
    height: rpx(40),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: rpx(30)
  },
  course: {
    maxWidth: rpx(300),
    fontSize: rpx(24),
    color: '#ca3839',
    borderBottomWidth: rpx(1),
    borderBottomColor: '#ca3839',
    textAlign: 'left'
  },
  btnLite: {
    width: rpx(106),
    height: rpx(40),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  btnLiteIcon: {
    width: rpx(40),
    height: rpx(40)
  },
  btnLiteText: {
    fontSize: rpx(24),
    marginLeft: rpx(10)
  },
  blank: {
    flex: 1
  }
});
