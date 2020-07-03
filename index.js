/**
 * @format
 */

import {Navigation} from "react-native-navigation";
import {appRouter} from "./src/router";
import {install, log} from "./src/util/artUtils";
import JPush from 'jpush-react-native';
import JAnalytics from 'janalytics-react-native';

// 全局设置
install()

for (let page in appRouter) {
  Navigation.registerComponent(page, () => appRouter[page]);
}


Navigation.setDefaultOptions({
  topBar: {
    visible: false
  },
  layout: {
    backgroundColor: '#f2f2f2'
  },
  bottomTabs: {
    titleDisplayMode: 'alwaysShow'
  }
})

Navigation.events().registerAppLaunchedListener(() => {

  // 启动极光推送
  JPush.init();
  JPush.addNotificationListener((result) => {
    log('收到推送', result)
  });
  JAnalytics.setLoggerEnable({"enable": true});
  JAnalytics.init({appKey: '9df2bfb58d5c7adc0570b091'});

  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'Splash'
            }
          }
        ]
      }
    }
    // root: {
    //   bottomTabs: {
    //     animate: false,
    //     children: [
    //       {
    //         stack: {
    //           children: [
    //             {
    //               component: {
    //                 name: 'Home'
    //               }
    //             }
    //           ],
    //           options: {
    //             bottomTab: {
    //               text: '首页',
    //               icon: require('./src/img/home-default.png'),
    //               selectedIcon: require('./src/img/home-selected.png'),
    //             }
    //           }
    //         }
    //       },
    //       {
    //         stack: {
    //           children: [
    //             {
    //               component: {
    //                 name: 'My'
    //               }
    //             }
    //           ],
    //           options: {
    //             bottomTab: {
    //               text: '我的',
    //               icon: require('./src/img/my-default.png'),
    //               selectedIcon: require('./src/img/my-selected.png'),
    //             }
    //           }
    //         }
    //       }
    //     ]
    //   }
    // }
  });
});
