/**
 * Created by wangshuo
 */
'use strict';

import React, {
    Image,
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    ToastAndroid,
    ListView,
    Component
    } from 'react-native';
import styles from "./style";
import NavigationBar from 'react-native-navbar';
var Dimensions=require('Dimensions');
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/Ionicons'
var {height, widths} = Dimensions.get('window');
import Prompt from 'react-native-prompt';
import api from "../../network/ApiHelper";
var BusyIndicator = require('react-native-busy-indicator');
var loaderHandler = require('react-native-busy-indicator/LoaderHandler');
import Toast from  '@remobile/react-native-toast'
import AMapLocation from 'react-native-amap-location';
import wifi from 'react-native-android-wifi';
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


    }
    isPunchOk=(isOk)=>{
      //刷新我的考勤记录
      if(isOk!=null){
        if(isOk&&this.refs.myAttendance){
          this.refs.myAttendance.getMyData(myDate.getMonth()+1)
        }
      }
    };

    render() {
        return (
            <View style={{flex:1}}>
              <NavigationBar
                style={{height: 55,backgroundColor:'#175898'}}
                leftButton={
                     <View style={styles.navLeftBtn}>
                     <TouchableOpacity style={[styles.touIcon,{marginRight:20,marginLeft:15}]} onPress={() => {this.props.nav.pop()}}>
                        <Icons
                          name="android-arrow-back"
                          size={28}
                          color="white"
                          onPress={() => {this.props.nav.pop()}}
                        />
                         </TouchableOpacity>
                         <Text numberOfLines={1} style={styles.navLeftText}>考勤</Text>
                     </View>
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

