import React from 'react';
import BaseComponent from "../components/baseComponents";
import {appRouter} from "../router";
import {Navigation} from "react-native-navigation/lib/dist/index";

export default class BasePage extends BaseComponent {

  constructor(props) {
    super(props);
    this.navigator = {

      push: (page) => {
        let component = appRouter[page]
        if (component) {
          Navigation.push(this.props.componentId, {
            component: {
              name: page,
              // options: {
              //   statusBar: component.resolveStatusBar(),
              //   topBar: {
              //     visible: false
              //   }
              // }
            }
          })
        }
      },

      resetToHome: () => {
        Navigation.setRoot({

          // do not work

          // root: {
          //   stack: {
          //     id: 'MAIN_STACK',
          //     children: [
          //       {
          //         bottomTabs: {
          //           id: 'BOTTOM_TABS_LAYOUT',
          //           children: [
          //             {
          //               component: {
          //                 id: 'HOME_SCREEN',
          //                 name: 'Home',
          //                 options: {
          //                   bottomTab: {
          //                     icon: require('../img/home-default.png'),
          //                     selectedIcon: require('../img/home-selected.png'),
          //                     text: '首页'
          //                   }
          //                 }
          //               }
          //             },
          //             {
          //               component: {
          //                 id: 'PROFILE_SCREEN',
          //                 name: 'My',
          //                 options: {
          //                   bottomTab: {
          //                     icon: require('../img/my-default.png'),
          //                     selectedIcon: require('../img/my-selected.png'),
          //                     text: '我的'
          //                   }
          //                 }
          //               }
          //             }
          //           ]
          //         }
          //       }
          //     ]
          //   }
          // },

          // do not work as well
          root: {
            bottomTabs: {
              children: [
                {
                  stack: {
                    children: [
                      {
                        component: {
                          name: 'Home'
                        }
                      }
                    ],
                    options: {
                      bottomTab: {
                        text: 'Home',
                        icon: require('../img/home-default.png'),
                        selectedIcon: require('../img/home-selected.png'),
                      }
                    }
                  }
                },
                {
                  stack: {
                    children: [
                      {
                        component: {
                          name: 'My'
                        }
                      }
                    ],
                    options: {
                      bottomTab: {
                        text: 'My',
                        icon: require('../img/my-default.png'),
                        selectedIcon: require('../img/my-selected.png'),
                      }
                    }
                  }
                }
              ]
            }
          }
        })
      }
    }
  }

  static resolveStatusBar() {
    return {
      visible: true,
      style: 'dark',
      backgroundColor: 'transparent',
      drawBehind: true
    }
  }

  setStatusBar = () => {
    Navigation.mergeOptions(this.props.componentId, {
      statusBar: appRouter[this.constructor.name].resolveStatusBar()
    });
  };

  componentDidMount() {
    super.componentDidMount()
    Navigation.events().bindComponent(this)
  }

  componentDidAppear() {
    this.onShow()
    this.setStatusBar()
  }

  componentDidDisappear() {
    this.onHide()
  }
}
