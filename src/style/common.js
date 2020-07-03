import {StyleSheet} from 'react-native'
import {isIphoneX, rpx, statusBarHeight} from '../utils/adapter'

export const common = StyleSheet.create({
    column: {
        flexDirection: 'column',
        alignItems: 'center'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    rowBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    titleBar: {
        width: rpx(750),
        height: statusBarHeight,
        backgroundColor: '#17894c'
    },
    btnMid: {
        width: rpx(268),
        height: rpx(64),
        borderRadius: rpx(32),
        backgroundColor: '#17894c',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnMidText: {
        fontSize: rpx(26),
        color: 'white'
    },
    btnMid2: {
        width: rpx(268),
        height: rpx(64),
        borderRadius: rpx(32),
        backgroundColor: 'white',
        borderWidth: rpx(2),
        borderColor: '#787878',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnMidText2: {
        fontSize: rpx(26),
        color: '#787878',
    },
    tagActive: {
        width: rpx(133),
        height: rpx(50),
        backgroundColor: '#17894c',
        marginRight: rpx(30),
        alignItems: 'center',
        justifyContent: 'center',
    },
    tagActiveText: {
        fontSize: rpx(32),
        color: 'black',
        borderBottomColor: 'red',
        borderStyle: 'solid',
        borderBottomWidth: rpx(3),
        fontWeight: 'bold'
    },
    tagNormal: {
        fontSize: rpx(26),
        color: '#4f5661',
        marginRight: rpx(30),
        alignItems: 'center',
        justifyContent: 'center',
    },
    tagNormalText: {
        color: '#4f5661',
        fontSize: rpx(26),
    },
    smallTag: {
        height: rpx(30),
        width: rpx(70),
        borderRadius: rpx(15),
        backgroundColor: '#17894c',
        alignItems: 'center',
        justifyContent: 'center',
    },
    smallTagText: {
        fontSize: rpx(20),
        color: '#fff'
    },
    loadMore: {
        width: rpx(750),
        height: rpx(120),
        lineHeight: rpx(120),
        textAlign: 'center',
        color: '#17894c'
    },
    noMore: {
        width: rpx(750),
        height: rpx(120),
        lineHeight: rpx(120),
        textAlign: 'center',
        color: '#b1b1b1'
    },
    btnMain: {
        width: rpx(690),
        height: rpx(80),
        backgroundColor: '#17894c',
        borderRadius: rpx(40),
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnMainText: {
        fontSize: rpx(26),
        color: 'white',
    },
    alertShadow: {
        width: rpx(750),
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center'
    },
    alertDialog: {
        width: rpx(750),
        borderTopLeftRadius: rpx(20),
        borderTopRightRadius: rpx(20),
        backgroundColor: 'white',
        flexDirection: 'column',
        paddingHorizontal: rpx(30),
        paddingBottom: isIphoneX() ? (34 + rpx(20)) : rpx(20),
        alignItems: 'center'
    },
    btnGroup: {
        width: rpx(650),
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingVertical: rpx(30)
    },
    cancelBtn: {
        width: rpx(134),
        height: rpx(50),
        borderRadius: rpx(5),
        marginRight: rpx(30),
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelBtnText: {
        fontSize: rpx(24),
        color: '#787878'
    },
    payMoneyBtn: {
        width: rpx(84),
        height: rpx(50),
        backgroundColor: '#17894c',
        borderRadius: rpx(5),
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmBtn: {
        width: rpx(84),
        height: rpx(50),
        lineHeight: rpx(50),
        textAlign: 'center',
        backgroundColor: '#17894c',
        borderRadius: rpx(5),
        fontSize: rpx(24)
    },
    // 订单
    orderContainerItem: {
        marginRight: 'auto',
        marginLeft: 'auto',
        width: rpx(690),
        paddingTop: rpx(20),
        borderRadius: rpx(20),
        backgroundColor: 'white',
        marginBottom: rpx(20)
    },
    orderHeader: {
        width: rpx(650),
        height: rpx(30),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    orderContainer: {
        // height: rpx(156),
        width: rpx(650),
        marginTop: rpx(25)
    },
    orderImg: {
        height: rpx(156),
        width: rpx(156),
        borderRadius: rpx(20)
    },
    orderInner: {
        // height: rpx(156),
        width: rpx(310),
        marginLeft: rpx(30),
    },
    orderTitle: {
        width: rpx(310),
        lineHeight: rpx(40),
        fontSize: rpx(26)
    },
    orderMoney: {
        height: rpx(40),
        lineHeight: rpx(40),
        width: rpx(124),
        fontSize: rpx(22),
        textAlign: 'right'
    },
    orderPrice: {
        height: rpx(156),
        width: rpx(124),
        marginLeft: rpx(30),
    },
    btnContent: {
        color: '#ffffff',
        fontSize: rpx(24),
    },
    preDetailContent: {
        width: rpx(750),
        marginTop: rpx(-20),
        backgroundColor: '#fff',
        borderTopLeftRadius: rpx(20),
        borderTopRightRadius: rpx(20)
    },
    relationContainer: {
        marginLeft: rpx(50),
        flex: 1,
        alignItems: 'center',
    },
    preDetailHeader: {
        width: rpx(690),
        paddingTop: rpx(40),
        paddingBottom: rpx(30)
    },
    preDetailBottomBar: {
        height: rpx(98),
        width: rpx(750),
        backgroundColor: '#ffffff',
        borderStyle: 'solid',
        borderTopWidth: rpx(1),
        borderTopColor: '#eeeeee'
    },
    detailInfoRow: {
        paddingVertical: rpx(30),
        width: rpx(690),
        borderStyle: 'solid',
        borderTopWidth: rpx(2),
        borderTopColor: '#eeeeee',
    },
    payBtn: {
        width: rpx(200),
        height: rpx(64),
        backgroundColor: '#17894c',
        borderRadius: rpx(6),
        marginRight: rpx(30)
    },
    priceRow: {
        height: rpx(36),
        marginTop: rpx(42),
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        textAlignVertical: 'bottom'
    },
    // 个人中心和分销
    personalHeader: {
        width: rpx(750),
        height: rpx(396),
        paddingTop: rpx(77),
        backgroundColor: '#17894c',
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    personalView: {
        width: rpx(750),
        flex: 1,
        position: 'relative'
    },
    rebateInfo: {
        height: rpx(44),
        width: rpx(750),
        paddingHorizontal: rpx(29),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    accountRestMoney: {
        fontSize: rpx(108),
        color: 'white'
    },
    accountGoodsName: {
        width: rpx(600),
        fontSize: rpx(26),
        position: 'absolute',
        top: rpx(30)
    },
    recordsItem: {
        marginHorizontal: rpx(30),
        height: rpx(120),
        borderStyle: 'solid',
        borderBottomWidth: rpx(1),
        borderBottomColor: '#ccc',
        position: 'relative'
    },
    accountDateTime: {
        fontSize: rpx(22),
        color: '#787878',
        position: 'absolute',
        top: rpx(74)
    },
    recordsMoney: {
        fontSize: rpx(28),
        position: 'absolute',
        top: rpx(51),
        right: rpx(5)
    },
    borderCommonStyle: {
        borderStyle: 'solid',
        borderWidth: rpx(1),
        borderColor: '#787878',
    },
    withoutOrder: {
        width: rpx(750),
        backgroundColor: '#f2f2f2',
        justifyContent: 'center',
        flex: 1
    },


    //  光明教育家 +++++
    haveSubscribe: {
        color: '#787878',
        borderStyle: 'solid',
        borderWidth: rpx(1),
        borderColor: '#787878'
    },
    noSubscribe: {
        color: '#d8201d',
        borderStyle: 'solid',
        borderWidth: rpx(1),
        borderColor: '#d8201d'
    },
    tabActiveText: {
        fontSize: rpx(32),
        fontWeight: 'bold',
        color: '#00070f',
        borderStyle: 'solid',
        borderBottomWidth: rpx(3),
        borderBottomColor: '#d8201d'
    },
    tabANormalText: {
        fontSize: rpx(26),
        color: '#4f5661'
    },
    recommendTitle: {
        color: '#00070f',
        fontWeight: 'bold',
        fontSize: rpx(32),
        marginBottom: rpx(25)
    },
    icon1: {
        width: rpx(37),
        height: rpx(36),
        marginTop: rpx(-2)
    },
    newsDesc: {
        fontSize: rpx(20),
        color: '#4f5661',
    },
    listTips: {
        color: '#313332',
        fontWeight: 'bold',
        fontSize: rpx(26),
        textAlign: 'center',
        marginVertical: rpx(30)
    },
    reportStyle: {
        width: rpx(710)
      }
    //  光明教育家 -----
})
