import {IS_ONLINE} from './config'
// 点赞数 评论数 浏览数 三者取其一 规则
// 列表选择点赞数、评论数、浏览数*0.3（仅比较时*0.3），三个值中值最大的展示
export function thumbAndCommentAndBrowser (item) {
    let tempArr = []
    tempArr.push(item.ItemCount.likeCount)
    tempArr.push(item.ItemCount.replyCount)
    tempArr.push(item.ItemCount.viewCount * 0.3)
    let index = tempArr.findIndex(ele => {
        return ele === Math.max.apply(null, tempArr)
    })
    return index === 0 ? item.ItemCount.likeCount + '人赞' : index === 1 ? item.ItemCount.replyCount + '人评论' : item.ItemCount.viewCount + '人浏览数'
}

export function transformNewsItem (data, type) {
    console.log('transformNewsItem1', data)
    data.map(item => {
        return item.itemTypeId <= type
    })
    data && data.forEach(item => {
        if (!item.ItemCount) {
            item.ItemCount = {
                likeCount: 0,
                replyCount: 0,
                viewCount: 0
            }
        }
    })
    return data.map((item, index) => {
        let tempPicList = item.properties.picList ? JSON.parse(item.properties.picList) : []
        let pic1 = item.properties.pic.startsWith('https') ? item.properties.pic : (item.properties.pic ? URL + '/' + item.properties.pic : tempPicList[0])
        let picList = tempPicList.length > 0 ? tempPicList : pic1 ? [pic1] : ''
        console.log('transformNewsItem2', picList)
        return {
            showItem: 0,
            itemId: item.itemId,
            itemTypeId: item.itemTypeId,
            itemName: item.itemName,
            showType: pic1 && picList ? 1 : 0,
            pic: pic1,
            link: item.properties.link ? URL + '/' + item.properties.link : '',
            picList: picList,
            acronym: item.UserInfo ? item.UserInfo.User.nickName.substring(0, 1) : '',
            time: timePeriod(item.properties.publishTime * 1000, 1),
            adjectives: thumbAndCommentAndBrowser(item),
            author: item.properties.author,
            Like: item.Like,
            ItemCount: item.ItemCount,
            defPic: 'https://weixinfactory.di1game.com/web/header-images/logo.png',
            UserInfo: item.UserInfo,
        }
    })
}

export function log(...str) {
    if (!IS_ONLINE) {
        setTimeout(() => {
            console.log(...str)
        })
    }
}

function formatNumber (n) {
    const str = n.toString()
    return str[1] ? str : `0${str}`
}

export function formatDate (date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const t1 = [year, month, day].map(formatNumber).join('-')
    return `${t1}`
}

export function timePeriod (createTime) {
    // createTime ------- 一般时间格式
    let time = 0
    let nowTime = Math.floor(Date.now() / 1000)
    let pastTime = Math.floor(new Date(createTime).valueOf() / 1000)
    let timeVal = nowTime - pastTime
    if (timeVal > 7 * 24 * 60 * 60) {
        time = formatDate(new Date(createTime))
    } else if (timeVal >= 24 * 3600 && timeVal <= 7 * 24 * 3600) {
        let val = Math.floor(timeVal / (24 * 3600))
        time = val + '天前'
    } else if (timeVal >= 3600 && timeVal <= 24 * 3600) {
        let val = Math.floor(timeVal / 3600)
        time = val + '小时前'
    } else if (timeVal >= 300 && timeVal <= 3600) {
        let val = Math.floor(timeVal / 60)
        time = val + '分钟前'
    } else {
        time = '刚刚发布'
    }
    return time
}

export const URL = 'https://weixinfactory.di1game.com'

