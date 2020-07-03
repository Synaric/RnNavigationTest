package com.zhmobi.omma;

import android.app.Application;

import com.facebook.react.ReactApplication;

import cn.jpush.reactnativejanalytics.JAnalyticsPackage;
import cn.jpush.reactnativejpush.JPushPackage;
import cn.reactnative.modules.qq.QQPackage;

import org.linusu.RNGetRandomValuesPackage;

import com.brentvatne.react.ReactVideoPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.ninty.system.setting.SystemSettingPackage;

import cn.reactnative.modules.wx.WeChatPackage;

import com.swmansion.reanimated.ReanimatedPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.zhmobi.omma.alipay.AlipayPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return true;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new JAnalyticsPackage(false, true),
                    new JPushPackage(false, true),
                    new AlipayPackage(),
                    new QQPackage(),
                    new RNGetRandomValuesPackage(),
                    new ReactVideoPackage(),
                    new OrientationPackage(),
                    new LinearGradientPackage(),
                    new SystemSettingPackage(),
                    new WeChatPackage(),
                    new ReanimatedPackage(),
                    new RNGestureHandlerPackage(),
                    new RNDeviceInfo()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }
}
