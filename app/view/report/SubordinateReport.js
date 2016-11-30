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
  ScrollView,
  Dimensions
  } from 'react-native';

import styles from "./style";
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';
import NavLeftView from '../common/NavLeftView'
import ScrollableTabView from 'react-native-scrollable-tab-view';
var {height, widths} = Dimensions.get('window');
import ReportRules from './ReportRules';
import api from "../../network/ApiHelper";
var DialogAndroid = require('react-native-dialogs');
import _ from 'lodash'
var  dataSource = new ListView.DataSource({rowHasChanged: (row1, row2) => row1.title !== row2.title});
import ReportList from './ReportList.js'

export default class SubordinateReport extends React.Component{
  constructor(props){
    super(props);
    const nav = this.props.nav;

    this.state = {
      day:0,
      typestatus:0,
      subordinateId:"",
      subordinatename:"",
      userdata:[],
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    };
  };
  componentDidMount() {
    this.getMySubordinate();
  }
  getMySubordinate() {
    api.User.getMySubordinate()
      .then((resData)=>{
        if(resData.Type==1){
          this.setState({
            userdata: resData.Data
          });
          if(resData.Data!=""){
            if(this.props.userid!=null){
              this.setState({subordinateId:this.props.userid,subordinatename:this.props.username});
              this.refs.dailyLists.startLoad(this.props.userid);
              this.refs.weekLists.startLoad(this.props.userid);
              this.refs.monthLists.startLoad(this.props.userid);
            }
            else{
              this.showDialog()}
          }
          else{
            Alert.alert(
              '没有下属',
              '没有相关的下属人员！',
              [
                {text: '确定', onPress: () => {this.props.nav.pop()}},
              ]
            )
          }
        }else{
          alert("获取下属失败");
        }

      })
  }
  cancelGet(){
    if(this.state.subordinateId==""&&this.state.subordinatename==""&&this.props.userid==null&&this.props.username==null){
      //第一次进入  且没有选择下属
      this.props.nav.pop();
    }
  }
  showDialog() {
    var userdata=_.pluck(this.state.userdata,"Name");
    var options = {
      data: {
        items:userdata,
        itemsCallback: (index, text) =>
        {
          this.setState({
            subordinateId: this.state.userdata[index]["Id"].toString(),
            subordinatename:text,
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear()
          });
        this.refs.dailyLists && this.refs.dailyLists.startLoad(this.state.subordinateId);
        this.refs.weekLists && this.refs.weekLists.startLoad(this.state.subordinateId);
        this.refs.monthLists && this.refs.monthLists.startLoad(this.state.subordinateId);
        },
        negativeText: "取消",
        onNegative:()=>{this.cancelGet()},
        title: "选择下属"
      }
    };
    var dialog = new DialogAndroid();
    dialog.set(options.data);
    dialog.show();
  }
  getUncommittedReport(){
    this.props.nav.push({
      id: 'UncommittedReport',
    });
  };
  render() {
    var toolbarActions = [
      {title: '提交情况', show: 'always'},
    ];
    return (
      <View style={{flex:1}}>
        <NavigationBar
          style={styles.NavSty}
          leftButton={
           <NavLeftView nav={this.props.nav} leftTitle="下属的汇报"/>
                   }
          rightButton={

                   <TouchableOpacity style={{marginRight:10,justifyContent: 'center'}} onPress={this.getUncommittedReport.bind(this)}>
                    <Text numberOfLines={1} style={styles.rightNavText}>提交情况</Text>
                      </TouchableOpacity>
                    } />

        <ScrollableTabView
          tabBarBackgroundColor='white'
          tabBarUnderlineColor='#3A83E1'
          tabBarActiveTextColor='#3A83E1'
          initialPage={this.props.type==null?0:this.props.type}>
          <View
            tabLabel="日报"
            style={{flex: 1,backgroundColor:'#ECEFF1'}}
            >
            <ReportList ref='dailyLists' userId={this.state.subordinateId} username={this.state.subordinatename} nav={this.props.nav} reportType={0} />
          </View>


          <View
            tabLabel="周报"
            style={{flex:1,backgroundColor:'#ECEFF1'}}
            >
            <ReportList ref='weekLists' userId={this.state.subordinateId} username={this.state.subordinatename} nav={this.props.nav} reportType={1} />
          </View>

          <View
            tabLabel="月报"
            style={{flex: 1,backgroundColor:'#ECEFF1'}}
            >
            <ReportList ref='monthLists' userId={this.state.subordinateId} username={this.state.subordinatename} nav={this.props.nav} reportType={2} />
          </View>

        </ScrollableTabView>
        <TouchableOpacity onPress={this.showDialog.bind(this)}>
          <View style={styles.listDown}>
            <View style={styles.info}>
              <Text style={styles.text}>下属：{this.state.subordinatename}</Text>
            </View>
            <View>
              <Icon
                name='angle-right'
                size={30}
                style={{width:25,height:32,color:"#3C3B3B",justifyContent: 'center',
    alignItems: 'center',}}
                />
            </View>
          </View>
        </TouchableOpacity>
      </View>

    );
  }
}
