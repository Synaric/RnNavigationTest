import {Text, TouchableOpacity, View} from "react-native";
import React from "react";
import BaseComponent from "./baseComponents";

export default class Btn extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  render() {
    let {children, style, onPress} = this.props
    return (
      <TouchableOpacity style={style} onPress={onPress}>
        {children}
      </TouchableOpacity>
    );
  }
}
