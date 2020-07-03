import {ADD_SUB, MINUS_SUB} from "./type";

export const initialState = {
    haveOrNoSub: 10
}
export  default  function (state = initialState, action) {
    console.log('我是reducers', action.type)
    switch (action.type) {
        case ADD_SUB:
            return {
                ...state,
                haveOrNoSub: action.payload
            }
        case MINUS_SUB:
            return {
                ...state,
                haveOrNoSub: action.payload
            }
        default:
            return state
    }
}
