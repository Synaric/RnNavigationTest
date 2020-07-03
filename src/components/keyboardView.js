"use strict";

import React, {Component} from 'react';
import {Platform, View, StyleSheet, ScrollView} from 'react-native';
import {width} from '../util/AdapterUtil'

export default class keyboardView extends Component {
  render() {
    const {children} = this.props;
    return (
      true ? (
        <View style={{flex: 1, width: width, alignItems: 'center'}}>
          {children}
        </View>
      ) : (<ScrollView keyboardShouldPersistTaps={'always'} style={{flex: 1, width: width}}>
        {children}
      </ScrollView>)
    );
  }
}
const TitleStyle = StyleSheet.create({

});
