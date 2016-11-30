'use strict';

import React, { Component } from 'react';
import {
    AppRegistry, View, BackAndroid, Navigator, Text,Alert,ToastAndroid,AppState,NetInfo
  } from 'react-native';
import Loading from './Loading.js'
import api from '../network/ApiHelper';
import MainTabView from './common/MainTabView.js'
import Login from './account/Login.js'
import Register from './account/Register.js'
import FindPassword from './account/FindPassword.js'
import ResetPassword from './account/ResetPassword.js'
import RegisterSucceed from './account/RegisterSucceed.js'
import CreatCompany from './account/CreatCompany.js'
import JoinCompany from './account/JoinCompany.js'
import SelectCompany from './account/SelectCompany.js'
import ReportMain from './report/ReportMain.js'
import CreatReport from './report/CreatReport.js'
import ReportRules from './report/ReportRules.js'
import SubmitReport from './report/SubmitReport.js'
import ReceiveReport from './report/ReceiveReport.js'
import UncommittedReport from './report/UncommittedReport.js'
import ReportDetail from './report/ReportDetail.js'
import SubordinateReport from './report/SubordinateReport.js'
import UserCenterMain from './usercenter/UserCenterMain.js'
import UserSetting from './usercenter/UserSetting.js'
import MyFavorite from './usercenter/MyFavorite.js'
import UserInfo from './usercenter/UserInfo.js'
import UserSuperior from './usercenter/UserSuperior.js'
import ExitCompany from './usercenter/ExitCompany.js'
import AccountSafe from './usercenter/AccountSafe.js'
import UpdateUser from './usercenter/UpdateUser.js'
import UpdatePassword from './usercenter/UpdatePassword.js'
import AddressBook from './addressbook/AddressBook.js'
import SearchAddress from './addressbook/SearchAddress.js'
import ExportAddress from './addressbook/ExportAddress.js'
import AddressInfo from './addressbook/AddressInfo.js'
import SelectorMain from './selector/SelectorMain.js'
import AllActivities from './activities/AllActivities.js'
import ActivitiesDetail from './activities/ActivitiesDetail.js'
import VoteOrReceiptDetail from './activities/VoteOrReceiptDetail.js'
import ActivityScopesDetail from './activities/ActivityScopesDetail.js'
import SearchActivities from './activities/SearchActivities.js'
import SendActivity from './activities/SendActivity.js'
import SendVote from './activities/SendVote.js'
import ImagesViewer from './common/ImagesViewer.js'

import KbMain from './kb/KbMain.js'
import SearchKb from './kb/SearchKb.js'
import PhotoSelector from './common/PhotoSelector.js'
import FileSelector from './common/FileSelector.js'
import KbFileDetail from './kb/KbFileDetail.js'
import KbArticleDetail from './kb/KbArticleDetail.js'
import CommentList from './common/CommentList.js'
import AttendanceMain from './attendance/AttendanceMain.js'
import MyPunchCard from './attendance/MyPunchCard'
import TaskMain from './task/TaskMain'
import SearchTask from './task/SearchTask'
import SearchResults from './task/SearchResults'
import CreatTask from './task/CreatTask'
import TaskDetail from './task/TaskDetail.js'
import TaskCommentLists from './task/TaskCommentLists'
import TaskLogLists from './task/TaskLogLists'
import ProjectMain from './project/ProjectMain'
import SearchProjects from './project/SearchProjects'
import CreatProject from './project/CreatProject'
import ProjectTabView from './project/ProjectTabView.js'
import ProStageSetting from './project/ProStageSetting'
import NoticeList from './activities/NoticeList'
import JPush , {JpushEventReceiveMessage, JpushEventOpenMessage} from 'react-native-jpush'
import _ from "lodash";
// import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';
var dismissKeyboard = require('dismissKeyboard');


var _navigator, _quitStatus = false;
var isPushNotice = false;


api.Util.setErrConsumeFunction(err=>{
  if (err instanceof TypeError) {
    if(err.message=="Network request failed"){
      //网络问题 连接不到服务器
      Alert.alert(
        '警告',
        '请检查你的网络情况！',
        [
          {text: 'OK'}
        ]
      )
    }
    else{
      Alert.alert(
        '警告',
        '未知错误！！！',
        [
          {text: 'OK'}
        ]
      )
    }
  } else if (err instanceof SyntaxError) {
    Alert.alert(
      '警告',
      '呀！！不小心网络出问题了',
      [
        {text: 'OK'}
      ]
    )
  } else {
    Alert.alert(
      '警告',
      '未知错误！！！',
      [
        {text: 'OK'}
      ]
    )
  }
});
BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator.getCurrentRoutes().length === 1) {
    if (_quitStatus) {
      return false;
    } else {
      ToastAndroid.show("再按一次返回键退出伙伴客户端",ToastAndroid.SHORT);
      _quitStatus = true;
      setTimeout(()=> {
        _quitStatus = false;
      }, 2000);
      return true;
    }
  }
  if(_navigator.getCurrentRoutes()[_navigator.getCurrentRoutes().length-1].id!="FileSelector"){
    if(_navigator.getCurrentRoutes()[_navigator.getCurrentRoutes().length-1].id!="TaskDetail"){
      _navigator.pop();
    }else{

    }
  }
  else if(_navigator.getCurrentRoutes()[_navigator.getCurrentRoutes().length-1].id=="ActivitiesDetail"){
    dismissKeyboard();
    _navigator.pop();
  }
  return true;
});

var Routers = React.createClass({
  getInitialState : function () {
    return {type:0,currentAppState:""};
  },
  componentDidMount() {
    //WifiManager.setAdjustResize();
    JPush.requestPermissions();
    this.pushlisteners = [
      JPush.addEventListener(JpushEventReceiveMessage, this.onReceiveMessage),
      JPush.addEventListener(JpushEventOpenMessage, this.onOpenMessage)
    ];
    NetInfo.addEventListener('change',this.isConnected);

  },
  componentWillUnmount() {
    this.pushlisteners.forEach(listener=> {
      JPush.removeEventListener(listener);
    });
    NetInfo.removeEventListener('change',this.isConnected);
  },
  renderScene: function (route, navigator) {
    _navigator = navigator;
    if (route.id === 'MainTabView') {
      return (
        <View style={{flex: 1}}>
          <MainTabView nav={navigator} type={route.type} selectedTab={route.selectedTab}/>
        </View>
      );
    }
    if (route.id === 'Loading') {
      return (
        <View style={{flex: 1}}>
          <Loading nav={navigator} type={route.type}/>
        </View>
      )
    }
    if (route.id === 'Login') {
      return (
        <View style={{flex: 1}}>
          <Login nav={navigator}/>
        </View>
      );
    }
    if (route.id === 'Register') {
      return (
        <View style={{flex: 1}}>
          <Register nav={navigator}/>
        </View>
      );
    }
    if(route.id==='ResetPassword'){
      return(
        <View style={{flex: 1}}>
          <ResetPassword nav={navigator} phonenum={route.phonenum}/>
        </View>
      )
    }
    if (route.id === 'FindPassword') {
      return (
        <View style={{flex: 1}}>
          <FindPassword nav={navigator}/>
        </View>
      );
    }
    if (route.id === 'RegisterSucceed') {
      return (
        <View style={{flex: 1}}>
          <RegisterSucceed nav={navigator}/>
        </View>
      );
    }
    if (route.id === 'CreatCompany') {
      return (
        <View style={{flex: 1}}>
          <CreatCompany nav={navigator}/>
        </View>
      );
    }
    if (route.id === 'JoinCompany') {
      return (
        <View style={{flex: 1}}>
          <JoinCompany nav={navigator}/>
        </View>
      );
    }
    if (route.id === 'SelectCompany') {
      return (
        <View style={{flex: 1}}>
          <SelectCompany nav={navigator} icon={route.icon}/>
        </View>
      );
    }
    if (route.id === 'ReportMain') {
      return (
        <View style={{flex: 1}}>
          <ReportMain nav={navigator}/>
        </View>
      );
    }
    if (route.id === 'ReportRules') {
      return (
        <View style={{flex: 1}}>
          <ReportRules nav={navigator}/>
        </View>
      );
    }
    if (route.id === 'CreatReport') {
      return (
        <View style={{flex: 1}}>
          <CreatReport nav={navigator} type={route.type} curryear={route.curryear} currmonth={route.currmonth}/>
        </View>
      );
    }
    if (route.id === 'SubmitReport') {
      return (
        <View style={{flex: 1}}>
          <SubmitReport nav={navigator} reportItems={route.reportItems} updateState={route.updateState}/>
        </View>
      );
    }
    if (route.id === 'ReportDetail') {
      return (
        <View style={{flex: 1}}>
          <ReportDetail nav={navigator} reportItem={route.reportItem}/>
        </View>
      );
    }
    if (route.id === 'ActivitiesDetail') {
      return (
        <View style={{flex: 1}}>
          <ActivitiesDetail
            nav={navigator}
            activityId={route.activityId}
            type={route.type}
            indexId={route.indexId}
            deleteactivity={route.deleteactivity}
            getIsReceipt={route.getIsReceipt}
            project={route.project}
            reloadList={route.reloadList}
            getfavorandcomNum={route.getfavorandcomNum}
            isfouces={route.isfouces}/>
        </View>
      );
    }
    if (route.id === 'VoteOrReceiptDetail') {
      return (
        <View style={{flex: 1}}>
          <VoteOrReceiptDetail nav={navigator} optionId={route.optionId} type={route.type}/>
        </View>
      );
    }
    if (route.id === 'ActivityScopesDetail') {
      return (
        <View style={{flex: 1}}>
          <ActivityScopesDetail nav={navigator} activityId={route.activityId}/>
        </View>
      );
    }
    if (route.id === 'SendActivity') {
      return (
        <View style={{flex: 1}}>
          <SendActivity nav={navigator} reloadList={route.reloadList} type={route.type} project={route.project}/>
        </View>
      );
    }
    if (route.id === 'SendVote') {
      return (
        <View style={{flex: 1}}>
          <SendVote nav={navigator} reloadList={route.reloadList} project={route.project}/>
        </View>
      );
    }
      if (route.id === 'AllActivities') {
      return (
        <View style={{flex: 1}}>
          <AllActivities nav={navigator} type={route.type}/>
        </View>
      )
    }
    if (route.id === 'SearchActivities') {
      return (
        <View style={{flex: 1}}>
          <SearchActivities nav={navigator}/>
        </View>
      )
    }
    if(route.id==='MyFavorite'){
      return (
        <View style={{flex: 1}}>
          <MyFavorite nav={navigator}/>
        </View>
      )
    }
    if(route.id==='ImagesViewer'){
      return (
        <View style={{flex: 1}}>
          <ImagesViewer nav={navigator} imageUrls={route.imageUrls} imgindex={route.imgindex}/>
        </View>
      )
    }
    if (route.id === 'UserCenterMain') {
      return (
          <View style={{flex: 1}}>
            <UserCenterMain nav={navigator} userData={route.userData}/>
          </View>
      );
    }
    if (route.id === 'UserSetting') {
      return (
        <View style={{flex: 1}}>
          <UserSetting nav={navigator} />
        </View>
      );
    }
    if (route.id === 'UserSuperior') {
      return (
          <View style={{flex: 1}}>
            <UserSuperior nav={navigator} userData={route.userData}/>
          </View>
      );
    }
    if (route.id === 'ExitCompany') {
      return (
          <View style={{flex: 1}}>
            <ExitCompany nav={navigator}/>
          </View>
      );
    }
    if(route.id==='AccountSafe'){
      return(
          <View style={{flex:1}}>
            <AccountSafe nav={navigator}/>
          </View>
      )
    }
    if(route.id==='UpdatePassword'){
      return(
          <View style={{flex:1}}>
            <UpdatePassword nav={navigator}/>
          </View>
      )
    }
    if(route.id==='UpdateUser'){
      return(
          <View style={{flex:1}}>
            <UpdateUser nav={navigator} userData={route.userData}/>
          </View>
      )
    }
    if (route.id === 'UserInfo') {
      return (
          <View style={{flex: 1}}>
            <UserInfo nav={navigator} userData={route.userData}/>
          </View>
      );
    }
    if (route.id === 'SelectorMain') {
      return (
        <View style={{flex: 1}}>
          <SelectorMain nav={navigator} selectorConfig={route.selectorConfig}/>
        </View>
      );
    }
    if (route.id === 'ReceiveReport') {
      return (
        <View style={{flex: 1}}>
          <ReceiveReport nav={navigator} type={route.type}/>
        </View>
      );
    }
    if (route.id === 'UncommittedReport') {
      return (
        <View style={{flex: 1}}>
          <UncommittedReport nav={navigator}/>
        </View>
      );
    }
    if (route.id === 'SubordinateReport') {
      return (
        <View style={{flex: 1}}>
          <SubordinateReport nav={navigator} type={route.type} userid={route.userid} username={route.username}/>
        </View>
      );
    }
    if (route.id === 'AddressBook') {
      return (
          <View style={{flex: 1}}>
            <AddressBook nav={navigator}/>
          </View>
      );
    }
    if (route.id === 'SearchAddress') {
      return (
        <View style={{flex: 1}}>
          <SearchAddress nav={navigator}/>
        </View>
      );
    }
    if (route.id === 'ExportAddress') {
      return (
        <View style={{flex: 1}}>
          <ExportAddress nav={navigator}/>
        </View>
      );
    }
    if (route.id === 'AddressInfo') {
      return (
        <View style={{flex: 1}}>
          <AddressInfo nav={navigator} Id={route.Id}/>
        </View>
      );
    }

    if(route.id==='KbMain'){
      return(
        <View style={{flex:1}}>
          <KbMain
            nav={navigator}
            kbName={route.kbName}
            kbId={route.kbId}
            managePermission={route.managePermission}
            project={route.project}/>
        </View>
      )
    }
    if(route.id==='SearchKb'){
      return(
        <View style={{flex:1}}>
          <SearchKb nav={navigator} kbId={route.kbId} projectId={route.projectId}/>
        </View>
      )
    }
    if(route.id==='KbFileDetail'){
      return(
        <View style={{flex:1}}>
          <KbFileDetail nav={navigator}
            kbName={route.kbName}
            fileType={route.fileType}
            kbId={route.kbId}
            managePermission={route.managePermission}
            updateFile={route.updateFile}
            updateFileName={route.updateFileName}
            removeFile={route.removeFile}
            lockFile={route.lockFile}
            menuText={route.menuText}
            project={route.project}/>
        </View>
      )
    }
    if(route.id==='KbArticleDetail'){
      return(
        <View style={{flex:1}}>
          <KbArticleDetail nav={navigator}
                        kbName={route.kbName}
                        fileType={route.fileType}
                        kbId={route.kbId}
                        updateFile={route.updateFile}
                        managePermission={route.managePermission}
                        updateFileName={route.updateFileName}
                        removeFile={route.removeFile}
                        lockFile={route.lockFile}
                        menuText={route.menuText}/>
        </View>
      )
    }
    if(route.id==='FileSelector'){
      return (
        <View style={{flex: 1}}>
          <FileSelector
            nav={navigator}
            path={route.path}
            fileName={route.fileName}
            navTil={route.navTil}
            getSelFile={route.getSelFile}
            fileSize={route.fileSize}/>
        </View>
      )
    }
    if(route.id==='AttendanceMain'){
      return (
        <View style={{flex: 1}}>
          <AttendanceMain nav={navigator} type={route.type}/>
        </View>
      )
    }
     if(route.id==='MyPunchCard'){
      return(
      <View style={{flex: 1}}>
        <MyPunchCard nav={navigator}/>
      </View>
      )
    }
    if(route.id==='PhotoSelector'){
      return (
        <View style={{flex: 1}}>
          <PhotoSelector nav={navigator} num={route.num}  getSelImg={route.getSelImg} />
        </View>
      )
    }
    if(route.id==='CommentList'){
      return(
        <View style={{flex:1}}>
         <CommentList nav={navigator} attachmentId={route.attachmentId} creatorUser={route.creatorUser} />
        </View>
      )
    }

    if(route.id==='TaskMain'){
      return(
        <View style={{flex: 1}}>
          <TaskMain nav={navigator} reloadNum={route.reloadNum} type={route.type}/>
        </View>
      )
    }
    if(route.id==='SearchTask'){
      return(
        <View style={{flex:1}}>
          <SearchTask nav={navigator}/>
        </View>
      )
    }
    if (route.id === 'SearchResults') {
      return (
        <View style={{flex: 1}}>
          <SearchResults nav={navigator} conditions={route.conditions}/>
        </View>
      )
    }
    if(route.id==='CreatTask'){
      return(
        <View style={{flex:1}}>
          <CreatTask
            nav={navigator}
            reloadList={route.reloadList}
            isChild={route.isChild}
            getTaskData={route.getTaskData}
            parentId={route.parentId}
            copyTaskData={route.copyTaskData}
            stages={route.stages}
            currStage={route.currStage}
            project={route.project}/>
        </View>
      )
    }
    if(route.id==='TaskDetail'){
      return(
        <View style={{flex:1}}>
          <TaskDetail
            nav={navigator}
            taskId={route.taskId}
            oldTaskId={route.oldTaskId}
            newTask={route.newTask}
            isChild={route.isChild}
            stages={route.stages}
            project={route.project}
            reloadZiTask={route.reloadZiTask}
            reloadLists={route.reloadLists}
            type={route.type}
            reloadNum={route.reloadNum}/>
        </View>
      )
    }
    if(route.id==='TaskCommentLists'){
      return(
        <View style={{flex:1}}>
          <TaskCommentLists nav={navigator} taskId={route.taskId} creatorUser={route.creatorUser} />
        </View>
      )
    }
    if(route.id==='TaskLogLists'){
      return(
        <View style={{flex:1}}>
          <TaskLogLists nav={navigator} taskId={route.taskId} />
        </View>
      )
    }
    if(route.id==='ProjectMain'){
      return(
        <View style={{flex:1}}>
          <ProjectMain nav={navigator}/>
        </View>
      )
    }
    if(route.id==='SearchProjects'){
      return(
        <View style={{flex:1}}>
          <SearchProjects nav={navigator}/>
        </View>
      )
    }
    if(route.id==='CreatProject'){
      return(
        <View style={{flex:1}}>
          <CreatProject
            nav={navigator}
            reloadList={route.reloadList}
            />
        </View>
      )
    }
    if(route.id==='ProjectTabView'){
      return(
        <View style={{flex:1}}>
          <ProjectTabView
            nav={navigator}
            projectId={route.projectId}
            projectName={route.projectName}
            reloadData={route.reloadData}
            type={route.type}
            />
        </View>
      )
    }
    if(route.id==='ProStageSetting'){
      return(
        <View style={{flex:1}}>
          <ProStageSetting
            nav={navigator}
            project={route.project}
            reloadData={route.reloadData}
            />
        </View>
      )
    }
    if(route.id==='NoticeList'){
      return(
        <View style={{flex:1}}>
          <NoticeList nav={navigator} reloadBadge={route.reloadBadge}/>
        </View>
      )
    }

  },
  render: function () {

    return (
      <Navigator
        ref="navigator"
        initialRoute={{id: 'Loading'}}
        configureScene={() => Navigator.SceneConfigs.FadeAndroid}
        renderScene={this.renderScene}
        />
    );

  },
  onReceiveMessage(message) {
   debugger;
  },
  isConnected(isConn){
    if(isConn=="NONE"){
      Alert.alert(
        '警告',
        `当前设备处于无网络状态\n请连接网络后继续使用。`,
        [
          {text: '确定'}
        ]
      )
    }
  },
  onOpenMessage(message) {
    let msgType=message._data["cn.jpush.android.EXTRA"];
    let noticeType=Object.getOwnPropertyNames(JSON.parse(msgType));
    let id=JSON.parse(msgType)[noticeType];
    debugger;
    api.Util.checkLoginState()
      .then((resData)=>{
        if(resData.Type==1) {
          //正常登录
          let tempIds=_.pluck(_navigator.getCurrentRoutes(),'id');
          let _index=0;
         switch(noticeType[0]){
            case "NewTaskPartner":
            case "NewTaskDirector":
            case "NewTaskAuditor":
            case "NewTaskOnlooker":
            case "TaskAttrbuteUpdate":
              _index = tempIds.indexOf("TaskDetail");
              if (_index != -1) {
                this.refs.navigator.replaceAtIndex({
                  id: 'TaskDetail',
                  taskId:id,
                  isChild:false,
                  type:'notice'
                }, _index);
              }
              else {
                this.refs.navigator.push({
                  id: 'TaskDetail',
                  taskId:id,
                  isChild:false,
                  type:'notice'
                });
              }
              break;
            case "NewReceipt":
              _index = tempIds.indexOf("ActivitiesDetail");
              if (_index != -1) {
                this.refs.navigator.replaceAtIndex({
                  id: 'ActivitiesDetail',
                  activityId: id,
                  type:'notice'
                }, _index);
              }
              else {
                this.refs.navigator.push({
                  id: 'ActivitiesDetail',
                  activityId: id,
                  type:'notice'
                });
              }
              break;
            case "NewProject":
              //项目详情
              api.Project.projectDetail(id)
                .then((res)=>{
                  if(res.Type==1){
                    _index = tempIds.indexOf("ProjectTabView");
                    if (_index != -1) {
                      this.refs.navigator.replaceAtIndex({
                        id: 'ProjectTabView',
                        projectId:id,
                        projectName:res.Data.Name,
                        type:'notice'
                      }, _index);
                    }
                    else {
                      this.refs.navigator.push({
                        id: 'ProjectTabView',
                        projectId:id,
                        projectName:res.Data.Name,
                        type:'notice'
                      });
                    }
                  }
                });
              break;
            case "DailyReminder":
            case "WeeklyReminder":
            case "MonthlyReminder":
              _index = tempIds.indexOf("CreatReport");
              if (_index != -1) {
                this.refs.navigator.replaceAtIndex({
                  id: 'CreatReport'
                }, _index);
              }
              else {
                this.refs.navigator.push({
                  id: 'CreatReport'
                });
              }
              break;
            case "NewReport":
              _index = tempIds.indexOf("ReceiveReport");
              if (_index != -1) {
                this.refs.navigator.replaceAtIndex({
                  id: 'ReceiveReport'
                }, _index);
              }
              else {
                this.refs.navigator.push({
                  id: 'ReceiveReport'
                });
              }
              break;
            case "AttendanceReminder":
              _index = tempIds.indexOf("AttendanceMain");
              if (_index != -1) {
                this.refs.navigator.replaceAtIndex({
                  id: 'AttendanceMain'
                }, _index);
              }
              else {
                this.refs.navigator.push({
                  id: 'AttendanceMain'
                });
              }
              break;
            default:
              /**
               * Object.getOwnPropertyNames排序是把'NewReport'放在了第二位
               * 正常的是最后一个元素
               */
              // _index = tempIds.indexOf("ReceiveReport");
              // if (_index != -1) {
              //   this.refs.navigator.replaceAtIndex({
              //     id: 'ReceiveReport'
              //   }, _index);
              // }
              // else {
              //   this.refs.navigator.push({
              //     id: 'ReceiveReport'
              //   });
              // }
              break;
          }
        }
        else{
          //用户未登录
          let tempId=_.pluck(_navigator.getCurrentRoutes(),'id');
          let index=tempId.indexOf("Login");
          if(index!=-1){
            this.refs.navigator.replaceAtIndex({
              id:'Login'}, index);
          }
          else{
            this.refs.navigator.push({id:'Login'});
          }
        }
      })
  }
});


module.exports = Routers;