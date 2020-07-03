package com.zhmobi.omma.wxapi;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;

import cn.reactnative.modules.wx.WeChatModule;

public class WXEntryActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Log.d("WeChatModule", "prepare handleIntent");
        WeChatModule.handleIntent(getIntent());
        finish();
    }
}