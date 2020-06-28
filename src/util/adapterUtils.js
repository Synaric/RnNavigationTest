import {Dimensions} from "react-native";

const designWidth = 750

let w = Dimensions.get('window').width;
let h = Dimensions.get('window').height;

//手机屏幕的宽度
export const width = w < h ? w : h;

export function rpx (num) {
  return num * width / designWidth
}
