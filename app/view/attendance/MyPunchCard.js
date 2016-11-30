import React, { Component } from 'react';
import {
    Image,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ToastAndroid,
  ListView,
  ScrollView,
  Alert,
  AppState,
  ProgressBarAndroid,
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
import colorManager from '../common/styles/manager';
var wifiArray="";
var myDate = new Date();
var _this;
var locationData;
import {formatter} from '../../tools/DateHelper'
var mac="";
var name="";
var i=0;
var Bounceable = require("react-native-bounceable");

export default class MyPunchCard extends React.Component{
  constructor(props){
    super(props);
    const nav = this.props.nav;
    this.state = {
      resData:[],
      haveData:false,
      isFetch:false,
      nowTime:"",
      longitude:"",
      latitude:"",
      s:0,
      errMsg:"",
      isCanPunch:true,
      distance:0,
      isNeedWifi:false,
      serviceStart:false,
      errorRange:100,
      currentAppState: AppState.currentState
    };
  };
  componentDidMount() {
    loaderHandler.showLoader("请稍等。。。");
    api.Attendance.attendance(",ec:6c:9f:04:c2:3e",",tunynet2016",120.4643,36.114094)
      .then((res)=>{
        loaderHandler.hideLoader();
        var nowTimes=formatter('hh:mm',new Date());
        this.setState({isFetch:true});
        if(res.Type==1){
          this.setState({resData:res.Data,haveData:true,nowTime:nowTimes});
        }else{
          this.setState({haveData:false,errMsg:res.Data});
        }
      });
  }
  updateData(mac,name,longitude,latitude){
    api.Attendance.attendance(mac,name,longitude,latitude)
      .then((res)=>{
        var nowTimes=formatter('hh:mm',new Date());
        this.setState({isFetch:true});
        if(res.Type==1){
          this.setState({resData:res.Data,haveData:true,nowTime:nowTimes});
          loaderHandler.hideLoader();
        }else{
          this.setState({haveData:false});
          loaderHandler.hideLoader();
        }
      })
  }
  punchCardFun(isUpdate){
    //打卡
    wifi.getMACInfo((mac)=>{
      if(mac!=""){
        if(this.state.resData.CheckDescription=="未到下班时间"||isUpdate){
          var msg=isUpdate?"是否更新？":"未到打卡时间\n是否继续？";
          Alert.alert(
            '提示',
            msg,
            [
              {text: '确认', onPress: () => {
                var toastMsg=isUpdate?"更新成功":"打卡成功";
                loaderHandler.showLoader("请稍等。。。");
                api.Attendance.checkIn(mac,120.4643,36.114094)
                  .then((res)=>{
                    if(res.Type==1){
                      ToastAndroid.show(toastMsg,ToastAndroid.SHORT);
                      this.updateData(",ec:6c:9f:04:c2:3e",",tunynet2016",120.4643,36.114094);
                    }
                    else{
                      loaderHandler.hideLoader();
                      ToastAndroid.show((res.Data==undefined||res.Data==null)?"未知错误":res.Data,ToastAndroid.SHORT);
                    }
                  })
              }},
              {text: '取消'}
            ]
          )
        }else{
          loaderHandler.showLoader("请稍等。。。");
          api.Attendance.checkIn(mac,120.4643,36.114094)
          .then((res)=>{
              if(res.Type==1){
                ToastAndroid.show((res.Data==undefined||res.Data==null)?"未知错误":res.Data,ToastAndroid.SHORT);
                this.updateData(",ec:6c:9f:04:c2:3e",",tunynet2016",120.4643,36.114094);
              }else{
                loaderHandler.hideLoader();
                ToastAndroid.show((res.Data==undefined||res.Data==null)?"未知错误":res.Data,ToastAndroid.SHORT);
              }
            })
      }}

    });

  }
  render() {
    return (
      <View style={{flex:1,backgroundColor:colorManager.getCurrentStyle().BGCOLOR}}>
        <NavigationBar
          style={styles.NavSty}
          leftButton={
           <NavLeftView nav={this.props.nav} leftTitle="我的考勤"/>
                   }/>
        {
          !this.state.isFetch?null:this.state.haveData?<View style={styles.container}>
            <ScrollView keyboardShouldPersistTaps={true}  keyboardDismissMode ='on-drag'>
              <View style={styles.dateView}>
                <Icon
                  name="calendar"
                  size={15}
                  color="#000000"
                  /><Text style={[styles.TextTil,{marginLeft:5}]}>{this.state.resData.DateNow}</Text>
              </View>
              <View style={styles.PuCardView}>
                <View style={styles.UpDateView}>
                  <View style={this.state.resData.CheckType==0?styles.CardIcon:styles.CardIcons}><Text style={styles.IconText}>上</Text>
                  </View>
                  <View style={styles.PuCardDateView}>
                    <Text style={styles.PuCardDateText}>{this.state.resData.CheckInTime+" "}</Text>
                    <Text style={styles.PuCardDateTexts}>{"("+this.state.resData.RuleCheckInTime+")"}</Text>
                  </View>
                </View>
                {
                  this.state.resData.CheckInAddress=="考勤机"?<View style={[styles.PuCardTypeView,{marginTop:0}]}>
                    <Icon
                      name="hand-pointer-o"
                      size={14}
                      color="#64656B"
                      /><Text style={styles.PuCardDateTexts}> 考勤机打卡</Text>
                  </View>:this.state.resData.CheckInAddress==""?null:<View style={[styles.PuCardTypeView,{marginTop:0}]}>
                    <Icon
                      name="map-marker"
                      size={14}
                      color="#64656B"
                      /><Text style={styles.PuCardDateTexts}> {this.state.resData.CheckInAddress}</Text>
                  </View>
                }
                {
                  this.state.resData.Late=="正常"||this.state.resData.Late==""?null:<View style={styles.PuCardTypeView}>
                    <View style={styles.PuCardWorkView}><Text style={[styles.IconText,{fontSize:12}]}>{this.state.resData.Late}</Text></View>
                  </View>
                }


                <View style={[styles.UpDateView,{marginTop:15}]}>
                  <View style={this.state.resData.CheckType==1?styles.CardIcon:styles.CardIcons}><Text style={styles.IconText}>下</Text>
                  </View>
                  <View style={styles.PuCardDateView}>
                    <Text style={styles.PuCardDateText}>{this.state.resData.CheckOutTime+" "}</Text>
                    <Text style={styles.PuCardDateTexts}>{"("+this.state.resData.RuleCheckOutTime+")"}</Text>
                  </View>
                </View>
                {
                  this.state.resData.CheckOutAddress=="考勤机"?<View style={[styles.PuCardTypeView,{marginTop:0}]}>
                    <Icon
                      name="hand-pointer-o"
                      size={14}
                      color="#64656B"
                      /><Text style={styles.PuCardDateTexts}> 考勤机打卡</Text>
                  </View>:this.state.resData.CheckOutAddress==""?null: <View style={[styles.PuCardTypeView,{marginTop:0}]}>
                    <Icon
                      name="map-marker"
                      size={14}
                      color="#64656B"
                      /><Text style={styles.PuCardDateTexts}> {this.state.resData.CheckOutAddress}</Text>
                  </View>
                }
                {
                  this.state.resData.LeaveEarly=="正常"||this.state.resData.Late==""?null:<View style={styles.PuCardTypeView}>
                    <View style={styles.PuCardWorkView}><Text style={[styles.IconText,{fontSize:12}]}>{this.state.resData.LeaveEarly}</Text></View>
                  </View>
                }
                {
                  this.state.resData.CheckType==2&& this.state.resData.CanCheckIn&& this.state.resData.CheckInRange?<View style={styles.PuCardTypeView}>
                    <TouchableOpacity onPress={this.punchCardFun.bind(this,true)}>
                      <View style={styles.updateCardView}><Text style={styles.UpdateText}>更新打卡 </Text>
                        <Icon
                          name="refresh"
                          size={13}
                          color="#0077B0"
                          />
                      </View>
                    </TouchableOpacity>
                  </View>:null
                }

                {
                  this.state.resData.CanCheckIn&&this.state.resData.CheckType!=2?
                    this.state.resData.CheckInRange?this.state.resData.CheckDescription=="未到下班时间"?
                    <View style={styles.PuCardCont}>
                      <Bounceable
                        onPress={this.punchCardFun.bind(this,false)}
                        level={1.1}>
                    <TouchableOpacity onPress={this.punchCardFun.bind(this,false)} activeOpacity={0.8}>
                      <View style={styles.PuCardBtn}><Text style={styles.PuCardBtnText}>{this.state.resData.CheckDescription}</Text>
                        <Text style={[styles.PuCardBtnText,{fontSize:18}]}>确认打卡?</Text></View>
                    </TouchableOpacity>
                      </Bounceable>

                    <View style={styles.PuCardOkView}>
                      <View style={styles.cardText}><Text textAlign="center" style={[styles.PuCardDateTexts,{color:'#000000'}]}> 已进入打卡范围：{this.state.resData.Address}</Text></View>
                    </View>

                  </View>:<View style={styles.PuCardCont}>
                      <Bounceable
                        onPress={this.punchCardFun.bind(this,false)}
                        level={1.1}>
                    <TouchableOpacity onPress={this.punchCardFun.bind(this,false)} activeOpacity={0.8}>
                      <View style={styles.PuCardBtn}><Text style={[styles.PuCardBtnText,{fontSize:18}]}>{this.state.resData.CheckDescription}</Text>
                        <Text style={styles.PuCardBtnText}>{this.state.nowTime}</Text></View>
                    </TouchableOpacity>
                      </Bounceable>
                    <View style={styles.PuCardOkView}>
                      <View style={styles.cardText}><Text textAlign="center" style={[styles.PuCardDateTexts,{color:'#000000'}]}> 已进入打卡范围：{this.state.resData.Address}</Text></View>
                    </View>
                  </View>:<View style={styles.PuCardCont}>
                    <View style={[styles.PuCardBtn,{backgroundColor:'gray'}]}><Text style={[styles.PuCardBtnText,{fontSize:16}]}>未在打卡范围</Text></View>
                  </View>:null
                }


              </View>
            </ScrollView>
          </View>:<View style={[styles.noData,{flex:1}]}>
            <View style={styles.noData}>
              <Icon
                name="exclamation-circle"
                size={35}
                color="#A5A2A2"
                />
              <Text style={{fontSize:14}}>{this.state.errMsg}</Text>
            </View>
          </View>
        }

        <BusyIndicator color='#EFF3F5' loadType={1} loadSize={10} textFontSize={15} overlayColor='#4A4A4A' textColor='white' />
      </View>
    );
  }
};

