import {AsyncStorage} from "react-native";

export function setStorage(key, value) {
  return AsyncStorage.setItem(key, typeof value === String ? value : JSON.stringify(value))
}

export function getStorage(key, callback) {
  AsyncStorage.getItem(key, (err, result) => {
    try {
      result = JSON.parse(result)
      callback(result)
    } catch (e) {
      callback(result)
    }
  })
}
