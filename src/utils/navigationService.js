import {NavigationActions} from 'react-navigation'

let _navigator
let _navigation
let _routers

function setTopLevelNavigator (navigatorRef) {
    _navigator = navigatorRef
}

/**
 * 设置当前路由栈和导航对象
 * @param routers
 * @param navigation
 */
function setRouters (routers, navigation) {
    _routers = routers
    _navigation = navigation
}

function navigate (routeName, params) {
    _navigator.dispatch(
        NavigationActions.navigate({
            routeName,
            params,
        })
    )
}

function push (routeName, params) {
    _navigator.dispatch(
        NavigationActions.push({
            routeName,
            params,
        })
    )
}

function goBack () {
    _navigator.dispatch(
        NavigationActions.back()
    )
}

/**
 * 返回到顶层
 */
function popToTop () {
    _navigator.dispatch(NavigationActions.popToTop())
}


/**
 * 返回第n个页面
 * @param n
 */
function popToN (n) {
    if (n <= 0) {
        return
    }
    let len = _routers.length
    if (len < n || n === len - 1) {
        this.popToTop()
        return
    }
    _navigation.goBack(_routers[len - n].key)
}

/**
 * 返回到任意页面
 * @param routeName
 */
function popToRouter (routeName) {
    if (!routeName) {
        this.goBack()
        return
    }
    let len = _routers.length
    for (let i = 0; i < len - 1; i++) {
        let route = _routers[i]
        if (routeName === route.routeName && i !== len - 1) {
            _navigation.goBack(_routers[i + 1].key)
            return
        }
    }
}


export default {
    setTopLevelNavigator,
    setRouters,
    navigate,
    popToRouter,
    goBack,
    popToTop,
    push
}
