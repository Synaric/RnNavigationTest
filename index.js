/**
 * @format
 */

import {Navigation} from "react-native-navigation";
import {appRouter} from "./src/router";
import {install} from "./src/util/artUtils";

// 全局设置
install()

for (let page in appRouter) {
  Navigation.registerComponent(page, () => appRouter[page]);
}

Navigation.setDefaultOptions({
  topBar: {
    visible: false
  },
  bottomTabs: {
    titleDisplayMode: 'alwaysShow'
  }
})

Navigation.events().registerAppLaunchedListener(() => {

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
  });
});
