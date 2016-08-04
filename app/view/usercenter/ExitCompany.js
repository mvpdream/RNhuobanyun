/**
 * Created by wangshuo on 2016/2/16.
 */
'use strict';

import React, {
  Image,
  Text,
  TextInput,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  ListView,
  } from 'react-native';
import styles from "./style";
import api from "../../network/ApiHelper";
import Icon from 'react-native-vector-icons/FontAwesome';
var Dimensions = require('Dimensions');
var {height, widths} = Dimensions.get('window');  //获取屏幕宽高
import Popup from 'react-native-popup';
import Toast from  '@remobile/react-native-toast'
import NavigationBar from 'react-native-navbar';
import Icons from 'react-native-vector-icons/Ionicons'


export default class ExitCompany extends React.Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
  };
  exitCom(){
    this.popup.confirm({
      title: '提示',
      content: '确定退出该公司？',
      ok: {
        text:'确定',
        callback: () => {
         this.unregister();
        }
      },
      cancel: {
        text: '取消'
      }
    });
  }
  unregister() {
    var _that=this;
     api.User.unregister()
      .then((resData)=>{
         Toast.show(resData.Data,"short");
         if(resData.Type==1){
           _that.props.nav.immediatelyResetRouteStack([{id: 'SelectCompany'}])
         }
       });
  };
  render() {
    return (
      <View style={styles.containersw}>
        <NavigationBar
          style={{height: 55,backgroundColor:'#175898'}}
          leftButton={
                    <View style={styles.navLeftBtn}>
                          <Icons
                            name="android-arrow-back"
                            size={28}
                            style={{marginLeft:20,paddingRight:20}}
                            color="white"
                            onPress={() => {this.props.nav.pop()}}
                          />
                        <Text style={styles.rightNavText}>退出公司</Text>
                       </View>
                    }/>
        <View style={{ padding:20}}>
          <Text style={{color:"black",fontSize:15}}>退出公司后，会将你在该公司中设为离职状态，你讲无法登录到改公司，若要回复联系公司管理员</Text>
        </View>

        <View style={{marginTop:10}}>
          <TouchableOpacity style={styles.bottomTou} onPress={this.exitCom.bind(this)}>
            <View style={styles.bottomTouViewpas}>
              <Text style={{color:"white",fontSize:16}}>退出公司</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Popup ref={(popup) => { this.popup = popup }}/>
      </View>

    );
  }
};

