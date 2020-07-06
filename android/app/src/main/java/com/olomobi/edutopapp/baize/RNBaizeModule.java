package com.olomobi.edutopapp.baize;


import android.text.TextUtils;
import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableNativeMap;
import com.baize.analytics.android.sdk.BaizeAPI;

import org.json.JSONObject;

import java.util.HashSet;


/**
 * Created by yang on 2017/4/5
 * <p>
 * 参数类型在@ReactMethod注明的方法中，会被直接映射到它们对应的JavaScript类型
 * String -> String
 * ReadableMap -> Object
 * Boolean -> Bool
 * Integer -> Number
 * Double -> Number
 * Float -> Number
 * Callback -> function
 * ReadableArray -> Array
 */

public class RNBaizeModule extends ReactContextBaseJavaModule {

    public RNBaizeModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    private static final String MODULE_NAME = "RNBaizeModule";
    private static final String LOGTAG = "Bz.RN";

    /**
     * 返回一个字符串名字，这个名字在 JavaScript (RN)端标记这个模块。
     */
    @Override
    public String getName() {
        return MODULE_NAME;
    }

    /**
     * ReadableMap 转换成 JSONObject
     */
    private JSONObject convertToJSONObject(ReadableMap properties) {
        if (properties == null) {
            return null;
        }

        JSONObject json = null;
        ReadableNativeMap nativeMap = null;
        try {
            nativeMap = (ReadableNativeMap) properties;
            json = new JSONObject(properties.toString()).getJSONObject("NativeMap");
        } catch (Exception e) {
            Log.e(LOGTAG, "" + e.getMessage());
            String superName = nativeMap.getClass().getSuperclass().getSimpleName();
            try {
                json = new JSONObject(properties.toString()).getJSONObject(superName);
            } catch (Exception e1) {
                Log.e(LOGTAG, "" + e1.getMessage());
            }
        }
        return json;
    }

    /**
     * 参数类型在@ReactMethod注明的方法中，会被直接映射到它们对应的JavaScript类型
     * String -> String
     * ReadableMap -> Object
     * Boolean -> Bool
     * Integer -> Number
     * Double -> Number
     * Float -> Number
     * Callback -> function
     * ReadableArray -> Array
     * <p>
     * 导出 track 方法给 RN 使用.
     *
     * @param eventName 事件名称
     * @param properties 事件的具体属性
     * <p>
     * RN 中使用示例：（记录 RN_AddToFav 事件，事件属性 "ProductID":123456,"UserLevel":"VIP"）
     * <Button
     * title="Button"
     * onPress={()=>
     * RNBaizeModule.track("RN_AddToFav",{"ProductID":123456,"UserLevel":"VIP"})}>
     * </Button>
     */
    @ReactMethod
    public void track(String eventName, ReadableMap properties) {
        try {
            Log.e("Baize", "track!");
            BaizeAPI.sharedInstance().track(eventName, convertToJSONObject(properties));
        } catch (Exception e) {
            e.printStackTrace();
            Log.e(LOGTAG, e.toString() + "");
        }
    }

    /**
     * 导出 trackTimerStart 方法给 RN 使用.
     * <p>
     * 初始化事件的计时器，默认计时单位为秒(计时开始).
     *
     * @param eventName 事件的名称.
     * <p>
     * RN 中使用示例：（计时器事件名称 viewTimer ）
     * <Button
     * title="Button"
     * onPress={()=>
     * RNBaizeModule.trackTimerStart("viewTimer")}>
     * </Button>
     */
    @ReactMethod
    public void trackTimerStart(String eventName) {
        try {
            BaizeAPI.sharedInstance().trackTimerStart(eventName);
        } catch (Exception e) {
            e.printStackTrace();
            Log.e(LOGTAG, e.toString() + "");
        }
    }

    /**
     * 导出 trackTimerBegin 方法给 RN 使用.
     * <p>
     * 初始化事件的计时器，默认计时单位为毫秒(计时开始).
     *
     * @param eventName 事件的名称.
     * <p>
     * RN 中使用示例：（计时器事件名称 viewTimer ）
     * <Button
     * title="Button"
     * onPress={()=>
     * RNBaizeModule.trackTimerBegin("viewTimer")}>
     * </Button>
     */
    @ReactMethod
    public void trackTimerBegin(String eventName) {
        try {
            BaizeAPI.sharedInstance().trackTimerBegin(eventName);
        } catch (Exception e) {
            e.printStackTrace();
            Log.e(LOGTAG, e.toString() + "");
        }
    }

    /**
     * 导出 trackTimerEnd 方法给 RN 使用.
     * <p>
     * 初始化事件的计时器，默认计时单位为毫秒(计时结束，并触发事件)
     *
     * @param eventName 事件的名称.
     * <p>
     * RN 中使用示例：（计时器事件名称 viewTimer ）
     * <Button
     * title="Button"
     * onPress={()=>
     * RNBaizeModule.trackTimerEnd("viewTimer",{"ProductID":123456,"UserLevel":"VIP"})}>
     * </Button>
     */
    @ReactMethod
    public void trackTimerEnd(String eventName, ReadableMap properties) {
        try {
            BaizeAPI.sharedInstance().trackTimerEnd(eventName, convertToJSONObject(properties));
        } catch (Exception e) {
            e.printStackTrace();
            Log.e(LOGTAG, e.toString() + "");
        }
    }


    /**
     * 导出 clearTrackTimer 方法给 RN 使用.
     * <p>
     * 清除所有事件计时器
     * <p>
     * RN 中使用示例：（保存用户的属性 "sex":"男"）
     * <Button
     * title="Button"
     * onPress={()=>
     * RNBaizeModule.clearTrackTimer()}>
     * </Button>
     */
    @ReactMethod
    public void clearTrackTimer() {
        try {
            BaizeAPI.sharedInstance().clearTrackTimer();
        } catch (Exception e) {
            e.printStackTrace();
            Log.e(LOGTAG, e.toString() + "");
        }
    }


    /**
     * 导出 login 方法给 RN 使用.
     *
     * @param loginId RN 中使用示例：
     * <Button
     * title="Button"
     * onPress={()=>
     * RNBaizeModule.login("developer@sensorsdata.cn")}>
     * </Button>
     */
    @ReactMethod
    public void login(String loginId) {
        try {
            BaizeAPI.sharedInstance().login(loginId);
        } catch (Exception e) {
            e.printStackTrace();
            Log.e(LOGTAG, e.toString() + "");
        }
    }

    /**
     * 导出 logout 方法给 RN 使用.
     * <p>
     * RN 中使用示例：
     * <Button
     * title="Button"
     * onPress={()=>
     * RNBaizeModule.logout()}>
     * </Button>
     */
    @ReactMethod
    public void logout() {
        try {
            BaizeAPI.sharedInstance().logout();
        } catch (Exception e) {
            e.printStackTrace();
            Log.e(LOGTAG, e.toString() + "");
        }
    }

    /**
     * 导出 trackViewScreen 方法给 RN 使用.
     * <p>
     * 此方法用于 RN 中 Tab 切换页面的时候调用，用于记录 $AppViewScreen 事件.
     *
     * @param url 页面的 url  记录到 $url 字段中(如果不需要此属性，可以传 null ).
     * @param properties 页面的属性.
     * <p>
     * 注：为保证记录到的 $AppViewScreen 事件和 Auto Track 采集的一致，
     * 需要传入 $title（页面的title） 、$screen_name （页面的名称，即 包名.类名）字段.
     * <p>
     * RN 中使用示例：
     * <Button
     * title="Button"
     * onPress={()=>
     * RNBaizeModule.trackViewScreen(null,{"$title":"RN主页","$screen_name":"cn.sensorsdata.demo.RNHome"})}>
     * </Button>
     */
    @ReactMethod
    public void trackViewScreen(String url, ReadableMap properties) {
        try {
            BaizeAPI.sharedInstance().trackViewScreen(url, convertToJSONObject(properties));
        } catch (Exception e) {
            e.printStackTrace();
            Log.e(LOGTAG, e.toString() + "");
        }
    }

    /**
     * 导出 profileSet 方法给 RN 使用.
     *
     * @param properties 用户属性
     * <p>
     * RN 中使用示例：（保存用户的属性 "sex":"男"）
     * <Button
     * title="Button"
     * onPress={()=>
     * RNBaizeModule.profileSet({"sex":"男"})}>
     * </Button>
     */
    @ReactMethod
    public void profileSet(ReadableMap properties) {
        try {
            BaizeAPI.sharedInstance().profileSet(convertToJSONObject(properties));
        } catch (Exception e) {
            e.printStackTrace();
            Log.e(LOGTAG, e.toString() + "");
        }
    }

    /**
     * 导出 profileSetOnce 方法给 RN 使用.
     * <p>
     * 首次设置用户的一个或多个 Profile.
     * 与profileSet接口不同的是，如果之前存在，则忽略，否则，新创建.
     *
     * @param properties 属性列表
     * <p>
     * RN 中使用示例：（保存用户的属性 "sex":"男"）
     * <Button
     * title="Button"
     * onPress={()=>
     * RNBaizeModule.profileSetOnce({"sex":"男"})}>
     * </Button>
     */
    @ReactMethod
    public void profileSetOnce(ReadableMap properties) {
        try {
            BaizeAPI.sharedInstance().profileSetOnce(convertToJSONObject(properties));
        } catch (Exception e) {
            e.printStackTrace();
            Log.e(LOGTAG, e.toString() + "");
        }
    }

    /**
     * 导出 profileAppend 方法给 RN 使用.
     * <p>
     * 给一个列表类型的 Profile 增加一个元素.
     *
     * @param property 属性名称.
     * @param strList 新增的元素.
     * <p>
     * RN 中使用示例：
     * <Button
     * title="Button"
     * onPress={()=>
     * RNBaizeModule.profileAppend("VIP",["Gold","Diamond"])}>
     * </Button>
     */
    @ReactMethod
    public void profileAppend(String property, ReadableArray strList) {
        try {
            HashSet<String> strSet = new HashSet<>();
            for (int i = 0; i < strList.size(); i++) {
                strSet.add(strList.getString(i));
            }
            BaizeAPI.sharedInstance().profileAppend(property, strSet);
        } catch (Exception e) {
            e.printStackTrace();
            Log.e(LOGTAG, e.toString() + "");
        }
    }

    /**
     * 导出 getDistinctId 方法给 RN 使用.
     * <p>
     * 获取当前的 DistinctId.
     * <p>
     * successCallback 优先返回 mLoginId ，否则返回 mAnonymousId
     * <p>
     * RN 中使用示例：
     * <Button
     * title="Button"
     * onPress={()=>
     * RNBaizeModule.getDistinctId(success=>{
     * console.log(success)
     * },
     * error=>{
     * console.log(error)
     * })
     * }>
     * </Button>
     */
    @ReactMethod
    public void getDistinctId(Callback successCallback, Callback errorCallback) {
        try {
            String mLoginId = BaizeAPI.sharedInstance().getLoginId();
            if (!TextUtils.isEmpty(mLoginId)) {
                successCallback.invoke(mLoginId);
            } else {
                successCallback.invoke(BaizeAPI.sharedInstance().getAnonymousId());
            }
        } catch (Exception e) {
            e.printStackTrace();
            Log.e(LOGTAG, e.toString() + "");
            errorCallback.invoke(e.getMessage());
        }
    }

    /**
     * 导出 getDistinctIdPromise 方法给 RN 使用.
     * <p>
     * Promise 方式，获取 distinctId
     * <p>
     * RN 中使用示例：
     * async  getDistinctIdPromise() {
     * var distinctId = await RNBaizeModule.getDistinctIdPromise()
     * };
     */
    @ReactMethod
    public void getDistinctIdPromise(Promise promise) {
        try {
            String mLoginId = BaizeAPI.sharedInstance().getLoginId();
            if (!TextUtils.isEmpty(mLoginId)) {
                promise.resolve(mLoginId);
            } else {
                promise.resolve(BaizeAPI.sharedInstance().getAnonymousId());
            }
        } catch (Exception e) {
            e.printStackTrace();
            Log.e(LOGTAG, e.toString() + "");
            promise.reject("getDistinctId fail", e);
        }
    }

    /**
     * 导出 getAnonymousIdPromise 方法给 RN 使用.
     * <p>
     * Promise 方式 getAnonymousId 获取匿名 ID.
     * <p>
     * RN 中使用示例：
     * async  getAnonymousIdPromise() {
     * var anonymousId = await RNBaizeModule.getAnonymousIdPromise()
     * };
     */
    @ReactMethod
    public void getAnonymousIdPromise(Promise promise) {
        try {
            promise.resolve(BaizeAPI.sharedInstance().getAnonymousId());
        } catch (Exception e) {
            e.printStackTrace();
            Log.e(LOGTAG, e.toString() + "");
            promise.reject("getDistinctId fail", e);
        }
    }

    /**
     * 导出 registerSuperProperties 方法给 RN 使用.
     *
     * @param properties 要设置的公共属性
     * <p>
     * RN 中使用示例：（设置公共属性 "Platform":"Android"）
     * <Button
     * title="Button"
     * onPress={()=>
     * RNBaizeModule.registerSuperProperties({"Platform":"Android"})}>
     * </Button>
     */
    @ReactMethod
    public void registerSuperProperties(ReadableMap properties) {
        try {
            BaizeAPI.sharedInstance().registerSuperProperties(convertToJSONObject(properties));
        } catch (Exception e) {
            e.printStackTrace();
            Log.e(LOGTAG, e.toString() + "");
        }
    }

    /**
     * 导出 unregisterSuperProperty 方法给 RN 使用.
     *
     * @param property 要删除的公共属性属性
     * <p>
     * RN 中使用示例：（删除公共属性 "Platform"）
     * <Button
     * title="Button"
     * onPress={()=>
     * RNBaizeModule.unregisterSuperProperty("Platform")}>
     * </Button>
     */
    @ReactMethod
    public void unregisterSuperProperty(String property) {
        try {
            BaizeAPI.sharedInstance().unregisterSuperProperty(property);
        } catch (Exception e) {
            e.printStackTrace();
            Log.e(LOGTAG, e.toString() + "");
        }
    }

    /**
     * 导出 clearSuperProperties 方法给 RN 使用.
     * <p>
     * RN 中使用示例：（删除所有已设置的公共属性）
     * <Button
     * title="Button"
     * onPress={()=>
     * RNBaizeModule.clearSuperProperties()}>
     * </Button>
     */
    @ReactMethod
    public void clearSuperProperties() {
        try {
            BaizeAPI.sharedInstance().clearSuperProperties();
        } catch (Exception e) {
            e.printStackTrace();
            Log.e(LOGTAG, e.toString() + "");
        }
    }

    /**
     * 导出 flush 方法给 RN 使用.
     * <p>
     * RN 中使用示例：（强制发送数据到服务端）
     * <Button
     * title="Button"
     * onPress={()=>
     * RNBaizeModule.flush()}>
     * </Button>
     */
    @ReactMethod
    public void flush() {
        try {
            BaizeAPI.sharedInstance().flush();
        } catch (Exception e) {
            e.printStackTrace();
            Log.e(LOGTAG, e.toString() + "");
        }
    }

    /**
     * 导出 deleteAll 方法给 RN 使用.
     * <p>
     * RN 中使用示例：（删除本地数据库的所有数据！！！请谨慎使用）
     * <Button
     * title="Button"
     * onPress={()=>
     * RNBaizeModule.deleteAll()}>
     * </Button>
     */
    @ReactMethod
    public void deleteAll() {
        try {
            BaizeAPI.sharedInstance().deleteAll();
        } catch (Exception e) {
            e.printStackTrace();
            Log.e(LOGTAG, e.toString() + "");
        }
    }

    /**
     * 导出 identify 方法给 RN 使用.
     * <p>
     * RN 中使用示例：
     * <Button title="Button" onPress={()=>
     * RNBaizeModule.identify(distinctId)}>
     * </Button>
     */
    @ReactMethod
    public void identify(String distinctId) {
        try {
            BaizeAPI.sharedInstance().identify(distinctId);
        } catch (Exception e) {
            e.printStackTrace();
            Log.e(LOGTAG, e.toString() + "");
        }
    }

}
