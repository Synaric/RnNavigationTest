import React, {PureComponent, Component} from 'react'
import {
  Image,
  View,
} from 'react-native'

const baseStyle = {
  backgroundColor: '#0f0',
}

export default class AutoSizedImage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      width: this.props.style.width || 1,
      height: this.props.style.height || 1,
    }
  }

  componentDidMount () {
    Image.getSize(this.props.source.uri, (w, h) => {
      console.log('setState')
      this.setState({width: w, height: h})
    })
  }

  render () {
    const finalSize = {}

    finalSize.width = this.props.style.width
    const ratio = this.props.style.width / this.state.width
    finalSize.height = Math.floor(this.state.height * ratio)

    console.log('height=' + finalSize.height)
    return <Image style={{width: finalSize.width, height: finalSize.height}} source={this.props.source}/>
  }
}
