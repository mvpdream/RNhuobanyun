import React, {Component} from 'react'
import {
  Image,
  Text,
  View,
  ToastAndroid,
  Animated,
  StatusBar,
  NetInfo,
  Platform,
  Linking,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import api from '../network/ApiHelper';
var {height, widths} = Dimensions.get('window');  //获取屏幕宽高
var WINDOW_WIDTH = Dimensions.get('window').width;
var WINDOW_HEIGHT = Dimensions.get('window').height;

export default class Loading extends React.Component {
  constructor(props){
    super(props);
    const nav = this.props.nav;
    this.state = {
      fadeAnim: new Animated.Value(0)
    };
  };
  componentDidMount() {
    NetInfo.fetch().done((reach) => {
      if(reach=="NONE"){
        Alert.alert(
          '警告',
          '请检查你的网络情况！',
          [
            {text: 'OK'}
          ]
        )
      }else{
        api.Util.checkLoginState()
          .then((resData)=>{
            if(resData.Type==1) {
              //正常登录
              setTimeout(()=>{ this.props.nav.immediatelyResetRouteStack([{id: 'MainTabView',type:this.props.type==null?0:this.props.type}]);},1000);
            }
            else if(resData.Type==2){
              //用户未登录
              setTimeout(()=>{ this.props.nav.immediatelyResetRouteStack([{id: 'SelectCompany'}]);},1000);
            }
            else{
              //账号未登录
              setTimeout(()=>{ this.props.nav.immediatelyResetRouteStack([{id: 'Login'}]);},1000);
            }
          })
      }
    });
    Animated.timing(
      this.state.fadeAnim,
      {toValue: 1}
    ).start();

  };
  render(){
    return(
      <View>
        <StatusBar backgroundColor='#CCE6FF' />
            <Animated.Image
            resizeMode="cover"
            source={require('./image/loading01.png')}
          style={{
          flex: 1,
            opacity: this.state.fadeAnim,
            width: WINDOW_WIDTH,
            height: WINDOW_HEIGHT,
            }}
        />
      </View>
    )
  }
}