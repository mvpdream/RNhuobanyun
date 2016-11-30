import React, {Component} from 'react'
import {
 Image,
  Text,
  TextInput,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  ListView,
  Dimensions
} from 'react-native';

import styles from "./style";
import api from "../../network/ApiHelper";
import Icon from 'react-native-vector-icons/FontAwesome';
var {height, widths} = Dimensions.get('window');  //获取屏幕宽高
import NavigationBar from 'react-native-navbar';
import NavLeftView from '../common/NavLeftView'
import Icons from 'react-native-vector-icons/Ionicons'
var BusyIndicator = require('react-native-busy-indicator');
var loaderHandler = require('react-native-busy-indicator/LoaderHandler');


export default class ExitCompany extends React.Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
  };
  exitCom(){
    Alert.alert(
      '提示',
      '确定退出该公司？',
      [
        {text: '取消'},
        {text: '确定', onPress: () => {
           this.unregister();
        }}
      ]
    )
  }
  unregister() {
    var _that=this;
    loaderHandler.showLoader("正在注销。。。");
     api.User.unregister()
      .then((resData)=>{
         ToastAndroid.show((resData.Data==undefined||resData.Data==null)?"未知错误":resData.Data,ToastAndroid.SHORT);
         loaderHandler.hideLoader();
         if(resData.Type==1){
           api.Company.getCompanyList()
             .then((resDate)=> {
               loaderHandler.hideLoader();
               if(resDate.Type==1){
                if(resDate.Data.length!=0){
                  _that.props.nav.immediatelyResetRouteStack([{id: 'Login'},{id: 'SelectCompany'}])
                }else{
                  _that.props.nav.immediatelyResetRouteStack([{id: 'Login'}])
                }
               }else{
                 ToastAndroid.show("获取列表失败！请重试",ToastAndroid.SHORT);
               }

             })
         }
       });
  };
  render() {
    return (
      <View style={styles.containersw}>
        <NavigationBar
          style={styles.NavSty}
          leftButton={
          <NavLeftView nav={this.props.nav} leftTitle="退出公司"/>
                    }/>
        <View style={{ padding:20}}>
          <Text style={{color:"black",fontSize:15}}>退出公司后，会将你在该公司中设为离职状态，你将无法登录到该公司，若要恢复联系公司管理员</Text>
        </View>

        <View style={{marginTop:10}}>
          <TouchableOpacity style={styles.bottomTou} onPress={this.exitCom.bind(this)}>
            <View style={styles.bottomTouViewpas}>
              <Text style={{color:"white",fontSize:16}}>退出公司</Text>
            </View>
          </TouchableOpacity>
        </View>
        <BusyIndicator color='#EFF3F5' loadType={1} loadSize={10} textFontSize={15} overlayColor='#4A4A4A' textColor='white' />
      </View>

    );
  }
};

