/**
 * Created by wangshuo on 2016/2/16.
 */
'use strict';

import React, {
    Image,
    Text,
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    ToastAndroid,
    ListView,
    Platform,
    Linking,
    Component,
    Alert,
    } from 'react-native';
import styles from "./style";
import Icon from 'react-native-vector-icons/FontAwesome';
var Dimensions=require('Dimensions');
var {height, widths} = Dimensions.get('window');  //获取屏幕宽高
var loaderHandler = require('react-native-busy-indicator/LoaderHandler');
var BusyIndicator = require('react-native-busy-indicator');
import Popup from 'react-native-popup';
import api from "../../network/ApiHelper";
import Toast from '@remobile/react-native-toast'
import NavigationBar from 'react-native-navbar';
import Icons from 'react-native-vector-icons/Ionicons'


export default class UserSetting extends React.Component{
    constructor(props){
        super(props);
        const nav = this.props.nav;
        this.state = {
          versionNum:"3.4",
          telNum:"0532-88126086"
        };
    };
    componentWillMount(){

    }
    telFun(){
      Linking.canOpenURL('tel:'+this.state.telNum).then(supported => {
        if (!supported) {
          Toast.show("打开失败！","short");
        } else {
          return Linking.openURL('tel:'+this.state.telNum);
        }
      })
    }
    CheckUpdate(){
      api.Util.checkUpdate(this.state.versionNum)
      .then((res)=>{
        if(res.Type==1){
          //有新版本要更新
          this.popup.confirm({
            title: '新版本',
            content: ['发现新版本，是否进行更新？'],
            cancel: {
              text: '取消'
            },
            ok: {
              text: '下载',
              callback: () => {
                Linking.openURL(res.Data).catch(err =>  Toast.show("打开失败！","short"));
              }
            }
          });
        }else{
          //当前是最新版本
          this.popup.alert("当前已是最新版本！");
        }
        })
    }
    render() {
        return (
            <View style={{flex:1,backgroundColor:'#ECEFF1'}}>
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
                        <Text style={styles.rightNavText}>关于伙伴</Text>
                       </View>
                    }/>
              <View style={{flex:1}}>
              <View style={{alignItems: 'center',marginTop:15}}>
                <Image resizeMode="contain" style={styles.hbyImage} source={require('../image/huobanlogo-TM.png')}/>
                  <Text style={styles.pagerText}>版本号：{this.state.versionNum}</Text>
              </View>

                <TouchableOpacity style={{marginTop:15}} onPress={this.CheckUpdate.bind(this)}>
                    <View style={styles.usersafeView}>
                        <View style={styles.info}>
                            <Text style={styles.usersafeTexts}>检查更新</Text>
                        </View>
                    </View>
                </TouchableOpacity>
              </View>
              <View style={{alignItems: 'center',marginBottom:30}}>
                <Text onPress={this.telFun.bind(this)} style={styles.usersafeTexts}>客服电话：0532-88126086</Text>
                <Text style={[styles.pagerText,{fontSize: 13}]}>©2012-2016 上海乐兴软件技术有限公司</Text>
              </View>
              <BusyIndicator color='#EFF3F5' loadType={1} loadSize={10} textFontSize={15} overlayColor='#4A4A4A' textColor='white' />
              <Popup ref={(popup) => { this.popup = popup }}/>
                </View>

        );
    }
};

