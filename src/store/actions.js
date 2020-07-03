import {ADD_SUB, MINUS_SUB} from "./type";
import {initialState} from './subscribedReducer'

export const addSub = () => dispatch => {
    // console.log(999999999999999)
    let arr = initialState.haveOrNoSub
    console.log('==================', arr)
    dispatch({
        type: ADD_SUB,
        payload: arr + 1
    })
}


export const minusSub = () => dispatch => {
    // console.log(999999999999999)
    // let arr = initialState
    let arr = initialState.haveOrNoSub
    dispatch({
        type: MINUS_SUB,
        payload: arr - 1
    })
}
