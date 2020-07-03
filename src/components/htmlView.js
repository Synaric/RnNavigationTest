import React from 'react';
import {Image, Platform, StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import {rpx} from "../utils/adapter";
import PropTypes from 'prop-types';
import AutoSizedImage from './AutoSizedImage'
import Html from 'react-native-htmlview'

export default class HtmlView extends React.Component {
    static propTypes = {
        urlKey: PropTypes.string
    };

    static defaultProps = {
        urlKey: 'pic'
    };

    constructor(props) {
        super(props);
        this.state = {
          content: ''
        };
      }

    _renderNode (node, index, siblings, parent, defaultRenderer) {
        let name = node.name
        console.log('===========')
        console.log(node)
        if (name == 'div') {
          return (
            <View key={index} style={{lineHeight: rpx(50)}}>
              {defaultRenderer(node.children, parent)}
            </View>
          )
        } else if (name == 'p' || name == 'span') {
          return (
            <Text key={index}>
              {defaultRenderer(node.children, parent)}
            </Text>
          )
        } else if (name == 'img') {
          return (
            <AutoSizedImage
              key={index}
              source={{uri: node.attribs.src}}
              style={{width: rpx(690), height: 0}}>
            </AutoSizedImage>
          )
        } else if (name == 'br') {
          return (<View style={{height: rpx(15)}}></View>)
        }
      }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.content !== this.props.content) {
            console.log('组件需要更新')
            this.setState({content: this.props.item});
            return true;
        } else {
            console.log('组件bubububu需要更新')
            return false
        }
        return true
    }

    render() {
        let {content} = this.props;
        return (
            <View>
                {content != undefined ?
                    <Html value={content}
                            textComponentProps={{
                                style: {
                                lineHeight: rpx(30)
                                }
                            }}
                            renderNode={this._renderNode}/> : null
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    wrapper: {
        width: rpx(750),
        height: rpx(420)
    },
});
