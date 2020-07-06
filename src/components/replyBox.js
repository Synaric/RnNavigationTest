import {KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'
import React from 'react'
import BaseComponent from './baseComponents'
import {rpx} from "../util/adapterUtils";
import Btn from "./btn";

export default class ReplyBox extends BaseComponent {

  constructor (props) {
    super(props)
    this.state = {
      content: null
    }
  }

  render () {
    let {showReplyBox, action, target, onDismiss, onComplete} = this.props
    let {content} = this.state
    return (
      <Modal
        visible={showReplyBox}
        animationType={'fade'}
        transparent={true}
        onRequestClose={onDismiss}
        onDismiss={onDismiss}>
        <KeyboardAvoidingView style={{flex: 1}}
                              keyboardVerticalOffset={rpx(30)}
                              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <TouchableOpacity style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}}
                            activeOpacity={1}
                            onPress={onDismiss} />
          <View style={styles.container}>
            <Text style={styles.hint}>正在{action === 0 ? '回复' : '评论'}<Text style={{fontWeight: 'bold'}}>{target}</Text></Text>
            <TextInput style={styles.textInput}
                       multiline={true}
                       textAlignVertical={"top"}
                       onChangeText={this.onChangeText} />
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1}}/>
              <Btn style={styles.publishContainer} onPress={() => {onComplete(action, content)}}>
                <Text style={{color: content ? '#d8201d' : '#4f5661', fontSize: rpx(28)}}>发布</Text>
              </Btn>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    )
  }

  onChangeText = (content) => {
    this.setState({content})
  }

  clear() {
    this.setState({
      content: null
    })
  }
}

const styles = StyleSheet.create({

  container: {
    backgroundColor: 'white',
    paddingHorizontal: rpx(30)
  },

  hint: {
    color: '#4f5661',
    fontSize: rpx(26),
    lineHeight: rpx(48)
  },

  textInput: {
    backgroundColor: 'white',
    width: rpx(750),
    height: rpx(300),
    marginVertical: rpx(10)
  },

  publishContainer: {
    height: rpx(108),
    justifyContent: 'center',
    alignItems: 'center'
  }
})
