import {combineReducers} from 'redux'
import SubscribedReducer from './subscribedReducer'

export default combineReducers ({
    subArr: SubscribedReducer
})
