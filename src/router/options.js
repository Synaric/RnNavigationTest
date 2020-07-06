export let appRoot = {
  root: {
    bottomTabs: {
      animate: false,
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
                text: '首页',
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
                text: '我的',
                icon: require('../img/my-default.png'),
                selectedIcon: require('../img/my-selected.png'),
              }
            }
          }
        }
      ]
    }
  }
}
