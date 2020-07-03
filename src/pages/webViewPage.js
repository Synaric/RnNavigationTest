import React from 'react'
import {
  WebView,
  View
} from 'react-native'
import Base from '../components/base'
import NavBar from '../components/navBar'

export default class WebViewPage extends Base {
  created () {
    this.state = {
      url: '',
      canGoBack: false
    }
  }

  mounted () {
    let params = this.getParams()
    console.log('webview Page', params)
    this.setState({
      url: params.url
    })
  }

  onNavigationStateChange (navState) {
    this.setState({
      canGoBack: navState.canGoBack,
      url: navState.url,
    })
  }

  render () {
    return (
      <View style={{flex: 1, backgroundColor: '#f3f3f4'}}>
        {/* <NavBar title={'文章详情'} backgroundType={false} leftBtn={false} fullScreen={true}/> */}
        {
          this.state.url ?
          <WebView
            style={{flex: 1}}
            ref={webView => this.webView = webView}
            startInLoadingState={true}
            onNavigationStateChange={(e) => this.onNavigationStateChange(e)}
            source={{uri: this.state.url}}/> : null
        }
      </View>

    )
  }
}
