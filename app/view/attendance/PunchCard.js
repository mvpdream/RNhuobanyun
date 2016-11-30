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
  ActivityIndicator,
  NetInfo,
  Dimensions
  } from 'react-native';

import styles from "./style";
import NavigationBar from 'react-native-navbar';
import NavLeftView from '../common/NavLeftView'
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/Ionicons'
var {height, width} = Dimensions.get('window');
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
import BaiduLocation from 'react-native-bdmap';
var WifiManager = require('react-native-wifi-manager');
import wifi from 'react-native-android-wifi';

export default class PunchCard extends React.Component{
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
      currentAppState: AppState.currentState,
      ishaveRule:true
    };
    this._handleAppStateChange=this._handleAppStateChange.bind(this);

  };
  componentDidMount() {
    i=0;
    locationData=null;
    this.getData();
    //WifiManager.list(
    //  (wifiArray) => {
    //    debugger;
    //  },
    //  (msg) => {
    //    console.log(msg);
    //  }
    //);
    AppState.addEventListener('change', this._handleAppStateChange);
  }
   refreshPosition(){
    BaiduLocation.stopObserving();
    this.setState({serviceStart: false,haveData: false, isFetch: false});
    i = 0;
    this.getData();
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
        BaiduLocation.stopObserving();//停止定位服务
      })
  }
  getDatas(callback){
    this.watchID = BaiduLocation.watchPosition((position) => {
        i++;
        this.setState({serviceStart:true});
        /**
         * 当用户在100m之内的时候CheckInRange是true
         * 超出100m的时候通过updateData函数更新resData,此时的CheckInRange=false
         */
        if(this.state.resData&&this.state.resData.length!=0&&this.state.resData.CanCheckIn&&this.state.resData.CheckInRange){
          let distance=this.getError(position.latitude,position.longitude,this.state.resData.Alatitude,this.state.resData.Alongitude);
          //判断当前经纬度与规则中经纬度的距离，相差100m的时候获取数据，刷新页面。
          if(distance>this.state.resData.ErrorRange/1000){
            if(this.state.isNeedWifi){
              WifiManager.list((wifiStringList) => {
                  var oldWifiArray = JSON.parse(wifiStringList);
                  mac="";
                  name="";
                  if(oldWifiArray&&oldWifiArray.length!=0){
                    wifiArray=oldWifiArray.map((item)=>{
                      mac=mac+","+item.BSSID;
                      name=name+","+item.SSID;
                    });
                  }
                  this.updateData(mac,name,position.longitude,position.latitude);
                },
                (error) => {
                  loaderHandler.hideLoader();
                  ToastAndroid.show("获取wifi列表失败",ToastAndroid.SHORT);
                }
              );
            }else{
              this.updateData("","",position.longitude,position.latitude);
            }

          }
        }
        locationData=position;
        callback(position);
      },
      (error) =>{
        ToastAndroid.show("定位失败。错误代码"+error.code,ToastAndroid.SHORT);
        this.setState({serviceStart:true});
        BaiduLocation.stopObserving();//停止定位服务
        /**
         * 根据考勤规则判断是否需要wifi（wifi，定位二选一），需要的话继续获取wifi列表。
         * 不需要，不能打卡
         */
        if(this.state.isNeedWifi){
          WifiManager.list((wifiStringList) => {
              var oldWifiArray = JSON.parse(wifiStringList);
              mac="";
              name="";
              if(oldWifiArray&&oldWifiArray.length!=0){
                wifiArray=oldWifiArray.map((item)=>{
                  mac=mac+","+item.BSSID;
                  name=name+","+item.SSID;
                });
              }
              this.updateData(mac,name,0,0);
            },
            (error) => {
              ToastAndroid.show("获取wifi列表失败",ToastAndroid.SHORT);
            }
          );
        }else{
          this.updateData("","",0,0);
        }
      },
      {enableHighAccuracy: true, timeout: 3000,mode:'HighAccuracy',scanSpan:1000}
    );
  }
  rad(d){
    var PI = Math.PI;
    return d*PI/180.0;
  }
  /**
   * 计算两点之间的距离，判断是否超出打卡范围
   * 刷新页面。
   * @param lat1
   * @param lng1
   * @param lat2
   * @param lng2
   * @returns {number}
   */
  getError(lat1,lng1,lat2,lng2){
    var radLat1 = this.rad(lat1);
    var radLat2 = this.rad(lat2);
    var a = radLat1 - radLat2;
    var b = this.rad(lng1) - this.rad(lng2);

    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137;
    s = Math.round(s * 10000) / 10000;
    return s;
  }
  getLocationData(item){
    var longitude=0;
    var latitude=0;
    if(item!=null){
      longitude=item.longitude;
      latitude=item.latitude;
    }
    /**
     * 此处为获取数据，所以在定位服务监听运行中的时候不去刷新数据。
     * 必要的时候更新页面的时候把i设成0即可获取最新的数据渲染页面。
     */
    if(i==1){
      loaderHandler.showLoader("请稍等。。。");
      api.Attendance.attendance(mac,name,longitude,latitude)
        .then((res)=>{
          loaderHandler.hideLoader();
          var nowTimes=formatter('hh:mm',new Date());
          this.setState({isFetch:true});
          if(res.Type==1){
            this.setState({resData:res.Data,haveData:true,nowTime:nowTimes});
          }else{
            this.setState({haveData:false,errMsg:res.Data});
          }
        })
    }


  }
  getData(){
    api.Attendance.getAttendanceRule()
      .then((res)=>{
        if(res.Type==1){
          this.setState({isNeedWifi:res.Data});
          if(res.Data){
            //需要wifi
            WifiManager.list((wifiStringList) => {
                var oldWifiArray = JSON.parse(wifiStringList);
                mac="";
                name="";
                if(oldWifiArray&&oldWifiArray.length!=0){
                  wifiArray=oldWifiArray.map((item)=>{
                    mac=mac+","+item.BSSID;
                    name=name+","+item.SSID;
                  });
                }
                this.getDatas(this.getLocationData.bind(this));
              },
              (error) => {
                ToastAndroid.show("获取wifi列表失败",ToastAndroid.SHORT);
              }
            )
          }
          else{
            mac="";
            name="";
            this.getDatas(this.getLocationData.bind(this));
          }
        }else{
          if(res.Data=="没有考勤规则"){
            this.setState({isFetch:true,serviceStart:true,haveData:false,ishaveRule:false});
          }else{
            this.setState({isFetch:true,serviceStart:true,haveData:false,errMsg:res.Data});
          }
          ToastAndroid.show((res.Data==undefined||res.Data==null)?"未知错误":res.Data,ToastAndroid.SHORT);
        }
      });


  }
  punchCardFun(isUpdate){
    //打卡
    wifi.getMACInfo((mac)=>{
      if(mac!=""&&locationData!=null){
        if(this.state.resData.CheckDescription=="未到下班时间"||isUpdate){
          var msg=isUpdate?"是否更新？":"未到打卡时间\n是否继续？";
          Alert.alert(
            '提示',
            msg,
            [
              {text: '确认', onPress: () => {
                var toastMsg=isUpdate?"更新成功":"打卡成功";
                loaderHandler.showLoader("请稍等。。。");
                api.Attendance.checkIn(mac,locationData.longitude,locationData.latitude)
                  .then((res)=>{
                    if(res.Type==1){
                      ToastAndroid.show(toastMsg,ToastAndroid.SHORT);
                      this.props.isPunchOk(true);
                      i=0;
                      this.getData();
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
          api.Attendance.checkIn(mac,locationData.longitude,locationData.latitude)
          .then((res)=>{
              if(res.Type==1){
                ToastAndroid.show((res.Data==undefined||res.Data==null)?"未知错误":res.Data,ToastAndroid.SHORT);
                this.props.isPunchOk(true);
                i=0;
                this.getData();
              }else{
                loaderHandler.hideLoader();
                ToastAndroid.show((res.Data==undefined||res.Data==null)?"未知错误":res.Data,ToastAndroid.SHORT);
              }
            })
      }}

    });

  }
  componentWillUnmount() {
    BaiduLocation.stopObserving();//停止定位服务
    AppState.removeEventListener('change', this._handleAppStateChange);//卸载判断程序在前后台运行的监听函数
  }
  _handleAppStateChange(currentAppState) {
    //后台运行的时候把定位服务stop掉
      if(currentAppState!="active"){
       if(this.watchID){
         BaiduLocation.stopObserving();//停止定位服务
       }
      }
      else{
        //更新数据。
        i=0;
        this.getData();
      }
  }
  render() {
    return (
      <View style={{flex:1,backgroundColor:colorManager.getCurrentStyle().BGCOLOR}}>
        {
          !this.state.serviceStart?<View style={[styles.noData,{flex:1}]}>
            <View style={styles.noData}>
            <ActivityIndicator animating={true} color='#A5A2A2' size='large'/>
              <Text style={{fontSize:14}}>正在获取当前位置</Text>
            </View>
          </View>:null
        }
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
                    <View style={[styles.PuCardBtn,{backgroundColor:'gray'}]}><Text style={[styles.PuCardBtnText,{fontSize:16}]}>未在打卡范围</Text>
                     
                    </View>
                    <TouchableOpacity onPress={this.refreshPosition.bind(this)}
                                        activeOpacity={0.5}
                                        style={{height:50,width: width * 0.35}}>
                        <View style={styles.PuCardOkView}>
                          <View style={styles.repositionView}>
                            <Icons
                              name='md-refresh'
                              size={16}
                              color='blue'
                            />
                            <Text textAlign="center" style={styles.repositionText}>
                              重新定位
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                  </View>:null
                }


              </View>
            </ScrollView>
          </View>:this.state.ishaveRule?<View style={[styles.noData,{flex:1}]}>
            <View style={styles.noData}>
              <Icon
                name="exclamation-circle"
                size={35}
                color="#A5A2A2"
                />
              <Text style={{fontSize:14}}>{this.state.errMsg}</Text>
            </View>
          </View>:<View style={[styles.noData,{flex:1}]}>
            <View style={styles.noRuleData}>
              <Icon
                name="warning"
                size={50}
                color="#FF9800"
                /><View style={{marginLeft:10}}>
              <Text style={{fontSize:14,justifyContent:'flex-end',width: Dimensions.get('window').width*0.6}}>还未设置考勤规则，请通知管理员在web端设定考勤规则</Text>
            </View>

            </View>
          </View>
        }

        <BusyIndicator color='#EFF3F5' loadType={1} loadSize={10} textFontSize={15} overlayColor='#4A4A4A' textColor='white' />
      </View>
    );
  }
};

