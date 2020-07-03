import React from 'react';
import Base from "../components/base";
import {AsyncStorage, Image, Platform, StyleSheet, View} from "react-native";
import {rpx} from "../utils/adapter";
import {NavigationActions} from "react-navigation";
import DeviceInfo from 'react-native-device-info' // 获取设备型号

export default class Splash extends Base {

    resolveStatusBar() {
        return {
            barStyle: 'light-content',
            backgroundColor: 'transparent',
            translucent: true
        }
    }

    created() {
        this.state = {}
        let deviceId = DeviceInfo.getUniqueID();
        console.log('deviceId =======================', deviceId)
        this.postApi('/mobileAuth', {deviceId: deviceId}, (res) => {
            console.log('mobileAuth  .res==========', res)
            let token = res.token
            AsyncStorage.setItem('token', token, () => {
                setTimeout(() => {
                    try {
                        this.props.navigation.reset(
                            [NavigationActions.navigate({routeName: res.data.isTag ? 'Main' : 'ColdBoot'})]
                            , 0)
                    } catch (e) {
                        this.log(e)
                    }
                }, Platform.OS === 'ios' ? 0 : 3000)
            })
            AsyncStorage.setItem('userInfo', JSON.stringify(res.data))
        })
    }

    mounted() {

    }

    render() {
        return (
            <View style={{flex: 1, width: rpx(750)}}>
                <Image style={{width: rpx(750), flex: 1}} source={require('../imgs/splash.png')}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({});
