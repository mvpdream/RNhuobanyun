import React, { Component } from 'react';
import {
     Image,
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    ToastAndroid,
    ListView,
  DatePickerAndroid,
  ScrollView,
  Picker,
  Dimensions
  } from 'react-native';

import styles from "./style";
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/Ionicons'
var {height, widths} = Dimensions.get('window');
import Prompt from 'react-native-prompt';
import api from "../../network/ApiHelper";
var BusyIndicator = require('react-native-busy-indicator');
var loaderHandler = require('react-native-busy-indicator/LoaderHandler');

import colorManager from '../common/styles/manager';
var myDate = new Date();
var DialogAndroid = require('react-native-dialogs');
var i=0;

class TimeAxisView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openDetail:this.props.title=="正常"?false:true,
            viewHeight:0
        }
    }
    openNormalDetail(){
        let isOpen=!this.state.openDetail;
        this.setState({openDetail:isOpen});
        if(isOpen){
            this.setState({viewHeight:this.props.data.length*60+20});
            //_this.refs.scrollView.scrollTo({x: 0, y: 1310, animated: true})
        }else{
            this.setState({viewHeight:0});
            //_this.refs.scrollView.scrollTo({x: 0, y: 1150, animated: true})
        }

    }
    render() {
        return (
          <View>
              <View style={styles.DetailTitle}>
                  <View style={styles.circleView}>
                      <View style={styles.circleSmallView}></View>
                  </View>
                  {
                      this.props.title=="正常"?<TouchableOpacity style={styles.NormalDetailTou} onPress={this.openNormalDetail.bind(this)}>
                          <Text style={[styles.TextNom,{fontSize:16,marginLeft:5}]}>{this.props.title} </Text>
                          <Icon
                            name="angle-double-down"
                            size={15}
                            onPress={this.openNormalDetail.bind(this)}
                            color="#175898"
                            />
                      </TouchableOpacity>:<Text style={[styles.TextNom,{fontSize:16,marginLeft:5}]}>{this.props.title}</Text>
                  }
              </View>
              <View style={[styles.borderView,{height:this.props.title=="正常"?this.state.viewHeight:this.props.data.length*30+20}]}>
                  {this.state.openDetail?<View style={styles.MyAtdDetailViews}>
                      {
                          this.props.type==0?this.props.data&&this.props.data.length!=0&&this.props.data.map((item,index)=>{
                              return(
                                <View style={styles.DetailItemTitle} key={index}>
                                    <Text style={styles.PuCardDateTexts}>{item}</Text>
                                </View>
                              )
                          }):null}
                      {
                          this.props.type==1?this.props.data&&this.props.data.length!=0&&this.props.data.map((item,index)=>{
                              return(
                                <View style={styles.DetailItemTitle} key={index}>
                                    <Text style={styles.PuCardDateTexts}>{item.CheckinTime}</Text>
                                    <View style={[styles.PuCardWorkView,{marginLeft:5}]}><Text style={[styles.IconText,{fontSize:12,width:widths*0.2}]} numberOfLines={1}>{item.CheckinLate}</Text></View>
                                </View>
                              )
                          }):null
                      }
                      {
                          this.props.type==2?this.props.data&&this.props.data.length!=0&&this.props.data.map((item,index)=>{
                              return(
                                <View style={styles.DetailItemTitle} key={index}>
                                    <Text style={styles.PuCardDateTexts}>{item.CheckOutTime}</Text>
                                    <View style={[styles.PuCardWorkView,{marginLeft:5}]}><Text style={[styles.IconText,{fontSize:12}]}>{item.CheckOutLeaveEarly}</Text></View>
                                </View>
                              )
                          }):null
                      }
                      {
                          this.props.type==3?this.props.data&&this.props.data.length!=0&&this.props.data.map((item,index)=>{
                              return(
                                <View key={index}>
                                    <View style={styles.DetailItemTitle}>
                                        <Text style={styles.PuCardDateTexts}>{item.CheckinTime}</Text>
                                    </View>
                                    <View style={styles.DetailItemTitle}>
                                        <Text style={styles.PuCardDateTexts}>{item.CheckOutTime}</Text>
                                    </View>
                                </View>
                              )
                          }):null
                      }


                  </View>:null}

              </View>
          </View>
        )
    }
;
}
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
                  i++;
                //this.refs.scrollView.scrollTo({x: 0, y: 0, animated: true})
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
                          <ScrollView ref="scrollView" key={i} keyboardShouldPersistTaps={true} keyboardDismissMode ='on-drag'>
                              {
                                  this.state.resData&&this.state.resData.WithoutCheckinDetail.length!=0?
                                    <TimeAxisView
                                      title="缺卡"
                                      type={0}
                                      data={this.state.resData.WithoutCheckinDetail}/> :null}
                              {
                                  this.state.resData&&this.state.resData.LateDetails.length!=0?
                                    <TimeAxisView
                                      title="迟到"
                                      type={1}
                                      data={this.state.resData.LateDetails}/>:null}
                              {
                                  this.state.resData&&this.state.resData.LeaveEarlyDetails.length!=0?
                                    <TimeAxisView
                                      title="早退"
                                      type={2}
                                      data={this.state.resData.LeaveEarlyDetails}/>:null}
                              {
                                  this.state.resData&&this.state.resData.NormalDetails.length!=0?
                                    <TimeAxisView
                                      title="正常"
                                      type={3}
                                      data={this.state.resData.NormalDetails}/>:null}
                          </ScrollView>
                      </View>
                  }



              </View>
              <BusyIndicator color='#EFF3F5' loadType={1} loadSize={10} textFontSize={15} overlayColor='#4A4A4A' textColor='white'/>

          </View>
        );
    }
};

