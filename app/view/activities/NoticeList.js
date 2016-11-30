/**
 * Created by lizx on 2016/3/29.
 */
'use strict';
import React, {Component} from 'react';
import {
  Image,
  Text,
  StyleSheet,
  View,
  Alert,
  TouchableOpacity,
  ToastAndroid,
  ListView,
  TextInput,
  ScrollView,
  InteractionManager,
  RefreshControl
} from 'react-native';
import styles from "./style";
import _ from 'lodash'
var Dimensions = require('Dimensions');
import api from "../../network/ApiHelper";
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/Ionicons';
var {height, widths} = Dimensions.get('window');
import NavigationBar from 'react-native-navbar';
import NavLeftView from '../common/NavLeftView'
var loaderHandler = require('react-native-busy-indicator/LoaderHandler');
var BusyIndicator = require('react-native-busy-indicator');
var _this;
var menuThis;

export default class NoticeList extends Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      Notices: [],
      isFetch: false,
      isRefreshControl: false
    };
    _this=this;
  };

  componentDidMount() {
      loaderHandler.showLoader("加载中...");
      this.getNotices();
  };
  getNotices(){
    api.Activity.getNotices()
      .then((resData)=> {
         loaderHandler.hideLoader();
        if (resData.Type == 1) {
          this.setState({
            isFetch: true,
            Notices: resData.Data,
            dataSource: this.state.dataSource.cloneWithRows(resData.Data)
          });
        } else {
          this.setState({
            isFetch: false
          });
        }

      })
  }
  clearNotices(){
    Alert.alert(
      '提示',
      '确定清除所有通知？',
      [
        {text: '取消'},
        {
          text: '确定', onPress: () => {
          this.refs.loader.startLoader();
          api.Activity.clearUnread()
            .then((resData)=> {
              this.refs.loader.finishLoader();
              if (resData.Type == 1) {
                this.setState({
                  isFetch: true,
                  Notices: []
                });
                this.props.reloadBadge();
              } else {
                this.setState({
                  isFetch: false
                });
              }})}
        }
      ])

  }
  noticeSkip(Notice){
    var currentData = this.state.Notices;
    let ids = _.pluck(this.state.Notices, 'Id');
    let _index = ids.indexOf(Notice['Id']);
    if (_index > -1) {
      currentData.splice(_index, 1);
    }
    var temp = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
    this.setState({
      dataSource: temp.cloneWithRows(currentData)
    });
    if(currentData.length==0){
      this.props.reloadBadge();
    }
    switch(Notice.NoticeType){
      case "NewComment":
      case "AtInComment":
        if(Notice.TenantType=="Task"){
          this.props.nav.push({
            id: 'TaskDetail',
            taskId:Notice.Id,
            isChild:false,
            type:'notice'
          });
        }
        if(Notice.TenantType=="Activity"){
          this.props.nav.push({
            id: 'ActivitiesDetail',
            activityId: Notice.Id,
            type:'notice'
          });
        }
        break;
      case "AtInActivity":
      case "NewReceipt":
        //动态详情
        this.props.nav.push({
          id: 'ActivitiesDetail',
          activityId: Notice.Id,
          type:'notice'
        });
        break;
      case "TaskReminder":
      case "TaskAttrbuteUpdate":
      case "NewTaskDirector":
      case "NewTaskAuditor":
      case "NewTaskPartner":
      case "NewTaskOnlooker":
      case "QuitTask":
        //任务详情
        this.props.nav.push({
          id: 'TaskDetail',
          taskId:Notice.Id,
          isChild:false,
          type:'notice'
        });
        break;
      case "RemoveTaskMember":
        //任务列表
        this.props.nav.push({
          id: 'TaskMain',
          reloadNum:()=>{},
          type:'notice'
        });
        break;
      case "NewProject":
      case "ProjectAttrbuteUpdate":
        //项目详情
        api.Project.projectDetail(Notice.Id)
          .then((res)=>{
            if(res.Type==1){
              this.props.nav.push({
                id: 'ProjectTabView',
                projectId:Notice.Id,
                projectName:res.Data.Name,
                type:'notice'
              })
            }
          });
        break;
      case "DailyReminder":
      case "WeeklyReminder":
      case "MonthlyReminder":
        //写汇报
        this.props.nav.push({
          id: 'CreatReport'
        });
        break;
      case "NewReport":
        //收到的汇报
        this.props.nav.push({
          id: 'ReceiveReport'
        });
        break;
      case "AttendanceReminder":
        //打卡
        this.props.nav.push({
          id: 'AttendanceMain'
        });
        break;
    }
  }
  onRefresh(){
    this.state.resData = [];
    this.getNotices();
  }
  renderNotice(Notice) {
    let NoticeTitle="";
    let NoticeFrom="";
    switch(Notice.NoticeType){
      case "NewComment":
      case "AtInComment":
        NoticeTitle="新回复提醒";
        if(Notice.TenantType=="Attachment"){
          NoticeFrom="查看文件";
        }
        if(Notice.TenantType=="Task"){
          NoticeFrom="前往任务";
        }
        if(Notice.TenantType=="Activity"){
          NoticeFrom="前往动态";
        }
        if(Notice.TenantType=="Article"){
          NoticeFrom="查看文章";
        }
        break;
      case "AtInActivity":
        NoticeTitle="新动态提醒";
        NoticeFrom="前往动态";
        break;
      case "TaskReminder":
        NoticeTitle="任务反馈提醒";
        NoticeFrom="前往任务";
        break;
      case "TaskAttrbuteUpdate":
        NoticeTitle="任务属性更改提醒";
        NoticeFrom="前往任务";
        break;
      case "RemoveTaskMember":
        NoticeTitle="移除任务提醒";
        NoticeFrom="前往任务";
        break;
      case "NewTaskDirector":
      case "NewTaskAuditor":
      case "NewTaskPartner":
      case "NewTaskOnlooker":
        NoticeTitle="新任务提醒";
        NoticeFrom="前往任务";
        break;
      case "QuitTask":
        NoticeTitle="退出任务提醒";
        NoticeFrom="前往任务";
        break;
      case "NewProject":
        NoticeTitle="新项目提醒";
        NoticeFrom="前往项目";
        break;
      case "NewReceipt":
        NoticeTitle="新回执请求提醒";
        NoticeFrom="前往动态";
        break;
      case "DailyReminder":
      case "WeeklyReminder":
      case "MonthlyReminder":
        NoticeTitle="填写汇报提醒";
        NoticeFrom="填写汇报";
        break;
      case "NewReport":
        NoticeTitle="新汇报提醒";
        NoticeFrom="前往汇报";
        break;
      case "AttendanceReminder":
        NoticeTitle="打卡提醒";
        NoticeFrom="前往打卡";
        break;
      case "ProjectAttrbuteUpdate":
        NoticeTitle="项目属性更改提醒";
        NoticeFrom="前往项目";
        break;
    }
    return (
      <View>
        <View style={styles.NoticeCellDate}>
          <Text style={[styles.title,{fontSize:13}]}>{Notice.DateCreated}</Text>
        </View>
        <TouchableOpacity onPress={this.noticeSkip.bind(this,Notice)}activeOpacity={0.5}>
        <View style={styles.NoticeCellContent}>
          <Text style={styles.NoticeTitle}>{NoticeTitle}</Text>
          <Text style={[styles.title,{marginTop:10,width:Dimensions.get('window').width-35}]}>{Notice.Content}</Text>
          <View style={{flexDirection: 'row',marginTop:10}}>
          <View style={{flex:1}}/>
          <Text style={[styles.title,{fontSize:13}]}>{NoticeFrom} ></Text>
          </View>
        </View>
        </TouchableOpacity>
      </View>
    );
  };
  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#EFF0F4'}}>
        <NavigationBar
          style={styles.NavSty}
          leftButton={
            <NavLeftView nav={this.props.nav} leftTitle={"通知"}/>
          }
        rightButton={
          <TouchableOpacity style={[styles.touIcon, {paddingLeft: 10,paddingRight:10}]} onPress={this.clearNotices.bind(this)}>
            <Icons
              name='ios-trash'
              size={25}
              color='white'
            />
          </TouchableOpacity>
        }/>
        <View style={{flex: 1}}>
          {this.state.isFetch && this.state.Notices.length == 0 ? <View style={styles.noruleViewV}>
            <Icon
              name="exclamation-circle"
              size={50}
              color="#717171"
            />
            <Text style={styles.noruleViewText}>暂无消息</Text>
          </View> :
            <ListView
              dataSource={this.state.dataSource}
              enableEmptySections={true}
              removeClippedSubviews={false}
              renderRow={this.renderNotice.bind(this)}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isRefreshControl}
                  onRefresh={this.onRefresh.bind(this)}
                  title="Loading..."
                  colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
                />
              }
              style={{backgroundColor: '#ECEFF1'}}
            />}
        </View>
        <BusyIndicator color='#EFF3F5' loadType={1} loadSize={10} textFontSize={15} overlayColor='#4A4A4A' textColor='white' />
      </View>
    );
  }
};

