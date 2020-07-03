import React from 'react';
import {Image, Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import {rpx} from "../utils/adapter";
import Swiper from 'react-native-swiper'
import PropTypes from 'prop-types';
import navigationService from '../utils/navigationService';

export default class Banner extends React.Component {
    static propTypes = {
        urlKey: PropTypes.string
    };

    static defaultProps = {
        urlKey: 'pic'
    };

    onPressBannerItem (it) {
        // console.log('WebViewPageWebViewPageWebViewPage', it)
        navigationService.navigate('WebViewPage', {url: it.properties.link})
    } 

    render() {
        let {banners, bannerStyle, paginationStyle,  urlKey} = this.props;
        return (
            banners && banners.length ?
                (Platform.OS === 'ios' ? <Swiper autoplayTimeOut={3} autoplay={true} scrollViewStyle={bannerStyle || styles.wrapper} activeDotColor={'#17894c'} dotColor={'white'}
                                                 paginationStyle={paginationStyle || {bottom: rpx(15)}}>
                    {
                        banners.map((it, idx) => (
                            <TouchableOpacity activeOpacity={1}
                                              onPress={() => {
                                                  this.onPressBannerItem(it)
                                              }}>
                                <Image style={bannerStyle || styles.wrapper} source={{uri: it.properties[urlKey]}}/>
                            </TouchableOpacity>
                        ))
                    }
                </Swiper> : <Swiper autoplayTimeOut={3} autoplay={true} style={bannerStyle || styles.wrapper} activeDotColor={'#17894c'} dotColor={'white'}
                                    paginationStyle={paginationStyle || {bottom: rpx(15)}}>
                    {
                        banners.map((it, idx) => (
                            <TouchableOpacity key={idx} activeOpacity={1}
                                                onPress={() => {
                                                    this.onPressBannerItem(it)
                                                }}>
                                <Image style={bannerStyle || styles.wrapper} source={{uri: it.properties[urlKey]}}/>
                            </TouchableOpacity>
                        ))
                    }
                </Swiper>) :
                <View style={styles.banner}/>
        )
    }
}

const styles = StyleSheet.create({
    wrapper: {
        width: rpx(750),
        height: rpx(420)
    },
});
