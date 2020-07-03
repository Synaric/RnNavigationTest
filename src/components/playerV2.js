import React from 'react';
import {
  AppState,
  AsyncStorage,
  BackHandler,
  Dimensions,
  Image,
  Platform,
  Slider,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import PropTypes from 'prop-types';
import SystemSetting from 'react-native-system-setting'
import LinearGradient from 'react-native-linear-gradient';
import {height, isIphoneX, rpx, statusBarHeight, titleHeight, width} from "../utils/adapter";
// import {rpx} from "../utils/adapter";
import Orientation from 'react-native-orientation'
import Video from "react-native-video";
import {log} from "../utils/utils";
import {post} from "../request/API";

export default class PlayerV2 extends React.Component {

  static propTypes = {
    isAudio: PropTypes.bool,
    chapterInfo: PropTypes.object
  };

  static defaultProps = {
    isAudio: false
  };

  constructor(props) {
    super(props);
    this.state = {
      fullScreen: false,
      initVolume: 1.0,
      volume: 1.0,
      initBrightness: 1.0,
      brightness: 1.0,
      initTime: 0,
      tempCurrentTime: null,
      slideValue: 0.00,
      currentTime: 0.00,
      duration: 0.00,
      enableSetTime: true,
      paused: true,
      playerLock: false,
        // canShowCover: false,
      canShowCover: true,
      isTouchedScreen: false,
      showVolumeSlider: false,
      showBrightnessSlider: false,
      showLoading: false,
      showTimeSlider: false,
      isFirstClick: true
    };
    this.touchTimer = null;
    this.sliderTimer = null;
    this.isL = false;

    SystemSetting.getVolume().then((volume) => {
      SystemSetting.getBrightness().then((brightness) => {
        this.setState({volume, brightness, initVolume: volume, initBrightness: brightness})
      });
    });

    this.backListener = () => {
      if (this.state.fullScreen) {
        this.toggleFullScreen();
        return true
      }
      return false
    };
    this.appStateListener = (next) => {
      if (next === 'background') {
        this.dismissFullScreen()
        if (!this.props.isAudio) {
          this.pause();
        }
      }
    };

    this.touchAction = {
      x: null,
      y: null,
      limitX: null,
      limitY: null,
      slideDirection: null,
      isClick: true
    };

    this.gestureHandlers = {
      onStartShouldSetResponder: (evt) => {
        log('onStartShouldSetResponder');
        return true;
      },

      onMoveShouldSetResponder: (evt) => {
        log('onMoveShouldSetResponder');
        return !this.state.paused;
      },

      onResponderGrant: (evt) => {
        log('onResponderGrant');
      },

      onResponderReject: (evt) => {
        log('onResponderReject');
      },

      onResponderStart: (evt) => {
        log('onResponderStart', evt.nativeEvent.locationX, evt.nativeEvent.locationY);
        this.touchAction.x = evt.nativeEvent.locationX;
        this.touchAction.y = evt.nativeEvent.locationY;
        SystemSetting.getVolume().then((volume) => {
          SystemSetting.getAppBrightness().then((brightness) => {
            this.setState({
              initVolume: volume,
              initBrightness: brightness,
              initTime: this.state.currentTime / this.state.duration,
              // tempCurrentTime: this.state.currentTime / this.state.duration,
              showVolumeSlider: false,
              showBrightnessSlider: false,
              showTimeSlider: false
            });
            if (this.sliderTimer) {
              clearTimeout(this.sliderTimer);
              this.sliderTimer = null;
            }
          });
        });
      },

      onResponderMove: (evt) => {
        let formatValue = (v) => {
          if (v > 1.0) return {v: 1.0, outOfRange: true};
          if (v < 0) return {v: 0, outOfRange: true};
          return {v, outOfRange: false}
        };

        let resolveOutOfRange = (outOfRange, props, onSlideBack) => {
          if (outOfRange) {
            if (this.touchAction[props.limit] !== null
              && Math.abs(this.touchAction[props.v] - props.current) < Math.abs(this.touchAction[props.v] - this.touchAction[props.limit])) {
              log('outOfRange', this.touchAction[props.v], props.current, this.touchAction[props.limit]);
              // 用户把亮度、音量调到极限（0或1.0）后，继续滑动，并且反向滑动，此时重新定义基准落点
              this.touchAction[props.v] = this.touchAction[props.limit];
              this.touchAction[props.limit] = null;
              if (onSlideBack) onSlideBack()
            } else {
              this.touchAction[props.limit] = props.current;
            }
          }
        };

        let currentX = evt.nativeEvent.locationX;
        let currentY = evt.nativeEvent.locationY;
        let realX = evt.nativeEvent.pageX;
        let realY = evt.nativeEvent.pageY;
        let {fullScreen} = this.state;
        let {videoStyle} = this.props;
        let w = fullScreen ? Dimensions.get('window').width : videoStyle.width;
        let h = fullScreen ? Dimensions.get('window').height : videoStyle.height;

        if (realX < 0 || realX > w || realY < 0 || realY > h) {
          return
        }

        if (!this.touchAction.slideDirection) {
          if (Math.abs(currentY - this.touchAction.y) > rpx(100)) {
            this.touchAction.slideDirection = 'v';
            this.setState({tempCurrentTime: null})
          } else if (Math.abs(currentX - this.touchAction.x) > rpx(100)) {
            this.touchAction.slideDirection = 'h'
          }
        }

        if (this.touchAction.slideDirection === 'v') {
          log('onResponderMove v', this.touchAction.x, this.touchAction.y);
          this.touchAction.isClick = false;
          let dy = this.touchAction.y - currentY;
          let dv = dy / (h / 1.5);
          if (this.touchAction.x > w / 2) {
            let {v, outOfRange} = formatValue(this.state.initVolume + dv);
            log('volume', v, outOfRange);
            this.setState({volume: v, showVolumeSlider: true});
            SystemSetting.setVolume(v);
            resolveOutOfRange(outOfRange, {current: currentY, v: 'y', limit: 'limitY'}, () => {
              this.setState({initVolume: v})
            })
          } else {
            let {v, outOfRange} = formatValue(this.state.initBrightness + dv);
            log('brightness', v, outOfRange);
            this.setState({brightness: v, showBrightnessSlider: true});
            SystemSetting.setAppBrightness(v);
            resolveOutOfRange(outOfRange, {current: currentY, v: 'y', limit: 'limitY'}, () => {
              this.setState({initBrightness: v})
            })
          }
        } else if (this.touchAction.slideDirection === 'h') {
          log('onResponderMove h');
          this.touchAction.isClick = false;
          let dx = currentX - this.touchAction.x;
          let dv = dx / (w / 2);
          let {v, outOfRange} = formatValue(this.state.initTime + dv);
          log('time', v, outOfRange);
          this.setState({tempCurrentTime: v, showTimeSlider: true});
          resolveOutOfRange(outOfRange, {current: currentX, v: 'x', limit: 'limitX'}, () => {
            this.setState({initTime: v})
          })
        }
      },

      onResponderRelease: (evt) => {
        log('onResponderRelease');
      },

      onResponderEnd: (evt) => {
        let currentX = evt.nativeEvent.locationX;
        let currentY = evt.nativeEvent.locationY;
        let {fullScreen, tempCurrentTime, duration} = this.state;
        if (Math.abs(currentX - this.touchAction.x) <= rpx(100) && this.touchAction.isClick) {
          // 触发点击
          if (this.state.paused) {
            this.play()
          } else {
            this.onTouchedScreen()
          }
        }
        if (!this.touchAction.isClick) {
          this.setState({initVolume: this.state.volume, initBrightness: this.state.brightness});
        }
        this.sliderTimer = setTimeout(() => {
          this.sliderTimer = null;
          this.setState({showVolumeSlider: false, showBrightnessSlider: false, tempCurrentTime: null})
        }, 1000);
        if (tempCurrentTime != null) {
          let time = Math.ceil(tempCurrentTime * duration);
          this.onSeek(time);
          this.player.seek(time);
          this.setState({enableSetTime: true, showTimeSlider: false, showLoading: time < this.state.duration})
        } else {
          this.setState({showTimeSlider: false, showLoading: false})
        }
        this.touchAction = {
          x: null,
          y: null,
          slideDirection: null,
          limitX: null,
          limitY: null,
          isClick: true
        };
      },

      onResponderTerminationRequest: (evt) => {
        log('onResponderTerminationRequest');
        return true;
      },

      onResponderTerminate: (evt) => {
        log('onResponderTerminate');
      }
    }
  }

  componentDidMount() {
    // Orientation.addOrientationListener(this._orientationDidChange);
    BackHandler.addEventListener('hardwareBackPress', this.backListener);
    AppState.addEventListener('change', this.appStateListener);
    if (this.props.cover) {
      this.setState({canShowCover: true})
    }
  }

  _orientationDidChange = (orientation) => {
    if (orientation === 'PORTRAIT') {
      return
    }
    this.isL = orientation === 'LANDSCAPE'
  };

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backListener);
    AppState.removeEventListener('change', this.appStateListener);
    // Orientation.removeOrientationListener(this._orientationDidChange);
  }

  formatVideoStyle(videoStyle) {
    let r = Object.assign({}, videoStyle);
    r.position = 'relative';
    r.zIndex = 99999;
    return r;
  }

  formatFullScreenContainer() {
    const w = Dimensions.get('window').width;
    const h = Dimensions.get('window').height;
    return {
      position: 'absolute',
      left: 0,
      top: 0,
      width: this.isL ? w : h,
      height: this.isL ? h : w,
      zIndex: 99999,
      backgroundColor: '#000'
    }
  }

  onPreNavigate = () => {
    if (!this.state.paused) {
      this.pause()
    }
  };

  onTouchedScreen = () => {
    if (this.state.isTouchedScreen) {
      this.setState({isTouchedScreen: false});
      clearTimeout(this.touchTimer);
      return
    }
    this.setState({isTouchedScreen: !this.state.isTouchedScreen}, () => {
      if (this.state.isTouchedScreen) {
        this.touchTimer = setTimeout(() => {
          this.touchTimer = null;
          this.setState({isTouchedScreen: false})
        }, 10000)
      }
    })
  };

  play() {
    let {chapterInfo} = this.props;
    console.log('-----chapterInfo----------', chapterInfo)
    this.setState({
      // canShowCover: false,
      // canShowCover: this.props.isAudio,
        canShowCover: this.props.canShowCover,
      paused: !this.state.paused,
    }, () => {
      console.log(this.paused)
        // this.setState({
        //     isFirstClick: false
        // })
      // if (this.state.isFirstClick && !this.state.paused) {
      //   post(this, 'api/addUserWatchVideoEvent', {cor_id: chapterInfo.corId, video_id: chapterInfo.videoId}, (res) => {
      //     if (res.code === 1) {
      //       this.setState({
      //         isFirstClick: false
      //       })
      //     }
      //   }, () => {})
      // }
    })
  }

  changeVideo () {
    this.setState({
        paused: true
    })
  }

  pause() {
    this.setState({
      // canShowCover: false,
      paused: true,
    })
  }

  setDuration(duration) {
    this.setState({duration: duration.duration})
  }

  onLoad(duration) {
    this.setDuration(duration);
  }

  onError(err) {
    log('onError', err)
  }

  onSeek(value) {
    //this.setState({currentTime: value});

    if (this.props.maxPlayTime && this.props.maxPlayTime <= value) {
      this.setState({paused: true, currentTime: 0});
      this.player.seek(0);
      if (this.props.onReachMaxPlayTime) this.props.onReachMaxPlayTime()
    } else {
      this.setState({currentTime: value, enableSetTime: false, showLoading: true});
    }
  }

  onEnd(data) {
    //this.player.seek(0);
    this.setState({paused: true, currentTime: 0}, () => {
      this.player.seek(0);
    })
  }

  setTime(data) {
    let sliderValue = parseInt(this.state.currentTime);
    if (this.state.enableSetTime) {
      this.setState({
        slideValue: sliderValue,
        currentTime: data.currentTime,
        showLoading: false
      });
    } else {
      this.setState({
        showLoading: false
      });
    }
    if (this.props.maxPlayTime && this.props.maxPlayTime <= data.currentTime) {
      this.setState({paused: true, currentTime: 0});
      this.player.seek(0);
      if (this.props.onReachMaxPlayTime) this.props.onReachMaxPlayTime()
    }
  }

  formatMediaTime(duration) {
    let min = Math.floor(duration / 60);
    let second = duration - min * 60;
    min = min >= 10 ? min : '0' + min;
    second = second >= 10 ? second : '0' + second;
    return min + ':' + second
  }

  dismissFullScreen() {
    // if (Platform.OS === 'android') {
    //   this.player.dismissFullscreenPlayer();
    // }
    if (this.props.onFullScreenChange) {
      this.props.onFullScreenChange(false)
    }
    Orientation.lockToPortrait();
    clearTimeout(this.touchTimer);
    this.setState({fullScreen: false, isTouchedScreen: false})
  }

  toggleFullScreen() {
    if (this.player) {
      let {fullScreen} = this.state;
      if (this.props.onFullScreenChange) {
        this.props.onFullScreenChange(!fullScreen)
      }
      if (fullScreen) {
        // if (Platform.OS === 'android') {
        //   this.player.dismissFullscreenPlayer();
        // }
        this.isL = false;
        Orientation.lockToPortrait()
      } else {
        if (Platform.OS === 'android') {
          this.player.presentFullscreenPlayer();
        }
        this.isL = true;
        Orientation.lockToLandscape()
      }
      clearTimeout(this.touchTimer);
      this.setState({fullScreen: !fullScreen, isTouchedScreen: false})
    }
  }

  render() {
    let {url, videoStyle, title, isAudio} = this.props;
    let {paused, fullScreen, isTouchedScreen, duration, showVolumeSlider, showBrightnessSlider, showTimeSlider, showLoading} = this.state;
    let {volume, brightness, tempCurrentTime} = this.state;
    const w = fullScreen ? Dimensions.get('window').width : videoStyle.width;
    let containerStyle = this.formatVideoStyle(videoStyle);
    return (
      <View style={fullScreen ? this.formatFullScreenContainer() : containerStyle}
            activeOpacity={1}>
        <Video source={{uri: url}} //require('../imgs/English_sing.mp3')
               ref={ref => this.player = ref}
               rate={1}
               volume={1.0}
               muted={false}
               paused={paused}
               audioOnly={false}
               resizeMode="contain"
               repeat={false}
               playInBackground={isAudio}
               ignoreSilentSwitch={"ignore"}
               progressUpdateInterval={250.0}
               style={[fullScreen ? this.formatFullScreenContainer() : styles.videoPlayer]}
               onSeek={() => {
               }}
               onLoad={data => this.onLoad(data)}
               onError={(data) => this.onError(data)}
               onProgress={(data) => this.setTime(data)}
               onEnd={(data) => this.onEnd(data)}
        />

        {isAudio ? <Image style={styles.videoPlayer} source={{uri: this.props.cover}}/> : null}

        {
          paused ?
            <TouchableOpacity activeOpacity={0.8}
                              style={[fullScreen ? this.formatFullScreenContainer() : styles.videoPlayer, {
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }]}
                              onPress={() => {
                                this.play()
                              }}>
              {this.state.canShowCover ? <Image style={styles.videoPlayer} source={{uri: this.props.cover}}/> : null}
              <Image style={{width: rpx(75), height: rpx(75)}} source={require("./../imgs/play_video_icon.png")}/>
            </TouchableOpacity> : null
        }

        <View style={[fullScreen ? this.formatFullScreenContainer() : containerStyle, {backgroundColor: 'transparent'}]}
              pointerEvents={paused ? 'box-none' : 'auto'} {...this.gestureHandlers} />

        {
          showVolumeSlider &&
          <View style={[styles.verticalSliderContainer, {position: 'absolute', top: rpx(120), left: 0, right: 0}]}>
            <View style={styles.verticalSlider}>
              <Image style={{width: rpx(32), height: rpx(32)}}
                     source={volume <= 0 ? require('../imgs/no_volume.png') : require('../imgs/volume.png')}/>
              <View style={{height: rpx(4), width: rpx(192), flexDirection: 'row'}}>
                <View style={{height: rpx(4), width: rpx(192 * volume), backgroundColor: '#ca3839'}}/>
                <View style={{height: rpx(4), flex: 1, backgroundColor: '#787878'}}/>
              </View>
            </View>
          </View>
        }

        {
          showBrightnessSlider &&
          <View style={[styles.verticalSliderContainer, {position: 'absolute', top: rpx(120), left: 0, right: 0}]}>
            <View style={styles.verticalSlider}>
              <Image style={{width: rpx(32), height: rpx(32)}}
                     source={require('../imgs/brightness.png')}/>
              <View style={{height: rpx(4), width: rpx(192), flexDirection: 'row'}}>
                <View style={{height: rpx(4), width: rpx(192 * brightness), backgroundColor: '#ca3839'}}/>
                <View style={{height: rpx(4), flex: 1, backgroundColor: '#787878'}}/>
              </View>
            </View>
          </View>
        }

        {
          showTimeSlider &&
          <View style={[styles.verticalSliderContainer, {position: 'absolute', top: rpx(120), left: 0, right: 0}]}>
            <View style={styles.smallSlider}>
              <Text style={{
                color: 'white',
                fontSize: rpx(26)
              }}>{this.formatMediaTime(Math.floor(tempCurrentTime * duration))}/{this.formatMediaTime(Math.floor(duration))}</Text>
            </View>
          </View>
        }
        {
          showLoading &&
          <View style={styles.loadingContainer}>
            <Image style={{width: rpx(100), height: rpx(100)}} source={require('../imgs/loading.gif')}/>
          </View>
        }
        {
          isTouchedScreen ?
            <View style={[styles.navContentStyle, {width: w, height: fullScreen ? rpx(160) : rpx(90)}]}>
              <LinearGradient colors={['#666666', 'transparent']}
                              style={{flex: 1, height: fullScreen ? rpx(160) : rpx(90), opacity: 0.5}}/>
              <View style={[styles.navContentStyleInner]}>
                {
                  fullScreen ?
                    <TouchableOpacity
                      style={{width: rpx(22), height: rpx(40), marginLeft: rpx(30)}}
                      onPress={() => {
                        this.toggleFullScreen()
                      }}>
                      <Image style={{width: rpx(22), height: rpx(40)}}
                             source={require('../imgs/back_arrow_icon_white.png')}/>
                    </TouchableOpacity> : null
                }
                {
                  fullScreen ?
                    <TouchableOpacity onPress={() => {
                      this.toggleFullScreen()
                    }}>
                      <Text
                        style={{
                          backgroundColor: 'transparent',
                          color: 'white',
                          marginLeft: rpx(50)
                        }}>{title}</Text>
                    </TouchableOpacity>
                    : null
                }
              </View>

            </View> : null
        }


        {
          isTouchedScreen &&
          <View style={[styles.toolBarStyle, {width: w, height: fullScreen ? rpx(110) : rpx(90)}]}>
            <LinearGradient colors={['transparent', '#666666']}
                            style={{flex: 1, height: fullScreen ? rpx(110) : rpx(90), opacity: 0.5}}/>
            <View style={[styles.toolBarStyleInner, {width: w}]}>
              <TouchableOpacity activeOpacity={0.8} onPress={() => this.play()}>
                <Image style={{width: rpx(50), height: rpx(50)}}
                       source={this.state.paused ? require('./../imgs/play.png') : require('./../imgs/pause.png')}/>
              </TouchableOpacity>
              <View style={styles.progressStyle}>
                <Text style={styles.timeStyle}>{this.formatMediaTime(Math.floor(this.state.currentTime))}</Text>
                <Slider
                  style={styles.slider}
                  value={this.state.slideValue}
                  maximumValue={this.state.duration}
                  minimumTrackTintColor={'#ca3839'}
                  maximumTrackTintColor={'#989898'}
                  thumbImage={require('../imgs/slider.png')}
                  step={1}
                  onValueChange={value => this.onSeek(value)}
                  onSlidingComplete={value => {
                    this.player.seek(value);
                    this.setState({enableSetTime: true})
                  }}
                />
                <View style={{flexDirection: 'row', justifyContent: 'flex-end', width: rpx(70)}}>
                  <Text style={{
                    color: 'white',
                    fontSize: rpx(24)
                  }}>{this.formatMediaTime(Math.floor(duration))}</Text>
                </View>
              </View>
              {
                fullScreen ?
                  <TouchableOpacity activeOpacity={0.8} onPress={() => {
                    this.toggleFullScreen()
                  }}>
                    <Image style={{width: rpx(50), height: rpx(50)}} source={require("./../imgs/not_full_screen.png")}/>
                  </TouchableOpacity> :
                  <TouchableOpacity activeOpacity={0.8} onPress={() => {
                    this.toggleFullScreen()
                  }}>
                    <Image style={{width: rpx(50), height: rpx(50)}} source={require("./../imgs/full_screen.png")}/>
                  </TouchableOpacity>
              }
            </View>
          </View>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({

  fullScreenContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  },
  videoPlayer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#b1b1b1'
  },
  toolBarStyle: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    height: rpx(110),
    zIndex: 100000
  },
  toolBarStyleInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: rpx(30),
    justifyContent: 'space-around',
    flex: 1,
    height: rpx(90),
    position: 'absolute',
    top: 0
  },
  slider: {
    flex: 1,
    marginHorizontal: 5,
    height: rpx(90)
  },
  progressStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: rpx(20)
  },
  timeStyle: {
    width: rpx(70),
    color: 'white',
    fontSize: rpx(24)
  },
  navContentStyle: {
    height: rpx(90),
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    zIndex: 100001,
  },
  navContentStyleInner: {
    height: rpx(90),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: rpx(20),
    position: 'absolute'
  },
  verticalSlider: {
    width: rpx(320),
    height: rpx(84),
    borderRadius: rpx(42),
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: rpx(40)
  },
  smallSlider: {
    width: rpx(220),
    height: rpx(84),
    borderRadius: rpx(42),
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticalSliderContainer: {
    height: rpx(84),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100001
  },
  loadingContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100001
  }
});
