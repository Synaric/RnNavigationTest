import {Text, View} from "react-native";
import React from "react";
import BaseComponent from "./baseComponents";
import {common} from "../common/style";
import Btn from "./btn";

export default class Follow extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    let {isFollow, onPress} = this.props
    return (
      <Btn style={common.followWrapper} onPress={onPress}>
        <Text style={isFollow ? common.hasFollowed : common.follow}>{isFollow ? '已关注' : '+ 关注'}</Text>
      </Btn>
    );
  }
}
