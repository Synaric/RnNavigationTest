// import React, {Component} from 'react'
// import LinearGradient from 'react-native-linear-gradient';
// import {
//   View, Text, TouchableOpacity, Slider, ActivityIndicator, Modal, Platform, Dimensions, StyleSheet,
//   Image, DeviceEventEmitter
// } from 'react-native'
// import Video from 'react-native-video'
// import Orientation from 'react-native-orientation'
// import {rpx} from "../util/AdapterUtil";
// import {log} from "../util/artUtils";

const deviceInfo = {
  deviceWidth: Dimensions.get('window').width,
  deviceHeight: Platform.OS === 'ios' ? Dimensions.get('window').height : Dimensions.get('window').height
};

const commonStyle = {

  /** color **/
  // 常用颜色
  red: '#FF0000',
  orange: '#FFA500',
  yellow: '#FFFF00',
  green: '#00FF00',
  cyan: '#00FFFF',
  blue: '#0000FF',
  purple: '#800080',
  black: '#000',
  white: '#FFF',
  gray: '#808080',
  drakGray: '#A9A9A9',
  lightGray: '#D3D3D3',
  tomato: '#FF6347',
  PeachPuff: '#FFDAB9',
  clear: 'transparent',

  /** 主题色 **/
  themeColor: '#e74c3c',
  // 默认灰色字体颜色
  textGrayColor: '#989898',
  // 默认黑色字体颜色
  textBlockColor: '#262626',
  // 默认背景颜色
  bgColor: '#E6E6E6',
  // 默认分割线颜色
  lineColor: '#E6E6E6',
  // 默认placeholder颜色
  placeholderColor: '#eee',
  // borderColor
  borderColor: '#808080',
  // 导航title 颜色
  navTitleColor: '#262626',
  // 导航左item title color
  navLeftTitleColor: '#333',
  // 导航右item title color
  navRightTitleColor: '#333',
  navThemeColor: '#FEFEFE',
  iconGray: '#989898',
  iconBlack: '#262626',

  /** space **/
  // 上边距
  marginTop: 10,
  // 左边距
  marginLeft: 10,
  // 下边距
  marginBotton: 10,
  // 右边距
  marginRight: 10,
  // 内边距
  padding: 10,
  // 导航的leftItem的左间距
  navMarginLeft: 15,
  // 导航的rightItem的右间距
  navMarginRight: 15,

  /** width **/
  // 导航栏左右按钮image宽度
  navImageWidth: 25,
  // 边框线宽度
  borderWidth: 1,
  // 分割线高度
  lineWidth: 0.8,

  /** height **/
  // 导航栏的高度
  navHeight: Platform.OS === 'ios' ? 64 : 56,
  // 导航栏顶部的状态栏高度
  navStatusBarHeight: Platform.OS === 'ios' ? 20 : 0,
  // 导航栏除掉状态栏的高度
  navContentHeight: Platform.OS === 'ios' ? 44 : 56,
  // tabBar的高度
  tabBar: 49,
  // 底部按钮高度
  bottonBtnHeight: 44,
  // 通用列表cell高度
  cellHeight: 44,
  // 导航栏左右按钮image高度
  navImageHeight: 25,

  /** font **/
  // 默认文字字体
  textFont: 14,
  // 默认按钮文字字体
  btnFont: 15,
  // 导航title字体
  navTitleFont: 17,
  // tabBar文字字体
  barBarTitleFont: 12,
  // 占位符的默认字体大小
  placeholderFont: 13,
  // 导航左按钮的字体
  navRightTitleFont: 15,
  // 导航右按钮字体
  navLeftTitleFont: 15,

  /** opacity **/
  // mask
  modalOpacity: 0.3,
  // touchableOpacity
  taOpacity: 0.1,

  /** 定位 **/
  absolute: 'absolute',

  /** flex **/
  around: 'space-around',
  between: 'space-between',
  center: 'center',
  row: 'row'
};

export default class MoviePlayer extends Component {

  constructor(props) {
    super(props);
    this.player = null;
    this.state = {
      rate: 1,
      slideValue: 0.00,
      currentTime: 0.00,
      duration: 0.00,
      paused: true,
      playerLock: false,
      isTouchedScreen: false,
      modalVisible: true,
      isLock: false,
      orientation: 'PORTRAIT',
      specificOrientation: null,
      canShowCover: false,
      isPlayed: false
    };
    this.refreshListener = null
  }

  componentWillMount() {
    let init = Orientation.getInitialOrientation();
    let orientation = this.props.orientation;
    if (orientation) {
      init = orientation
    }
    this.setState({
      init,
      orientation: init,
      specificOrientation: init,
    });

    this.onPreNavigate = this.onPreNavigate.bind(this)
  }

  componentDidMount() {
    let orientation = this.props.orientation;
    if (orientation === 'LANDSCAPE') {
    } else {
      this.refreshListener = DeviceEventEmitter.addListener('onFullScreenVideoDestroy', (data) => {
        if (data.tag === this.props.tag) {
          this.setState({slideValue: data.slideValue, currentTime: data.currentTime, paused: data.paused}, () => {
            this.player.seek(data.currentTime);
            this.play()
          })
        }
      })
    }

    if (this.props.currentTime) {
      log('--------------------', this.props.currentTime);
      this.setState({currentTime: this.props.currentTime});
      this.player.seek(this.props.currentTime);
    }
    if (this.props.cover) {
      this.setState({canShowCover: true})
    }
    this.setState({paused: this.props.paused})
  }

  componentWillUnmount() {

    let orientation = this.props.orientation;
    if (orientation === 'LANDSCAPE') {
      // 说明当前是全屏，退出全屏后，唤起原视频
      DeviceEventEmitter.emit('onFullScreenVideoDestroy', {
        currentTime: this.state.currentTime,
        slideValue: this.state.slideValue,
        tag: this.props.tag,
        paused: !this.state.paused,
        playerLock: this.state.playerLock
      })
    } else {
      if (this.refreshListener) {
        this.refreshListener.remove();
      }
      DeviceEventEmitter.emit('onPreviewVideoDestroy', {})
    }

    Orientation.lockToPortrait()
  }

  onPreNavigate() {
    if (!this.state.paused) {
      this.pause()
    }
  }

  loadStart(data) {
    log('loadStart------', data)
  }

  onLoad(duration) {
    this.setDuration(duration);
  }

  setDuration(duration) {
    log('setDuration---------', duration);
    this.setState({duration: duration.duration})
  }

  setTime(data) {
    // log('setTime---------', this.props.maxPlayTime, data.currentTime, data);
    let sliderValue = parseInt(this.state.currentTime);
    this.setState({
      slideValue: sliderValue,
      currentTime: data.currentTime,
      modalVisible: false
    });
    if (this.props.maxPlayTime && this.props.maxPlayTime <= data.currentTime) {
      this.setState({paused: true, currentTime: 0});
      this.player.seek(0);
      this.props.onReachMaxPlayTime()
    }
  }

  onEnd(data) {
    //this.player.seek(0);
    this.setState({paused: true, currentTime: 0})
  }

  videoError(error) {
    this.showMessageBar('播放器报错啦！')(error.error.domain)('error');
    this.setState({
      modalVisible: false
    })
  }

  onBuffer(data) {
    log('onBuffer', data)
  }

  onTimedMetadata(data) {
    log('onTimedMetadata', data)
  }

  showMessageBar = title => msg => type => {
    // 消息
  };

  formatMediaTime(duration) {
    let min = Math.floor(duration / 60);
    let second = duration - min * 60;
    min = min >= 10 ? min : '0' + min;
    second = second >= 10 ? second : '0' + second;
    return min + ':' + second
  }

  play() {
    this.setState({
      canShowCover: false,
      paused: !this.state.paused,
    })
  }

  pause() {
    this.setState({
      canShowCover: false,
      paused: true,
    })
  }

  onSeek(value) {
    if (this.props.maxPlayTime && this.props.maxPlayTime <= value) {
      this.setState({paused: true, currentTime: 0});
      this.player.seek(0);
      this.props.onReachMaxPlayTime()
    } else {
      this.setState({currentTime: value});
    }
  }

  toFullScreen = () => {
    this.props.navigation.navigate("FullScreenVideo", {
      currentTime: this.state.currentTime,
      slideValue: this.state.slideValue,
      url: this.props.url,
      tag: this.props.tag,
      paused: this.state.paused,
      maxPlayTime: this.props.maxPlayTime,
      title: this.props.title
    });
    this.pause();
  };

  renderModal() {
    return (
      <Modal
        animationType={"none"}
        transparent={true}
        visible={this.state.modalVisible}
      >
        <View style={[styles.indicator, {height: this.props.size.height}]}>
          <ActivityIndicator
            animating={true}
            style={[{height: 80}]}
            color={commonStyle.red}
            size="large"
          />
        </View>
      </Modal>
    )
  }

  _onTouchedScreen() {
    this.setState({isTouchedScreen: !this.state.isTouchedScreen}, () => {
      if (this.state.isTouchedScreen) {
        setTimeout(() => {
          this.setState({isTouchedScreen: false})
        }, 10000)
      }
    })
  }

  render() {
    const {orientation, isLock} = this.state;
    const url = this.props.url;
    const title = this.props.title;
    const size = this.props.size;
    const isL = orientation === 'LANDSCAPE';
    const w = orientation === 'PORTRAIT' ? size.width : Dimensions.get('window').width;
    return (
      url ? <TouchableOpacity
        activeOpacity={1}
        style={[styles.movieContainer, {
          width: w,
          height: orientation === 'PORTRAIT' ? size.height : deviceInfo.deviceWidth,
          // marginTop: orientation === 'PORTRAIT' ? Platform.OS === 'ios' ? 20 : 0 : 0
        }, orientation === 'PORTRAIT' ? null : {position: 'absolute', top: 0, left: 0}]}
        onPress={this._onTouchedScreen.bind(this)}>
        <Video source={{uri: url}}
               ref={ref => this.player = ref}
               rate={this.state.rate}
               volume={1.0}
               muted={false}
               paused={this.state.paused}
               resizeMode="contain"
               repeat={true}
               playInBackground={false}
               playWhenInactive={false}
               ignoreSilentSwitch={"ignore"}
               progressUpdateInterval={250.0}
               onLoadStart={(data) => this.loadStart(data)}
               onLoad={data => this.onLoad(data)}
               onReadyForDisplay={() => {
                 if (this.props.currentTime && Platform.OS === 'ios' && !this.state.isPlayed) {
                   this.setState({isPlayed: true}, () => {
                     this.player.seek(this.props.currentTime)
                   })
                 }
               }}
               onProgress={(data) => this.setTime(data)}
               onEnd={(data) => this.onEnd(data)}
               onError={(data) => this.videoError(data)}
               onBuffer={(data) => this.onBuffer(data)}
               onTimedMetadata={(data) => this.onTimedMetadata(data)}
               style={[styles.videoPlayer]}
        />
        {
          this.state.paused ?
            <TouchableOpacity activeOpacity={0.8} style={[styles.videoPlayer, {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }]}
                              onPress={() => {
                                this.play()
                              }}>
              {this.state.canShowCover ? <Image style={styles.videoPlayer} source={{uri: this.props.cover}}/> : null}
              <Image style={{width: rpx(75), height: rpx(75)}} source={require("./../img/play_video_icon.png")}/>
            </TouchableOpacity> : null
        }

        {
          !isLock && this.state.isTouchedScreen ?
            <View style={[styles.navContentStyle, {height: isL ? rpx(160) : rpx(90)}]}>
              <LinearGradient colors={['#666666', 'transparent']}
                              style={{flex: 1, height: isL ? rpx(160) : rpx(90), opacity: 0.5}}/>
              <View style={[styles.navContentStyleInner]}>
                <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                  {/*{*/}
                  {/*isL ?*/}
                  {/*<TouchableOpacity*/}
                  {/*style={{backgroundColor: commonStyle.clear, width: rpx(22), height: rpx(40), marginLeft: 10}}*/}
                  {/*onPress={() => {*/}
                  {/*this.props.navigation.goBack()*/}
                  {/*}}>*/}
                  {/*<Image style={{width: rpx(22), height: rpx(40)}}*/}
                  {/*source={require('../img/white_arraw_icon.png')}/>*/}
                  {/*</TouchableOpacity> : null*/}
                  {/*}*/}
                  {
                    isL ?
                      <Text
                        style={{
                          backgroundColor: commonStyle.clear,
                          color: commonStyle.white,
                          marginLeft: 10
                        }}>{title}</Text> : null
                  }
                </View>
                <View
                  style={{flexDirection: 'row', alignItems: commonStyle.center, justifyContent: commonStyle.between}}>
                  {/*<TouchableOpacity*/}
                  {/*style={styles.navToolBar}*/}
                  {/*onPress={() => alert('切换电视！')}>*/}
                  {/*<Image name={'oneIcon|tv_o'} size={20} color={commonStyle.white}/>*/}
                  {/*</TouchableOpacity>*/}
                  {/*<TouchableOpacity*/}
                  {/*style={styles.navToolBar}*/}
                  {/*onPress={() => alert('开启VR！')}>*/}
                  {/*<Image name={'oneIcon|video_o'} size={20} color={commonStyle.white}/>*/}
                  {/*</TouchableOpacity>*/}
                  {/*{*/}
                  {/*orientation !== 'PORTRAIT' ?*/}
                  {/*<View style={{flexDirection: commonStyle.row, alignItems: commonStyle.center}}>*/}
                  {/*<TouchableOpacity*/}
                  {/*style={[styles.navToolBar, {borderColor: commonStyle.white, borderWidth: 0.5, padding: 3}]}*/}
                  {/*onPress={() => alert('开启弹幕！')}>*/}
                  {/*<Text style={{color: commonStyle.white, fontSize: 12}}>弹</Text>*/}
                  {/*</TouchableOpacity>*/}
                  {/*<TouchableOpacity*/}
                  {/*style={styles.navToolBar}*/}
                  {/*onPress={() => alert('分享！')}>*/}
                  {/*<Image name={'oneIcon|share_dot_o'} size={20} color={commonStyle.white}/>*/}
                  {/*</TouchableOpacity>*/}
                  {/*<TouchableOpacity*/}
                  {/*style={styles.navToolBar}*/}
                  {/*onPress={() => alert('下载！')}>*/}
                  {/*<Image name={'oneIcon|download_o'} size={20} color={commonStyle.white}/>*/}
                  {/*</TouchableOpacity>*/}
                  {/*<TouchableOpacity*/}
                  {/*style={styles.navToolBar}*/}
                  {/*onPress={() => alert('设置画面！')}>*/}
                  {/*<Image name={'oneIcon|more_v_o'} size={20} color={commonStyle.white}/>*/}
                  {/*</TouchableOpacity>*/}
                  {/*</View> : null*/}
                  {/*}*/}
                </View>
              </View>

            </View> : <View style={{height: commonStyle.navContentHeight, backgroundColor: 'transparent'}}/>
        }
        {/*{*/}
        {/*orientation !== 'PORTRAIT' ?*/}
        {/*<TouchableOpacity*/}
        {/*style={{marginHorizontal: 10, backgroundColor: commonStyle.clear, width: 30, height: 30, alignItems: commonStyle.center, justifyContent: commonStyle.center}}*/}
        {/*onPress={() => this.setState({isLock: !this.state.isLock})}*/}
        {/*>*/}
        {/*<Image name={`oneIcon|${this.state.isLock ? 'locked_o' : 'unlocked_o'}`} size={20} color={commonStyle.white} style={{backgroundColor: commonStyle.blue}}/>*/}
        {/*</TouchableOpacity> : null*/}
        {/*}*/}
        {
          this.state.isTouchedScreen && !isLock ?
            <View style={[styles.toolBarStyle, {height: isL ? rpx(110) : rpx(90)}]}>
              <LinearGradient colors={['transparent', '#666666']}
                              style={{flex: 1, height: isL ? rpx(110) : rpx(90), opacity: 0.5}}/>
              <View style={[styles.toolBarStyleInner, {width: w}]}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => this.play()}>
                  <Image style={{width: 26, height: 26}}
                         source={this.state.paused ? require('./../img/play.png') : require('./../img/pause.png')}/>
                </TouchableOpacity>
                <View style={styles.progressStyle}>
                  <Text style={styles.timeStyle}>{this.formatMediaTime(Math.floor(this.state.currentTime))}</Text>
                  <Slider
                    style={styles.slider}
                    value={this.state.slideValue}
                    maximumValue={this.state.duration}
                    minimumTrackTintColor={commonStyle.themeColor}
                    maximumTrackTintColor={commonStyle.iconGray}
                    thumbImage={require('../img/slider.png')}
                    step={1}
                    onValueChange={value => this.onSeek(value)}
                    onSlidingComplete={value => this.player.seek(value)}
                  />
                  <View style={{flexDirection: 'row', justifyContent: 'flex-end', width: 35}}>
                    <Text style={{
                      color: commonStyle.white,
                      fontSize: 12
                    }}>{this.formatMediaTime(Math.floor(this.state.duration))}</Text>
                  </View>
                </View>
                {
                  orientation === 'PORTRAIT' ?
                    <TouchableOpacity activeOpacity={0.8} onPress={() => {
                      this.toFullScreen()
                    }}>
                      <Image style={{width: 25, height: 25}} source={require("./../img/full_screen.png")}/>
                    </TouchableOpacity> :
                    <TouchableOpacity activeOpacity={0.8} onPress={() => {
                      Orientation.lockToPortrait();
                      this.props.navigation.goBack()
                    }}>
                      <Image style={{width: 25, height: 25}} source={require("./../img/not_full_screen.png")}/>
                    </TouchableOpacity>
                }
              </View>
            </View>
            : <View style={{height: 40}}/>
        }
        {/*{this.renderModal()}*/}
      </TouchableOpacity> : <View/>
    )
  }
}

const styles = StyleSheet.create({
  movieContainer: {
    justifyContent: 'space-between'
  },
  videoPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  navContentStyle: {
    height: rpx(90),
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center'
  },
  navContentStyleInner: {
    height: rpx(90),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    position: 'absolute'
  },
  toolBarStyle: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    height: rpx(110),
  },
  toolBarStyleInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'space-around',
    flex: 1,
    height: rpx(90),
    position: 'absolute',
    top: 0
  },
  timeStyle: {
    width: 35,
    color: commonStyle.white,
    fontSize: 12
  },
  slider: {
    flex: 1,
    marginHorizontal: 5,
    height: 25
  },
  progressStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: 10
  },
  indicator: {
    width: deviceInfo.deviceWidth,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navToolBar: {
    backgroundColor: commonStyle.clear,
    marginHorizontal: 5
  }
});
