import React, {Component} from 'react'
import {
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
    Alert,
  Dimensions
} from 'react-native';

import styles from "./style";
import Icon from 'react-native-vector-icons/FontAwesome';
var {height, widths} = Dimensions.get('window');  //获取屏幕宽高
var loaderHandler = require('react-native-busy-indicator/LoaderHandler');
var BusyIndicator = require('react-native-busy-indicator');
import api from "../../network/ApiHelper";
import NavigationBar from 'react-native-navbar';
import NavLeftView from '../common/NavLeftView'
import Icons from 'react-native-vector-icons/Ionicons'


export default class UserSetting extends React.Component{
    constructor(props){
        super(props);
        const nav = this.props.nav;
        this.state = {
          versionNum:"3.4.2",
          telNum:"0532-88126086"
        };
    };
    componentWillMount(){

    }
    telFun(){
      Linking.canOpenURL('tel:'+this.state.telNum).then(supported => {
        if (!supported) {
          ToastAndroid.show("打开失败！",ToastAndroid.SHORT);
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
          Alert.alert(
          '新版本',
          '发现新版本，是否进行更新？',
          [
            {text: '取消'},
            {text: '下载', onPress: () => {
               Linking.openURL(res.Data).catch(err =>  ToastAndroid.show("打开失败！",ToastAndroid.SHORT));
            }}
          ]
        )
        }else{
          //当前是最新版本
           Alert.alert(
            '',
          '当前已是最新版本',
          [
            {text: '确定'},
          ]
        )
        }
        })
    }
    render() {
        return (
            <View style={{flex:1,backgroundColor:'#ECEFF1'}}>
              <NavigationBar
                style={styles.NavSty}
                leftButton={
                 <NavLeftView nav={this.props.nav} leftTitle="关于伙伴"/>
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
                <Text onPress={this.telFun.bind(this)} style={styles.usersafeTexts}>客服电话：{this.state.telNum}</Text>
                <Text style={[styles.pagerText,{fontSize: 13}]}>©2012-2016 上海乐兴软件技术有限公司</Text>
              </View>
              <BusyIndicator color='#EFF3F5' loadType={1} loadSize={10} textFontSize={15} overlayColor='#4A4A4A' textColor='white' />
            
                </View>

        );
    }
};

