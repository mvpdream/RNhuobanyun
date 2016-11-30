import React, { Component } from 'react';
import {
     Image,
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    ToastAndroid,
    ListView,
    Alert,
    NetInfo,
  Dimensions
  } from 'react-native';

import styles from "./style";
import NavigationBar from 'react-native-navbar';
import NavLeftView from '../common/NavLeftView'
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/Ionicons'
var {height, widths} = Dimensions.get('window');
import Prompt from 'react-native-prompt';
import api from "../../network/ApiHelper";
var BusyIndicator = require('react-native-busy-indicator');
var loaderHandler = require('react-native-busy-indicator/LoaderHandler');
import ScrollableTabView from 'react-native-scrollable-tab-view';
import MyAttendance from './MyAttendance.js'
import PunchCard from './PunchCard.js'
var myDate = new Date();
export default class AttendanceMain extends React.Component{
    constructor(props){
        super(props);
        const nav = this.props.nav;
        this.state = {

        };
    };
    componentDidMount() {
      NetInfo.fetch().done((reach) => {
        if(reach=="NONE"){
          Alert.alert(
            '警告',
            `当前设备处于无网络状态\n请连接网络后继续使用。`,
            [
              {text: '确定', onPress: () =>{this.props.nav.pop();}}
            ]
          )
        }
      });
    }
    isPunchOk=(isOk)=>{
      //刷新我的考勤记录
      if(isOk!=null){
        if(isOk&&this.refs.myAttendance){
          this.refs.myAttendance.getMyData(myDate.getMonth()+1)
        }
      }
    };
    componentWillUnmount() {

    }
    render() {
        return (
            <View style={{flex:1}}>
              <NavigationBar
                style={styles.NavSty}
                leftButton={
                <NavLeftView nav={this.props.nav} leftTitle="考勤"/>
                   }/>
              <View style={{flex:1}}>
                <ScrollableTabView
                  tabBarBackgroundColor='white'
                  tabBarUnderlineColor='#3A83E1'
                  tabBarActiveTextColor='#3A83E1'>
                  <PunchCard
                    tabLabel='打卡'
                    ref="punchCard"
                    type={this.props.type==null?0:this.props.type}
                    nav={this.props.nav}
                    isPunchOk={this.isPunchOk}/>
                  <MyAttendance ref="myAttendance" tabLabel='我的考勤' nav={this.props.nav}/>
                </ScrollableTabView>
              </View>
            </View>
        );
    }
};

