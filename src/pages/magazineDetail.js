import {Image, Modal, Platform, ScrollView, StyleSheet, Text, View} from 'react-native'
import React from 'react'
import BasePage from './basePage'
import {rpx} from '../util/adapterUtils'
import NavBar from '../components/navBar'
import {formatDate, getFullPicUrl, tagAddStyle} from '../util/artUtils'
import HTML from 'react-native-render-html'
import ImageViewer from 'react-native-image-zoom-viewer'
import Btn from '../components/btn'


export default class MagazineDetail extends BasePage {

  constructor (props) {
    super(props)
    this.state = {
      showPreviewImage: false,
      previewImages: [],
      detail: {
        UserInfo: {
          User: {
            face: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1594039638858&di=0cf1cfadfdcf57c1ea6608b0aa1f89ea&imgtype=0&src=http%3A%2F%2Ft8.baidu.com%2Fit%2Fu%3D3498570028%2C1532773537%26fm%3D193',
            nickName: '光明教育社'
          }
        },
        properties: {
          content:
            '<div style="text-align: justify;"><img src="https://weixinfactory.di1game.com/educator/cover/2020624/79302e8d-3933-4aa5-bcfb-a6cfd848dc1b.png" /><br /><br /><span style="font-weight:bold;"><span style="font-size:20px;">本期导读</span></span></div><p style="text-align: justify;"><br /><span style="font-size:18px;">由于托育行业的特殊性，复学的脚步要来得更慢；即便复学，还有着可预见的&ldquo;倒春寒&rdquo;，多数托育机构都在咬着牙前行。起步阶段，行业却面临洗牌，也迫使人们在托育&ldquo;热&rdquo;下进行冷思考。本期聚焦，我们邀请学者和一线从业者，共同探讨疫后托育发展相关问题。当整个行业走上健康发展之路，才能托起婴幼儿成长的灿烂明天。</span></p><p style="text-align: justify;"><br /><span style="font-size:18px;">&ldquo;我的孩子注意力不集中怎么办？&rdquo;本期成长马拉松，让我们听听学者老师讲讲，是什么是导致了孩子的不专注，以及培养孩子专注习惯的小妙招。</span></p><p style="text-align: justify;"><br /><span style="font-size:18px;">本期时势，我们关注校长职级制的实施状况。校长职级制在全国越来越多的地区实施，可是效果却参差不齐，背后的深层原因究竟为何？如何打通教育治理的&ldquo;堵点&rdquo;？</span></p><p style="text-align: justify;"><br /><span style="font-size:18px;">评价，对促进幼儿发展、教师成长以及教育质量提升有着重要的作用。但是在实践中，教师的评价行为却普遍滞后于评价观念的发展。本期问教解惑，我们选取了北京师范大学实验幼儿园在开展幼儿发展性评价时发生的一个鲜活案例，由此来看评价中教师存在的困惑与解决之道，以期为幼儿成长提供更有力的支持。</span></p><p style="text-align: justify;"><br /><span style="font-size:18px;">今年的全国学前教育宣传月主题是&ldquo;特殊的时光，不一样的陪伴&rdquo;，非常时期，家长和孩子该如何相处？作为家长，您是否真的了解自己的孩子？本期封面，我们邀请园长和学者将家长的疑惑各个击破。</span></p><div style="text-align: justify;"><br/><span style="font-weight:bold;"><span style="font-size:20px;">目录</span></span><br /><br /><img src="https://weixinfactory.di1game.com/educator/cover/2020624/5984d5d1-52d9-4772-9f95-ef314dc006dc.jpg" /><br /><br /><span style="font-weight:bold;"><span style="font-size:20px;">试读</span><br /><br /><span style="font-size:18px;">P07：从元年爆发到疫后变革，托育路向何方</span></span></div><p style="text-align: justify;"><span style="font-size:18px;">&ldquo;一周左右，我们就收到了50多个机构的申请，这还只是在广州和深圳地区。&rdquo;3月10日，某教育公司宣布预计投入2000万-3000万针对小微托育机构进行收购后，收到了大量的出售申请。疫情期间，人力成本、物业房租、偿还贷款和潜在的家长退费，化身压在托育机构头上的几座&ldquo;大山&rdquo;。而复园后生源回流的艰难已为大多数从业者所预料&mdash;&mdash;出于安全等因素考虑，短期内家长们更愿意将孩子留在家庭中照护。<br /><br />在这样一段特殊时期，托育机构面临哪些困难？自救中衍生出哪些服务新形态？如何借助机构力量，提升家庭养育能力？这对从业人员的职业素养提出了怎样的要求？行业又需要怎样的扶植与规范，才能让处于疫后变革时代的托育走得更远？本期聚焦，我们邀请学者和一线从业者，共同探讨疫后托育发展相关问题。</span></p><div style="text-align: justify;"><br /><span style="font-size:18px;"><span style="font-weight:bold;">P31：从幕后到台前，家庭教育如何跨越&ldquo;摩擦区&rdquo;</span></span></div><p style="text-align: justify;"><span style="font-size:18px;">2020年，疫情让孩子们度过了超长假期，被&ldquo;困&rdquo;在家中的幼儿和家长有了大把相处时间，也打破 了以往家庭教育的舒适区。有的父母和孩子充分利用宝贵的陪伴时间，心与心贴得更近，将防疫期变成亲子关系的流金岁月；有的父母却和孩子摩擦不断，家庭矛盾升级，彼此的隔阂愈来愈深。</span></p><p style="text-align: justify;"><br /><span style="font-size:18px;">今年全国学前教育宣传月主题为&ldquo;特殊的时光，不一样的陪伴&rdquo;。当非常时期的家教从幕后走向台前， 如何重新认识和深度理解家庭教育的价值与意义？如何引导父母更好地胜任教育职责做智慧家长？非常时期，家长们遇到了各自的&ldquo;疑难杂症&rdquo;，针对这些困惑，我们请园长和专家支招，逐一击破。</span></p><div style="text-align: justify;"><br />&nbsp;</div>'
        },
        time: '11:19',
        itemName: '《教育家》杂志2020年5月 第一期《教育家》杂志2020年5月 第一期',
        OrderFlash: 1
      },
      vip: 1,
      schoolRole: 1,
      showLoading: true
    }
  }


  static resolveStatusBar () {
    return {
      visible: true,
      style: 'dark',
      backgroundColor: 'white'
    }
  }

  getDetail (itemId) {
    this.getApi('/item/getItem', {itemId: itemId}, res => {
      let data = res.data
      data.properties.content = tagAddStyle(data.properties.content)
      data.properties.pic = data.properties.pic && getFullPicUrl(data.properties.pic)
      data.properties.share = data.properties.share && getFullPicUrl(data.properties.share)
      data.time = formatDate(new Date(data.createTime))
      this.setState({
        detail: data
      })
    })
  }

  render () {
    let {detail, vip, schoolRole} = this.state
    let platform = Platform.OS
    return (
      <View style={{flex: 1}}>
        <NavBar title={'杂志介绍'} navigator={this.navigator}/>
        {
          detail ? <ScrollView style={{flex: 1, backgroundColor: '#fff'}}
                               showsVerticalScrollIndicator={false}
                               contentContainerStyle={{
                                 alignItems: 'center',
                                 flexDirection: 'column',
                                 paddingHorizontal: rpx(30)
                               }}>
            <Text ellipsizeMode={'tail'}
                  numberOfLines={1} style={styles.mTitle}>{detail.itemName}</Text>
            <View style={styles.header}>
              <Btn onPress={() => {
                this.toSchoolDetail()
              }}>
                <Image style={styles.avatar} source={{uri: detail.UserInfo.User.face}}/>
              </Btn>
              <Btn onPress={() => {
                this.toSchoolDetail()
              }}>
                <Text style={styles.author}>{detail.UserInfo.User.nickName}</Text>
              </Btn>

              <Text style={styles.time}>{detail.time}</Text>
              <View style={{position: 'absolute', right: rpx(46), top: rpx(42)}}>
                <View style={styles.share}>
                  <Btn onPress={() => {
                    this.share()
                  }}>
                    <Image style={{width: rpx(36), height: rpx(36), position: 'absolute', left: 0, top: 0}}
                           source={require('../img/bottom-share.png')}/>
                  </Btn>
                </View>
              </View>
            </View>
            <HTML html={detail.properties.content}
                  imagesMaxWidth={rpx(690)}
                  style={{width: rpx(690)}}
                  onDOMImagePress={this.onDOMImagePress}/>
          </ScrollView> : null
        }
        {vip && detail ? <Text
          style={[{backgroundColor: schoolRole === 1 || schoolRole === 3 || vip || detail.OrderFlash || platform !== 'ios' ? '#d8201e' : '#b1b1b1'}, styles.bottomBtn]}>{schoolRole === 1 || schoolRole === 3 || vip || detail.OrderFlash ? '开始阅读' : (platform === 'ios' ? '由于相关条款，iOS暂不开放购买' : '立即购买会员，全部杂志免费阅读')}</Text> : null}

        {
          this.renderPreviewImageModal()
        }
      </View>
    )
  }

  toSchoolDetail = () => {

  }

  share = () => {

  }


  renderPreviewImageModal () {
    let {showPreviewImage, previewImages} = this.state
    return (
      <Modal visible={showPreviewImage} transparent={true}
             onRequestClose={() => {
               this.setState({showPreviewImage: false})
             }}
             onDismiss={() => {
               this.setState({showPreviewImage: false})
             }}>
        <ImageViewer imageUrls={previewImages}/>
      </Modal>
    )
  }

  onDOMImagePress = (e) => {
    this.print('onDOMImagePress', e)
    this.setState({
      showPreviewImage: true,
      previewImages: [{url: e.source.uri}]
    })
  }

  onLoad () {
    // this.getDetail()
  }
}

const styles = StyleSheet.create({
  mTitle: {
    width: rpx(690),
    height: rpx(92),
    marginLeft: rpx(30),
    lineHeight: rpx(92),
    fontSize: rpx(36),
    color: '#313332',
    borderBottomWidth: rpx(1),
    borderStyle: 'solid',
    borderColor: '#f2f2f2'
  },

  header: {
    width: rpx(750),
    height: rpx(126),
    position: 'relative'
  },

  avatar: {
    width: rpx(64),
    height: rpx(64),
    borderRadius: rpx(32),
    backgroundColor: '#f2f2f2',
    position: 'absolute',
    left: rpx(30),
    top: rpx(32)
  },

  author: {
    fontSize: rpx(26),
    height: rpx(26),
    lineHeight: rpx(30),
    color: '#313332',
    position: 'absolute',
    left: rpx(114),
    top: rpx(32)
  },

  time: {
    fontSize: rpx(22),
    height: rpx(22),
    lineHeight: rpx(22),
    color: '#b1b1b1',
    position: 'absolute',
    left: rpx(114),
    top: rpx(74)
  },

  share: {
    width: rpx(36),
    height: rpx(36),
    position: 'relative',
    alignItems: 'center'
  },

  bottomBtn: {
    width: rpx(750),
    height: rpx(98),
    fontSize: rpx(30),
    color: '#fff',
    lineHeight: rpx(98),
    textAlign: 'center',
    backgroundColor: '#d8201e'
  }
})
