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
    Component,
  DatePickerAndroid,
  ScrollView,
  Picker
    } from 'react-native';
import styles from "./style";
var Dimensions=require('Dimensions');
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/Ionicons'
var {height, widths} = Dimensions.get('window');
import Prompt from 'react-native-prompt';
import api from "../../network/ApiHelper";
var BusyIndicator = require('react-native-busy-indicator');
var loaderHandler = require('react-native-busy-indicator/LoaderHandler');
import Toast from  '@remobile/react-native-toast'
import colorManager from '../common/styles/manager';
var myDate = new Date();
var DialogAndroid = require('react-native-dialogs');

export default class MyAttendance extends React.Component{
    constructor(props){
        super(props);
        const nav = this.props.nav;
        this.state = {
            year: myDate.getFullYear(),
            month:myDate.getMonth()+1,
            haveData:false,
            openDetail:false
        };
    };
    componentDidMount() {
        this.getMyData(this.state.month);
    }
    getMyData(month){
        loaderHandler.showLoader("请稍等。。。");
        api.Attendance.myAttendance(month)
        .then((res)=>{
              loaderHandler.hideLoader();
              if(res.Type==1){
                this.setState({resData:res.Data,haveData:true});
              }else{
                  this.setState({haveData:false});
              }

          })
    }
    showDatePicker() {
        this.showDialog();
    };
    showDialog() {
        var dataArr=[];
        for(let j = 1;j<13;j++){
            dataArr.push(j+"月");
        }
        var options = {
            data: {
                items:dataArr,
                itemsCallback: (index, text) =>
                {
                    let selMonth=text.substr(0,text.length-1);
                    this.setState({
                        month:selMonth
                    });
                    this.getMyData(this.state.month);
                },
                negativeText: "取消",
                title: "选择月份"
            }
        };
        var dialog = new DialogAndroid();
        dialog.set(options.data);
        dialog.show();
    }
    openNormalDetail(){
        this.setState({openDetail:!this.state.openDetail});
        //this.refs.scrollView.scrollTo({x: 0, y: Dimensions.get('window').height, animated: true})
    }

    render() {
        return (
          <View style={{flex:1,backgroundColor:colorManager.getCurrentStyle().BGCOLOR}}>

              <View style={styles.MyAtdContainer}>
                <View style={styles.MyAtdCont}>
                    <View style={styles.DataPickerView}>
                        <View style={styles.DataPickerHeadView}><Text style={[styles.IconText,{fontSize:12}]}>日期</Text></View>
                        <View style={styles.DataPickerContView}>
                            <TouchableOpacity onPress={this.showDatePicker.bind(this)} activeOpacity={0.8}>
                                <Text style={styles.TextNom}>{this.state.year}年</Text>
                                <View style={styles.MonthView}>
                                    <Text style={styles.MonthText}>{this.state.month}月 </Text>
                                    <Icon
                                      name="chevron-circle-down"
                                      size={14}
                                      color="#000000"
                                      style={{marginTop:5}}
                                      />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {
                        !this.state.haveData?null: <View style={styles.MyAtdCountView}>
                            <View style={styles.nomView}>
                                <Text style={styles.TextNom}>正常出勤</Text>
                                <Text style={styles.TextNom}>{this.state.resData&&this.state.resData.Normal}天</Text>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <View style={[styles.otherWorkView,{borderLeftWidth: 0}]}>
                                    <Text style={styles.TextNom}>迟到</Text>
                                    <Text style={styles.TextNom}>{this.state.resData&&this.state.resData.Late}次</Text>
                                </View>
                                <View style={styles.otherWorkView}>
                                    <Text style={styles.TextNom}>早退</Text>
                                    <Text style={styles.TextNom}>{this.state.resData&&this.state.resData.LeaveEarly}次</Text>
                                </View>
                                <View style={styles.otherWorkView}>
                                    <Text style={styles.TextNom}>缺卡</Text>
                                    <Text style={styles.TextNom}>{this.state.resData&&this.state.resData.WithoutCheckin}次</Text>
                                </View>
                            </View>
                        </View>
                    }

                    
                </View>
                  {
                      !this.state.haveData?<View style={[styles.noData,{flex:1}]}>
                          <View style={styles.noData}>
                              <Icon
                                name="exclamation-circle"
                                size={35}
                                color="#A5A2A2"
                                />
                              <Text style={{fontSize:14}}>没有记录</Text>
                          </View>
                      </View>: <View style={{marginTop:20,flex:1}}>
                          <ScrollView ref="scrollView" keyboardShouldPersistTaps={true} keyboardDismissMode ='on-drag'>
                              {
                                  this.state.resData&&this.state.resData.WithoutCheckinDetail.length!=0? <View>
                                      <View style={styles.DetailTitle}>
                                          <View style={styles.circleView}>
                                              <View style={styles.circleSmallView}></View>
                                          </View>
                                          <Text style={[styles.TextNom,{fontSize:16,marginLeft:5}]}>缺卡</Text>
                                      </View>
                                      <View style={styles.MyAtdDetailView}>
                                          <View style={styles.MyAtdDetailViews}>
                                              {
                                                  this.state.resData&&this.state.resData.WithoutCheckinDetail.length!=0&&this.state.resData.WithoutCheckinDetail.map((item,index)=>{
                                                      return(
                                                        <View style={styles.DetailTitle} key={index}>
                                                            <Text style={styles.PuCardDateTexts}>{item}</Text>
                                                        </View>
                                                      )
                                                  })
                                              }

                                          </View>
                                      </View>
                                  </View>:null
                              }
                              {
                                  this.state.resData&&this.state.resData.LateDetails.length!=0? <View style={this.state.resData.WithoutCheckinDetail.length!=0?{marginTop:-8}:{marginTop:0}}>
                                      <View style={styles.DetailTitle}>
                                          <View style={styles.circleView}>
                                              <View style={styles.circleSmallView}></View>
                                          </View>
                                          <Text style={[styles.TextNom,{fontSize:16,marginLeft:5}]}>迟到</Text>
                                      </View>
                                      <View style={styles.MyAtdDetailView}>
                                          <View style={styles.MyAtdDetailViews}>
                                              {
                                                  this.state.resData&&this.state.resData.LateDetails.length!=0&&this.state.resData.LateDetails.map((item,index)=>{
                                                      return(
                                                        <View style={styles.DetailTitle} key={index}>
                                                            <Text style={styles.PuCardDateTexts}>{item.CheckinTime}</Text>
                                                            <View style={[styles.PuCardWorkView,{marginLeft:15}]}><Text style={[styles.IconText,{fontSize:12}]}>{item.CheckinLate}</Text></View>
                                                        </View>
                                                      )
                                                  })
                                              }
                                          </View>
                                      </View>
                                  </View>:null
                              }
                              {
                                  this.state.resData&&this.state.resData.LeaveEarlyDetails.length!=0? <View style={this.state.resData.LateDetails.length!=0?{marginTop:-8}:{marginTop:0}}>
                                      <View style={styles.DetailTitle}>
                                          <View style={styles.circleView}>
                                              <View style={styles.circleSmallView}></View>
                                          </View>
                                          <Text style={[styles.TextNom,{fontSize:16,marginLeft:5}]}>早退</Text>
                                      </View>
                                      <View style={styles.MyAtdDetailView}>
                                          <View style={styles.MyAtdDetailViews}>
                                              {
                                                  this.state.resData&&this.state.resData.LeaveEarlyDetails.length!=0&&this.state.resData.LeaveEarlyDetails.map((item,index)=>{
                                                      return(
                                                        <View style={styles.DetailTitle} key={index}>
                                                            <Text style={styles.PuCardDateTexts}>{item.CheckOutTime}</Text>
                                                            <View style={[styles.PuCardWorkView,{marginLeft:15}]}><Text style={[styles.IconText,{fontSize:12}]}>{item.CheckOutLeaveEarly}</Text></View>
                                                        </View>
                                                      )
                                                  })
                                              }
                                          </View>
                                      </View>
                                  </View>:null
                              }
                              {
                                  this.state.resData&&this.state.resData.NormalDetails.length!=0?<View style={this.state.resData.LeaveEarlyDetails.length!=0?{marginTop:-8}:{marginTop:0}}>
                                      <View style={styles.DetailTitle}>
                                          <View style={styles.circleView}>
                                              <View style={styles.circleSmallView}></View>
                                          </View>
                                          <TouchableOpacity style={styles.NormalDetailTou} onPress={this.openNormalDetail.bind(this)}>
                                              <Text style={[styles.TextNom,{fontSize:16,marginLeft:5}]}>正常 </Text>
                                              <Icon
                                                name="angle-double-down"
                                                size={15}
                                                onPress={this.openNormalDetail.bind(this)}
                                                color="#175898"
                                                />
                                          </TouchableOpacity>
                                      </View>
                                      {
                                          this.state.openDetail?  <View style={styles.MyAtdDetailView}>
                                              <View style={styles.MyAtdDetailViews}>
                                                  {
                                                      this.state.resData&&this.state.openDetail&&this.state.resData.NormalDetails.length!=0&&this.state.resData.NormalDetails.map((item,index)=>{
                                                          return(
                                                            <View key={index}>
                                                                <Text style={[styles.PuCardDateTexts,{paddingBottom:10}]}>{item.CheckinTime}</Text>
                                                                <Text style={[styles.PuCardDateTexts,{paddingBottom:10}]}>{item.CheckOutTime}</Text>
                                                            </View>

                                                          )
                                                      })
                                                  }
                                              </View>
                                          </View>:null
                                      }

                                  </View>:null
                              }
                              </ScrollView>
                      </View>
                  }



              </View>
              <BusyIndicator color='#EFF3F5' loadType={1} loadSize={10} textFontSize={15} overlayColor='#4A4A4A' textColor='white'/>

          </View>
        );
    }
};

