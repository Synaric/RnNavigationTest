import React from 'react'
import {Image, StyleSheet, Text, TouchableOpacity, View, StatusBar, TextInput} from 'react-native'
import {rpx, titleHeight, statusBarHeight, width} from '../utils/adapter'
import NavigationService from '../utils/navigationService'
import PropTypes from 'prop-types'

export default class NavBar extends React.Component {
    static propTypes = {
        backgroundType: PropTypes.bool,
        leftBtn: PropTypes.bool,
        editable: PropTypes.bool
    }

    static defaultProps = {
        backgroundType: true,
        leftBtn: true,
        editable: false,
        hasSearchBtn: false,
        inputSearch: true,
        isVideoDetail: false
    }

    // showLogo:
    // en
    constructor (props) {
        super(props)
        this.textInput = null
        this.state = {
            content: ''
        }
    }

    render () {
        let {content} = this.state
        let {isVideoDetail, inputSearch,hasSearchBtn, editable, title, leftBtn, leftBtnFunc, rightBtn, rightSearchBtn, backgroundType, rightSearchBtnClick, fullScreen, showLogo} = this.props
        if (leftBtn === undefined) leftBtn = true
        return (
            <View style={[styles.navBar, {
                backgroundColor: backgroundType ? '#17894c' : 'transparent',
                height: fullScreen ? titleHeight : titleHeight - statusBarHeight,
                position: !isVideoDetail ? 'relative' : 'absolute',
                zIndex: !isVideoDetail ? 1 : 999990,
            }]}>
                <View style={[styles.titleBarContent, {marginTop: fullScreen ? statusBarHeight : null}]}>
                    <View style={{width: rpx(710), marginHorizontal: rpx(20), flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{width: rpx(68), height: rpx(68), justifyContent: 'center'}}>
                            <TouchableOpacity style={{alignItems: 'center', justifyContent: 'center', width: rpx(68), height: rpx(68)}} onPress={this.onNavigateBack}>
                                <Image style={[showLogo ? {width: rpx(68), height: rpx(68)} : {width: rpx(40), height: rpx(40)}]}
                                       source={showLogo ? {uri: 'http://weixinfactory.di1game.com/weixinfactory/Icon/20191227/141048/da5b564084ac441586207920d370a487.png'} : require('../imgs/arrow_back.png')}/>
                            </TouchableOpacity>
                            </View>
                            {
                                title ? <View style={{position: 'absolute', top: rpx(0), left: rpx(0), width: rpx(690), height: rpx(68), justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={{fontSize: rpx(36), color: '#00070f'}}>{title}</Text>
                                </View> : null}
                                {
                                    inputSearch ? 
                                <TouchableOpacity style={{
                                    marginLeft: rpx(15), flex: 1, height: rpx(68), flexDirection: 'row', alignItems: 'center',
                                    paddingHorizontal: rpx(30),
                                    backgroundColor: '#f3f6fa',
                                    borderRadius: rpx(10)
                                }} onPress={this.skipToSearch}>
                                    <Image style={{width: rpx(26), height: rpx(27)}}
                                           source={require('../imgs/search_icon.png')}/>
                                    <TextInput
                                        ref={ref => this.textInput = ref}
                                        placeholder={'请输入关键词'}
                                        editable={editable}
                                        value={content}
                                        onChangeText={(text) =>  this.setState({
                                            content: text
                                        })}
                                        style={{marginLeft: rpx(20), height: rpx(108), fontSize: rpx(26), flex: 1,
                                        }}
                                    />
                                </TouchableOpacity> : null
                            }
                        
                        {
                            hasSearchBtn ?
                                <TouchableOpacity onPress={() => {this.onClickSearch(content)}}>
                                    <Text style={[styles.btnSearch, { paddingHorizontal: rpx(20),  paddingVertical: rpx(10) }]}>搜索</Text>
                                </TouchableOpacity> : null
                        }
                    </View>
                    {/*{*/}
                    {/*leftBtn ?*/}
                    {/*<TouchableOpacity style={styles.leftBtnTouch}*/}
                    {/*activeOpacity={0.8} onPress={leftBtnFunc ? leftBtnFunc : this.onNavigateBack}>*/}
                    {/*<Image style={styles.leftBtnImg}*/}
                    {/*source={backgroundType ? require('../imgs/arrow_back.png') : require('../imgs/white_arraw_icon.png')}/>*/}
                    {/*</TouchableOpacity> : <View style={styles.leftBtnTouch}/>*/}
                    {/*}*/}
                    {/*<View style={styles.middle}>*/}
                    {/*<Text numberOfLines={1} ellipsizeMode={'tail'}*/}
                    {/*style={[styles.middleTitle, {color: backgroundType ? '#313332' : 'black'}]}>{title}</Text>*/}
                    {/*</View>*/}
                    {/*{*/}
                    {/*rightBtn ?*/}
                    {/*<TouchableOpacity style={styles.rightBtnTouch}*/}
                    {/*activeOpacity={0.8}>*/}
                    {/*<Text style={[styles.rightBtnTxt, {color: backgroundType ? '#313332' : '#fff'}]}>{rightBtn.text}</Text>*/}
                    {/*</TouchableOpacity> : <View style={styles.rightBtnTouch}/>*/}
                    {/*}*/}
                </View>
            </View>
        )
    }

    skipToSearch () {
        NavigationService.navigate('Search', {})
    }

    onClickSearch = (content) => {
            console.log('this.state.content', content)
            this.textInput ? this.textInput.blur() : null
            this.props.onClickSearch(content)
            console.log('onClickSearchonClickSearch', content)
    }

    onNavigateBack = () => {
        NavigationService.goBack()
    }
}

const styles = StyleSheet.create({
    navBar: {
        position: 'relative',
        width: width,
        height: titleHeight,
    },
    statusBar: {
        width: width,
        height: statusBarHeight,
        backgroundColor: 'transparent'
    },
    titleBarContent: {
        flexDirection: 'row',
        alignItems: 'center',
        width: width,
        justifyContent: 'space-between',
        height: titleHeight - statusBarHeight,
        marginTop: statusBarHeight
    },
    leftBtnTouch: {
        width: rpx(180),
        height: titleHeight - statusBarHeight,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: rpx(30),
    },
    leftBtnImg: {
        width: rpx(28),
        height: rpx(28),
    },
    middle: {
        width: width - rpx(360),
        height: titleHeight - statusBarHeight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    middleTitle: {
        fontSize: rpx(36),
    },
    rightBtnTouch: {
        width: rpx(180),
        height: titleHeight - statusBarHeight,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingRight: rpx(30),
    },
    rightBtnTxt: {
        fontSize: rpx(26)
    },
})
