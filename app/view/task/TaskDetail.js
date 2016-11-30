/**
 * Created by wangshuo
 */
'use strict';
import React, {Component} from 'react'
import {
  Image,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ToastAndroid,
  ListView,
  TextInput,
  Modal,
  InteractionManager,
  ActivityIndicator,
  Alert,
  Animated,
  Keyboard,
  ScrollView,
  DatePickerAndroid,
  Linking,
  BackAndroid,
  Dimensions
  } from 'react-native';
import styles from "./style";
import kstyles from '../kb/style'
import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons'
import Icons from 'react-native-vector-icons/FontAwesome';
import NavLeftView from '../common/NavLeftView'
var {height, width} = Dimensions.get('window');
import api from "../../network/ApiHelper";
var BusyIndicator = require('react-native-busy-indicator');
var loaderHandler = require('react-native-busy-indicator/LoaderHandler');

import _ from 'lodash'
import {formatter} from '../../tools/DateHelper'
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Comment from '../common/Comment.js';
import CommentInput from '../common/CommentInput.js'
import Log from './TaskLogs';
let _this;
let that;
let tabThis;
let userData=[];//用来判断身份是否重复的数组
let buttons = ['复制任务'];
var commentTemp = [];
var twocomCofs = [];
var commentIndex = -1;
import ActionSheet from 'react-native-actionsheet';
const Actbuttons = ['取消', '回复', '删除'];
const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 1;
let commCounts=0;
var ActionSheets;
import {downLoadFiles} from '../common/DownLoadFile.js'
import InputScrollView from 'react-native-inputscrollview';
class TaskMenuView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openView: false,
      buttons:['复制任务']
    }
  }
  open() {
    this.state.buttons=['复制任务'];
    let item=_this.state;
    if(item.projectName!=""){
      this.state.buttons.push('前往项目')
    }
    if(item.Task_Start){
      //已完成的任务
      if(item.Status==5||item.Status==7)
        this.state.buttons.push('重开任务')
    }
    if(item.Task_Submit||item.Task_Finish){
      if(item.Status==4&&item.Task_Finish){
        this.state.buttons.push('通过审核')
      }
      if(item.Status<4&&(item.Task_Submit||item.Task_Finish)){
        this.state.buttons.push('完成任务')
      }
    }
    if(item.Task_Recycle){
      this.state.buttons.push('删除任务')
    }
    if(item.Task_Quit){
      this.state.buttons.push('退出任务')
    }
    this.setState({openView: !this.state.openView,buttons:this.state.buttons})
  }
  componentDidMount() {
    // Task_Update 更新任务
    // Task_Start  重开
    // Task_Submit 完成
    // Task_Finish 完成(二者满足一个即可显示)
    // Task_Recycle 删除
    // Task_Quit 退出
  }
  getMenu(index) {
    this.setState({openView: !this.state.openView});
    let menuName=this.state.buttons[index];
    switch(menuName){
      case "前往项目":
        let name=_this.state.projectName;
        this.props.nav.push({
          id: 'ProjectTabView',
          projectId:_this.state.projectId,
          projectName:name.substring(3,name.length)
        });
        break;
      case "复制任务":
        this.copyTask();
        break;
      case "重开任务":
        this.restartTask();
        break;
      case "通过审核":
      case "完成任务":
        this.finishTask();
        break;
      case "删除任务":
        Alert.alert(
          '提示',
          '确定删除该任务？',
          [
            {text: '取消'},
            {
              text: '确定', onPress: () => {
              this.deleteTask();
            }
            }
          ]
        );
        break;
      case "退出任务":
        this.quitTask();
        break;
    }
  }
  quitTask(){
    loaderHandler.showLoader("请稍等。。。");
    api.Task.quitTask(_this.state.Id)
      .then((res)=>{
        if(res.Type==1){
          setTimeout(()=>{
            ToastAndroid.show("退出成功",{position: 100});
            if(!_this.props.isChild){
              if(_this.props.type==null&&_this.props.type!="notice") {
                _this.props.reloadLists();
              }
            }
            if(_this.props.reloadZiTask&&_this.props.isChild){
              _this.props.reloadZiTask(_this.state.Id,"quit");
            }
            loaderHandler.hideLoader();
            if(_this.props.isChild){
              _this.props.nav.pop();
              _this.props.nav.replace({id:'TaskDetail',taskId:_this.props.oldTaskId,isChild:false})
            }else{
              _this.props.nav.pop();
            }

          },1000);
        }else{
          loaderHandler.hideLoader();
          ToastAndroid.show(res.Data,ToastAndroid.SHORT);
        }
      })
  }
  deleteTask(){
    loaderHandler.showLoader("请稍等。。。");
    api.Task.recycleTask(_this.state.Id)
      .then((res)=>{
        if(res.Type==1){
          setTimeout(()=>{
            ToastAndroid.show("删除成功",ToastAndroid.SHORT);
            if(!_this.props.isChild){
              if(_this.props.type==null&&_this.props.type!="notice") {
                _this.props.reloadLists();
              }
            }
            if(_this.props.reloadZiTask&&_this.props.isChild){
              _this.props.reloadZiTask(_this.state.Id,"delete");
            }
            loaderHandler.hideLoader();
            if(_this.props.isChild){
              _this.props.nav.pop();
              _this.props.nav.replace({id:'TaskDetail',taskId:_this.props.oldTaskId,isChild:false})
            }else{
              _this.props.nav.pop();
            }
          },1000);
        }else{
          loaderHandler.hideLoader();
          ToastAndroid.show(res.Data,ToastAndroid.SHORT);
        }
      })
  }
  finishTask(){
    loaderHandler.showLoader("请稍等。。。");
    api.Task.finishTask(_this.state.Id)
      .then((res)=>{
        if(res.Type==1){
          setTimeout(()=>{
            if(!_this.props.isChild){
              if(_this.props.type==null&&_this.props.type!="notice") {
                _this.props.reloadLists();
              }
            }
            if(_this.props.reloadZiTask&&_this.props.isChild){
              _this.props.reloadZiTask(_this.state.Id,"finish",res.Data);
            }
            loaderHandler.hideLoader();
            if(_this.props.isChild){
              _this.props.nav.pop();
              _this.props.nav.replace({id:'TaskDetail',taskId:_this.props.oldTaskId,isChild:false})
            }else{
              _this.props.nav.pop();
            }
          },1000);
        }else{
          loaderHandler.hideLoader();
          ToastAndroid.show(res.Data,ToastAndroid.SHORT);
        }
      })
  }
  refreshList(){
    //刷新列表
    if(_this.props.type&&_this.props.type!="notice"){
      setTimeout(()=>{_this.props.reloadLists();},1000);
    }
  }
  restartTask(){
    loaderHandler.showLoader("请稍等。。。");
    api.Task.restartTask(_this.state.Id)
      .then((res)=>{
        if(res.Type==1){
          setTimeout(()=>{
            if(!_this.props.isChild){
              _this.props.reloadLists();
            }
            if(_this.props.reloadZiTask&&_this.props.isChild){
              _this.props.reloadZiTask(_this.state.Id,"restart");
            }
            loaderHandler.hideLoader();
            if(_this.props.isChild){
              _this.props.nav.pop();
              _this.props.nav.replace({id:'TaskDetail',taskId:_this.props.oldTaskId,isChild:false})
            }else{
              _this.props.nav.pop();
            }
          },1000);
        }else{
          loaderHandler.hideLoader();
          ToastAndroid.show(res.Data,ToastAndroid.SHORT);
        }
      })
  }
  copyTask(){
    let copyTaskData={
      taskTitle:_this.state.taskTitle,
      taskDescribe:_this.state.taskDescribe,
    };
    this.props.nav.push({
      id:'CreatTask',
      isChild:false,
      project:_this.props.project&&_this.props.project,
      stages:_this.props.stages&&_this.props.stages,
      reloadList:this.refreshList.bind(this),
      copyTaskData:copyTaskData
    });
  }
  render() {
    return (
      this.state.openView ?
        <View style={styles.openViewView}>
          <TouchableOpacity style={styles.openViewTou} onPress={()=> {
            this.setState({openView: false})
          }}>
            <View style={styles.openUpView}>
              <View style={styles.openViewsView}>
                <View>
                  {
                    this.state.buttons && this.state.buttons.map((item, index)=> {
                      return (
                        <TouchableOpacity key={index} onPress={this.getMenu.bind(this, index)}>
                          <View
                            style={index == this.state.buttons.length - 1 ? [styles.modalTextView, {borderBottomWidth: 0}] : styles.modalTextView}>
                            <Text style={styles.modalText}>{item}</Text>
                          </View>
                        </TouchableOpacity>
                      )
                    })
                  }
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View> : null
    )
  }
;
}
class BottomView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasTFocus:false,
      layout:0,
      keyboardSpace:0
    };
    that=this;
  }
  hasFocus(ishave){
    if(ishave){
      this.setState({hasTFocus:true});
    }else{
      this.setState({hasTFocus:false});
    }
  }
  render() {
    return (
      <View style={[styles.Fstyle,{top:!this.state.hasTFocus?height-(41+30):height-(55+this.state.layout)}]}>
        <CommentInput ref="commentInput" styleType={1}
                      type="task"
                      haveFocus={this.hasFocus.bind(this)}
                      newcommentItem={_this&&_this.newcomItem.bind(_this)}
                      commentConfig={this.props.commentConfig}/>
      </View>
    )
  }
;
}
class TabView extends Component {
  constructor(props) {
    super(props);
    this.state = {
     hasComments:true,
     hasLogs:false
    };
    tabThis=this;
  }

  componentDidMount() {
   
  }
  hasComments(){
    this.setState({
      hasComments:true,
      hasLogs:false
    })
  }
  hasLogs(){
    this.setState({
      hasComments:false,
      hasLogs:true
    })
  }
  render() {
    return (
     <View>
          <View style={{flexDirection:'row'}}>
          <TouchableOpacity style={{flex:1}} onPress={this.hasComments.bind(this)}>
            <View style={[styles.tabSty,{borderBottomColor:this.state.hasComments?'#3A82E1':'transparent'}]}>
              <Text style={[styles.Title,{color:this.state.hasComments?'#3A82E1':'#000000'}]}>
                {"回复·"+_this.state.commentsCount.toString()}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{flex:1}} onPress={this.hasLogs.bind(this)}>
            <View style={[styles.tabSty,{borderBottomColor:this.state.hasLogs?'#3A82E1':'transparent'}]}>
              <Text style={[styles.Title,{color:this.state.hasLogs?'#3A82E1':'#000000'}]}>
                {"任务日志·"+_this.state.logsCount.toString()}
              </Text>
            </View>
          </TouchableOpacity>
          </View>
            
        {
          this.state.hasComments?
          <View style={styles.commViewCon}>
          <Comment ref='commentList'
                  style={[kstyles.commentView,{marginTop:10}]}
                  nav={this.props.nav}
                  comBody={kstyles.comBody}
                  comParBody={kstyles.comParBody}
                  commView={kstyles.commView}
                  deleteback={_this.deleteComment.bind(_this)}
                  commentList={_this.state.comments}
                  commentConfig={_this.state.commentConfig}
                  commcallback={_this.commentsNum.bind(_this)}
                  twoComment={_this.startTwoComment.bind(_this)}
                  type="task"/>
          {
                _this.state.comments && _this.state.comments.length >= 10?
                  <View style={styles.moreComView}>
                    <TouchableOpacity style={styles.favorIconView}
                                      onPress={_this.moreComment.bind(_this)}>
                      <Text style={{fontSize: 14, color: '#565656'}}>点击查看更多评论 </Text>
                      <Icons
                        name="angle-double-down"
                        size={20}
                        color="#565656"
                      />
                    </TouchableOpacity>
                  </View> : null
          }
          </View>
          :<Comment ref='commentList'
                  style={{height:0}}
                  nav={this.props.nav}
                  noView={true}
                  comBody={kstyles.comBody}
                  comParBody={kstyles.comParBody}
                  commView={kstyles.commView}
                  deleteback={_this.deleteComment.bind(_this)}
                  commentList={_this.state.comments}
                  commentConfig={_this.state.commentConfig}
                  commcallback={_this.commentsNum.bind(_this)}
                  twoComment={_this.startTwoComment.bind(_this)}
                  type="task"/>
        }
      
        {
            this.state.hasLogs?
              <View style={styles.commViewCon}>
              <Log
              style={styles.commentView}
              nav={_this.props.nav}
              comBody={styles.comBody}
              comParBody={styles.comParBody}
              commView={styles.commView}
              logsList={_this.state.logs}
              />
                {
                  _this.state.logs && _this.state.logs.length >= 10?
                    <View style={styles.moreComView}>
                      <TouchableOpacity style={styles.favorIconView}
                                        onPress={_this.moreLog.bind(this)}>
                        <Text style={{fontSize: 14, color: '#565656'}}>点击查看更多日志 </Text>
                        <Icons
                          name="angle-double-down"
                          size={20}
                          color="#565656"
                        />
                      </TouchableOpacity>
                    </View> : null
                } 
                </View>:null
        }
     </View>
    )
  }
;
}
export default class TaskDetail extends Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {
      Id:0,
      taskTitle:"",
      projectName:"",
      projectId:0,
      UserCreatedInfo:"",
      taskDescribe:"",
      ChildCount:0,
      files:[],
      visiable:false,
      startData:"",
      endData:"",
      Status:0,
      Charger:[],//负责人
      Members:[],//任务成员
      Spectators:[],//旁观者
      Audit:[],//审核人
      planHours:0,//计划工时
      surplusHours:0,//剩余工时
      ExpandProperties:[],//拓展属性
      ishaveExpand:false,//是否获取到拓展属性
      taskData:[],
      Children:[],//子任务
      fetchSuccess: false,
      commentConfig: [],
      comments:[],
      commentsCount:0,
      logs:[],
      logsCount:0,
      taskCreator:[],
      Task_Update: false,
      Task_Start: false,
      Task_Submit: false,
      Task_Finish: false,
      Task_Recycle: false,
      Task_Quit: false,
      isEdit:false,
      newFiles:[],
      Stage:"",
      FILES:[],
      displayCom:true,
      layout:0,
      hasTFocus:false,
      tabHeight:50,
      commentHeight:0,
      logHeight:0,
      viewMarginTop: new Animated.Value(0),
      keyboardHeight:0,
      hasComments:true,
      hasLogs:false
    };
    _this=this;
    this._onBackAndroid=this.onBackAndroid.bind(this);
  };
  componentDidMount() {
    userData=[];
    buttons = ['复制任务'];
    loaderHandler.showLoader("请稍等。。。");
    if(this.props.newTask){
      //刷新列表并且改变导航栏的数字
      if(this.props.type==null&&this.props.type!="notice"){
        setTimeout(()=>{this.props.reloadLists();this.props.reloadNum&&this.props.reloadNum();},1000);
      }
    }
    this.getData();
    BackAndroid.addEventListener('hardwareBackPress', this._onBackAndroid);
  }
  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this._onBackAndroid);
  }
  onBackAndroid(){
    var routes= _.pluck(this.props.nav.getCurrentRoutes(), "id");
    var nary=routes.sort();
    let flag=false;
    for(var i=0;i<routes.length;i++){
      if (nary[i]==nary[i+1]){
        flag=true;
      }
    }
    if(flag){
      //有重复的路由(有子任务)
      if(this.props.isChild&&this.props.oldTaskId!=null){
        this.props.nav.pop();
        this.props.nav.replace({id:'TaskDetail',taskId:this.props.oldTaskId,isChild:false})
      }
    }else{
      this.props.nav.pop();
    }
  }
  getData(){
    loaderHandler.showLoader("请稍等。。。");
    api.Task.taskDetail(this.props.taskId)
      .then((res)=>{
        this.setState({fetchSuccess: true});
        loaderHandler.hideLoader();
        if(res.Type==1){
          var commentConfig = {
            creatActivityUser: res.Data.UserCreated,
            activityId: res.Data.Id,
            TenantType: "Task",
            autoFocus: false
          };
          that.refs.commentInput.startIn(commentConfig, 1);
          this.setState({
            Status:res.Data.Status,
            Task_Update: res.Data.Task_Update,
            Task_Start: res.Data.Task_Start,
            Task_Submit: res.Data.Task_Submit,
            Task_Finish: res.Data.Task_Finish,
            Task_Recycle: res.Data.Task_Recycle,
            Task_Quit: res.Data.Task_Quit,
            UserCreatedInfo:res.Data.UserCreatedInfo,
            taskCreator:res.Data.UserCreated,
            projectName:res.Data.ProjectName,
            projectId:res.Data.ProjectId,
            Id:res.Data.Id,
            Stage:res.Data.Stage,
            taskTitle:res.Data.Title,
            taskDescribe:res.Data.Description,
            files:res.Data.Attachments==null?[]:res.Data.Attachments,
            FILES:res.Data.Attachments==null?[]:res.Data.Attachments,
            startData:res.Data.DateToStart,
            endData:res.Data.DateToFinish,
            Charger:res.Data.UserIncharge==null?[]:res.Data.UserIncharge,//负责人
            Members:res.Data.Partner==null?[]:res.Data.Partner,//任务成员
            Spectators:res.Data.Onlooker==null?[]:res.Data.Onlooker,//旁观者
            Audit:res.Data.UserAudit==null?[]:res.Data.UserAudit,//审核人
            planHours:res.Data.HoursExpected,//计划工时
            surplusHours:res.Data.HoursRemaining,//剩余工时
            ExpandProperties:res.Data.ExtendedProperties==null?[]:res.Data.ExtendedProperties,//拓展属性
            Children:res.Data.Children,
            ChildCount:res.Data.ChildCount,
            comments:res.Data.Comments==null?[]:res.Data.Comments,
            commentsCount:res.Data.CommentCount,
            logs:res.Data.Logs==null?[]:res.Data.Logs,
            logsCount:res.Data.LogCount,
            commentConfig: commentConfig,
          });
          //任务成员和旁观者是多选的需要concat
          if(res.Data.UserIncharge!=null){
            userData.push(res.Data.UserIncharge);
          }
          if(res.Data.Partner!=null&&res.Data.Partner.length!=0){
            userData = userData.concat(res.Data.Partner);
          }
          if(res.Data.Onlooker!=null&&res.Data.Onlooker.length!=0){
            userData = userData.concat(res.Data.Onlooker);
          }
          if(res.Data.UserAudit!=null){
            userData.push(res.Data.UserAudit);
          }
        }else{
          this.setState({fetchSuccess: false});
        }
      })
  }
  getFiles(file){
    var fileData = _.pluck(this.state.files, "name");
    let fileIndex=fileData.indexOf(file.name,fileData);
    if(fileIndex==-1){
      let fileItem={
        Name:file.name,
        DownloadUrl:file.path
      };
      this.state.newFiles.push(fileItem);
      let FilesArr = this.state.files.concat(this.state.newFiles);//把原有的和新上传的合成新数组
      this.setState({
        isEdit:true,
        FILES:FilesArr
      })
    }else{
      ToastAndroid.show("已选择该文件,请勿重复选择",ToastAndroid.SHORT)
    }
  }
  addFiles(){
    this.props.nav.push({
        id: 'FileSelector',
        getSelFile: (item)=> {
          this.getFiles(item)
        }
      }
    );
  }
  removeFile(index,name){
    Alert.alert(
      '提示',
      '确定删除该附件？',
      [
        {text: '取消'},
        {
          text: '确定', onPress: () => {
          if(this.state.files.length!=0){
            let oldnames=_.pluck(this.state.files, "Name");
            let index=oldnames.indexOf(name);
            if(index!=-1){
              this.state.files.splice(index, 1);
            }
          }else{
            let newnames=_.pluck(this.state.newFiles, "Name");
            let newIndex=newnames.indexOf(name);
            if(newIndex!=-1){
              this.state.newFiles.splice(index, 1);
            }
          }
          this.state.FILES.splice(index, 1);
          this.setState({
            isEdit:true,
            FILES:this.state.FILES
          })
        }
        }
      ]
    );
  }
  startDatePicker() {
    let today = new Date(this.state.startData);
    let theMaxDate = new Date(2025, 1, 1);
    let option = {
      date: today
    };
    DatePickerAndroid.open(option).then(
        result => {
        if (result.action !== DatePickerAndroid.dismissedAction) {
          let date = new Date(result.year, result.month, result.day);
          this.setState({
            isEdit:true,
            startData:formatter('yyyy-MM-dd',date)
          });
        }
      }
    ).catch(
        error => {
        ToastAndroid.show("出错了",ToastAndroid.SHORT);
      }
    );

  };
  endDatePicker() {
    let today = new Date(this.state.endData);
    let theMaxDate = new Date(2025, 1, 1);
    let option = {
      date: today
    };
    DatePickerAndroid.open(option).then(
        result => {
        if (result.action !== DatePickerAndroid.dismissedAction) {
          let date = new Date(result.year, result.month, result.day);
          if(date<new Date(this.state.startData)){
            ToastAndroid.show("结束时间不能小于开始时间",ToastAndroid.SHORT)
          }else{
            this.setState({isEdit:true,endData:formatter('yyyy-MM-dd',date)});
          }
        }
      }
    ).catch(
        error => {
        ToastAndroid.show("出错了",ToastAndroid.SHORT);
      }
    );

  };
  unique(arr) {
    // 数组去重,然后保留一个
    var tmp = new Array();
    for (var i in arr) {
      if (tmp.indexOf(arr[i]) == -1) {
        tmp.push(arr[i]);
      }
    }
    return tmp;
  }
  //添加负责人(单选)
  addCharge() {
    var selectorConfig = {
      selectorType: 0,
      selectorRadio: 0,
      getselectorItem: this.getCharge.bind(this)
    };
    this.props.nav.push({
      id: 'SelectorMain',
      selectorConfig: selectorConfig
    });

  }
  getCharge(selectedItem) {
    if (selectedItem != "") {
      let Charge=selectedItem[0];
      let flag=false;
      if(userData.length!=0){
        var ids = _.pluck(userData, "Id");
        let index=ids.indexOf(Charge.Id);
        if(index!=-1){
          //有重复的元素
          ToastAndroid.show("同一用户只能在任务中担任一种角色",ToastAndroid.SHORT);
          flag=true;
          return;
        }
        if(!flag){
          let oldIndex=ids.indexOf(this.state.Charger.Id);
          if(oldIndex!=-1){
            ids.splice(oldIndex,1);
            userData.splice(oldIndex, 1);
            userData.push(Charge);
          }else{
            userData.push(Charge);
          }
          this.setState({isEdit:true,Charger:Charge})
        }
      }else{
        userData.push(Charge);
        this.setState({Charger:Charge})
      }
    }
  }
  //添加任务成员(多选)
  addMembers() {
    var selectorConfig = {
      selectorType: 0,
      selectorRadio: 1,
      getselectorItem: this.getMembers.bind(this)
    };
    this.props.nav.push({
      id: 'SelectorMain',
      selectorConfig: selectorConfig
    });
  }
  getMembers(selectedItem) {
    var ids = _.pluck(userData, "Id");
    for(var o=0;o<this.state.Members.length;o++){
      let oldIndex=ids.indexOf(this.state.Members[o].Id);
      ids.splice(oldIndex,1);
      userData.splice(oldIndex, 1);
    }
    if (selectedItem != "") {
      let flag=false;
      if(userData.length!=0){
        var a = userData;
        var b = selectedItem;
        var result = [];
        for(var i = 0; i < b.length; i ++) {
          var temp = b[i];
          for(var j = 0; j < a.length; j ++) {
            if(temp.Id === a[j].Id) {
              result.push(temp);
              break;
            }
          }
        }//取a和b的交集
        if(result.length!=0){
          ToastAndroid.show("同一用户只能在任务中担任一种角色",ToastAndroid.SHORT);
          var temp=[];
          for(var i=0; i < b.length; i++){
            var flag = true;
            for(var j=0; j < result.length; j++){
              if(b[i] == result[j])
                flag = false;
            }
            if(flag)
              temp.push(b[i]);
          }//取result和数组的b的差集
          userData = userData.concat(temp);
          this.setState({isEdit:true,Members:temp});
        }else{
          userData = userData.concat(b);
          this.setState({isEdit:true,Members:b});
        }
      }else{
        userData = userData.concat(selectedItem);
        this.setState({Members:selectedItem})
      }
    }
  }
  //添加旁观者(多选)
  addSpectators() {
    var selectorConfig = {
      selectorType: 0,
      selectorRadio: 1,
      getselectorItem: this.getSpectators.bind(this)
    };
    this.props.nav.push({
      id: 'SelectorMain',
      selectorConfig: selectorConfig
    });
  }
  getSpectators(selectedItem) {
    //先把已经有的移除掉
    var ids = _.pluck(userData, "Id");
    for(var o=0;o<this.state.Spectators.length;o++){
      let oldIndex=ids.indexOf(this.state.Spectators[o].Id);
      ids.splice(oldIndex,1);
      userData.splice(oldIndex, 1);
    }
    //进行判重
    if (selectedItem != "") {
      let flag=false;
      if(userData.length!=0){
        var a = userData;
        var b = selectedItem;
        var result = [];
        for(var i = 0; i < b.length; i ++) {
          var temp = b[i];
          for(var j = 0; j < a.length; j ++) {
            if(temp.Id === a[j].Id) {
              result.push(temp);
              break;
            }
          }
        }//取a和b的交集
        if(result.length!=0){
          ToastAndroid.show("同一用户只能在任务中担任一种角色",ToastAndroid.SHORT);
          var temp=[];
          for(var i=0; i < b.length; i++){
            var flag = true;
            for(var j=0; j < result.length; j++){
              if(b[i] == result[j])
                flag = false;
            }
            if(flag)
              temp.push(b[i]);
          }//取result和数组的b的差集
          userData = userData.concat(temp);
          this.setState({isEdit:true,Spectators:temp});
        }else{
          userData = userData.concat(b);
          this.setState({isEdit:true,Spectators:b});
        }
      }else{
        userData = userData.concat(selectedItem);
        this.setState({Spectators:selectedItem})
      }
    }
  }
  //添加审核人(单选)
  addAudit() {
    var selectorConfig = {
      selectorType: 0,
      selectorRadio: 0,
      getselectorItem: this.getAudit.bind(this)
    };
    this.props.nav.push({
      id: 'SelectorMain',
      selectorConfig: selectorConfig
    });

  }
  getAudit(selectedItem) {
    if (selectedItem != "") {
      let Audit=selectedItem[0];
      let flag=false;
      if(userData.length!=0){
        var ids = _.pluck(userData, "Id");
        let index=ids.indexOf(Audit.Id);
        if(index!=-1){
          //有重复的元素
          ToastAndroid.show("人员身份冲突",ToastAndroid.SHORT);
          flag=true;
          return;
        }
        if(!flag){
          let oldIndex=ids.indexOf(this.state.Audit.Id);
          if(oldIndex!=-1){
            ids.splice(oldIndex,1);
            userData.splice(oldIndex, 1);
            userData.push(Audit);
          }else{
            userData.push(Audit);
          }
          this.setState({isEdit:true,Audit:Audit})
        }
      }else{
        userData.push(Audit);
        this.setState({Audit:Audit})
      }
    }
  }
  creatTask(){
    if (this.state.taskTitle && this.state.taskTitle.length > 32) {
      ToastAndroid.show("任务标题最多不能超过32个字符",ToastAndroid.SHORT);
      return;
    }
    this.state.taskTitle = this.state.taskTitle.trim();
    if (this.state.taskTitle.length == 0) {
      ToastAndroid.show("任务标题中不能为空",ToastAndroid.SHORT);
      return;
    }
    if(this.state.startData==""||this.state.endData==""){
      ToastAndroid.show("开始时间和结束时间不能为空",ToastAndroid.SHORT);
      return;
    }
    if(this.state.endData<this.state.startData){
      ToastAndroid.show("结束时间不能小于开始时间",ToastAndroid.SHORT) ;
      return;
    }
    let Extended=[];
    for(var a=0;a<this.state.ExpandProperties.length;a++){
      Extended.push({
        Id:this.state.ExpandProperties[a].Id,
        Name:this.state.ExpandProperties[a].Name,
        Value:this.state['expand' + this.state.ExpandProperties[a].Id]
      })
    }
    let propertieIds=_.pluck(Extended, "Id").join(";").toString();//拓展属性Id
    let extendeds=_.pluck(Extended, "Value").join(";").toString();//拓展属性Value
    var attachmentIds = this.state.files && this.state.files.map((item)=> {
        return (item.Id)
      });
    var files = this.state.newFiles && this.state.newFiles.map((item)=> {
        return {
          uri: "file://" + encodeURI(item.DownloadUrl),
          name: encodeURIComponent(item.Name)
        };
      });

    let planHours=isNaN(this.state.planHours);
    if(planHours){
      ToastAndroid.show("计划工时必须为数字",ToastAndroid.SHORT);
      return;
    }
    if(Number(this.state.planHours)>1000){
      ToastAndroid.show("计划工时必须介于0-1000之间",ToastAndroid.SHORT);
      return;
    }
    let surplusHours=isNaN(this.state.surplusHours);
    if(surplusHours){
      ToastAndroid.show("剩余工时必须为数字",ToastAndroid.SHORT);
      return;
    }
    if(Number(this.state.surplusHours)>1000){
      ToastAndroid.show("剩余工时必须介于0-1000之间",ToastAndroid.SHORT);
      return;
    }
    if(Number(this.state.surplusHours)>Number(this.state.planHours)){
      ToastAndroid.show("剩余工时不能大于计划工时",ToastAndroid.SHORT);
      return;
    }
    let editmodel={
      TaskId:this.state.Id,
      Title:this.state.taskTitle,
      Status:this.state.Status,
      Description:this.state.taskDescribe,
      DateToStart:this.state.startData,
      DateToFinish:this.state.endData,
      DirectorId:this.state.Charger.Id,
      OnlookerIds:_.pluck(this.state.Spectators, "Id"),
      AuditorId:this.state.Audit.Id,
      HoursExpected:this.state.planHours,
      HoursRemaining:this.state.surplusHours
    };
    let members=_.pluck(this.state.Members, "Id");//任务成员
    loaderHandler.showLoader("请稍等。。。");
    api.Task.editTask(editmodel,propertieIds,extendeds,members,attachmentIds,files)
      .then((res)=>{
        loaderHandler.hideLoader();
        if(res.Type==1){
          //返回并刷新列表
          ToastAndroid.show("修改成功",ToastAndroid.SHORT);
          setTimeout(()=>{
            if(this.props.reloadZiTask&&this.props.isChild){
              this.props.reloadZiTask(this.state.Id,"update",this.state.taskTitle);
            }
            if(this.props.type==null&&this.props.type!="notice"){
              this.props.reloadLists();
              if(this.props.isChild){
                this.props.nav.pop();
                this.props.nav.replace({id:'TaskDetail',taskId:this.props.oldTaskId,isChild:false})
              }else{
                this.props.nav.pop();
              }
            }
          },500);
        }else{
          ToastAndroid.show(res.Data,ToastAndroid.SHORT);
        }
      })
  }
  isOK(isok){
    if(isok){
      ToastAndroid.show("创建成功",ToastAndroid.SHORT);
      loaderHandler.hideLoader();
      if(this.props.isChild){
        this.props.nav.pop();
        this.props.nav.replace({id:'TaskDetail',taskId:this.props.oldTaskId,isChild:false})
      }else{
        this.props.nav.pop();
      }
    }else{
      ToastAndroid.show("列表刷新失败,请重试",ToastAndroid.SHORT);
      loaderHandler.hideLoader();
      if(this.props.isChild){
        this.props.nav.pop();
        this.props.nav.replace({id:'TaskDetail',taskId:this.props.oldTaskId,isChild:false})
      }else{
        this.props.nav.pop();
      }
    }
  }
  taskMenu() {
    this.refs.MenuView.open();
  }
  taskDetail(taskId){
    this.props.nav.push({
      id: 'TaskDetail',
      isChild:true,
      taskId:taskId,
      oldTaskId:this.state.Id,
      reloadZiTask:this.reloadZiTask.bind(this),
      reloadLists:()=>{
        setTimeout(()=>{
          this.props.reloadLists();
        },1000);
      }
    })
  }
  reloadZiTask(taskId,type,status){
    var ids = _.pluck(this.state.Children, "Id");
    let index=ids.indexOf(taskId);
    if(index!=-1){
      switch(type){
        case "update":
          this.state.Children[index].Title=status;
          this.setState({Children:this.state.Children});
          break;
        case "restart":
          this.state.Children[index].Status=2;
          this.setState({Children:this.state.Children});
          break;
        case "finish":
          this.state.Children[index].Status=status;
          this.setState({Children:this.state.Children});
          break;
        case "delete":
        case "quit":
          this.state.Children.splice(index, 1);
          this.setState({Children:this.state.Children});
          break;
      }
    }

  }
  addChildTask(){
    this.props.nav.push({
      id:'CreatTask',
      isChild:true,
      getTaskData:this.getChildData.bind(this),
      parentId:this.state.Id
    })
  }
  getChildData(item){
    this.state.Children.push(item);
    this.setState({Children:this.state.Children})
  }
  deleteComment(commentItem, index) {
    if (commentItem != null) {
      commentTemp = commentItem;
      commentIndex = index;
      //弹出可选回复和删除
      this.show();
    }
  }

  newcomItem(newcomItems) {
    tabThis&&tabThis.refs.commentList&&tabThis.refs.commentList.addnewComment(newcomItems)
  }

  startTwoComment(twocomCof) {
    commentTemp = twocomCof;
    that.refs.commentInput.startIn(twocomCof, 2)
  }
  moreComment() {
    _this.props.nav.push({
      id: 'TaskCommentLists',
      creatorUser: _this.state.taskCreator,
      taskId: _this.state.Id
    })
  }
  moreLog() {
    _this.props.nav.push({
      id: 'TaskLogLists',
      taskId: _this.state.Id
    })
  }
  _handlePress(index) {
    if (index == 1) {
      that.refs.commentInput.startIn(commentTemp, 2)
    }
    if (index == 2) {
      tabThis.refs.commentList.deleteComments(commentTemp, commentIndex)
    }
  }
  show() {
    this.ActionSheet.show();
  }
  commentsNum(operation) {
    if(operation=="add"){
      this.setState({commentsCount:this.state.commentsCount+1})
    }else if(operation=="delete"){
      this.setState({commentsCount:this.state.commentsCount-1})
    }else{
      this.setState({commentsCount:this.state.commentsCount});
    }
  }
  downLoadState(state) {
    if (state == 0) {
      this.refs.downLoader.startLoader();
    } else
      this.refs.downLoader.finishLoader();
  }
  downloadFile(file){
    if(file.hasOwnProperty("Id")){
      //下载
      downLoadFiles(file.Name, file.DownloadUrl, file.ContentType, this.downLoadState.bind(this));
    }else{
      //打开本地文件
      Linking.canOpenURL("file://"+file.DownloadUrl).then(supported => {
        if (!supported) {
          ToastAndroid.show('没有对应的应用程序!',ToastAndroid.SHORT);
        } else {
          return Linking.openURL("file://"+file.DownloadUrl);
        }
      }).catch(err =>  ToastAndroid.show('打开失败!',ToastAndroid.SHORT));


      //FileOpener.open(
      //  file.DownloadUrl,
      //  "application/octet-stream"
      //).then(() => {
      //  ToastAndroid.show('打开成功!')
      //}, (e) => {
      //  ToastAndroid.show('打开失败!')
      //});
    }
  }

  keyboardLayout(farme){
    let height=farme.nativeEvent.layout.y;
    if(that&&that.state.hasTFocus){
      that.setState({layout:Dimensions.get('window').height-height});
    }

  }
  backfun(){
    this.props.nav.pop();
    this.props.nav.replace({id:'TaskDetail',taskId:this.props.oldTaskId,isChild:false})
  }
  
  render() {
    let uids = _.pluck(userData, "Id");
    let members = this.state.Members && this.state.Members.map((item)=> {
        return (
          item.Name
        )
      });
    let spectators = this.state.Spectators && this.state.Spectators.map((item)=> {
        return (
          item.Name
        )
      });
    var viewBgColor = "#ffffff";
    var viewtext = "进行中";
    var textColor="#000000";
    switch(this.state.Status){
      case 1://未启动
        viewtext = "未开始";
        textColor="#ffffff";
        viewBgColor = "#999999";
        break;
      case 2://进行中
        viewtext = "进行中";
        textColor="#ffffff";
        viewBgColor = "#008000";
        break;
      case 3://已超期
        viewtext = "进行中";
        textColor="#ffffff";
        viewBgColor = "#ff0000";
        break;
      case 4://审核中
        viewtext = "进行中";
        textColor="#ffffff";
        viewBgColor = "#ff9900";
        break;
      case 5://完成
      case 7:
        viewtext = "已完成";
        textColor="#000000";
        viewBgColor = "#ffffff";
        break;
    }
    let canUpdate=this.state.Task_Update&&this.state.Status<5;
    let stage=this.state.Stage;
    if(this.state.Stage.length>10){
      stage=this.state.Stage.substring(0,10)+"···"
    }
    console.log(this.state.comments)
    return (
      <View style={styles.whiteContainer}>
        <NavigationBar
          style={styles.NavBarSty}
          leftButton={
            <NavLeftView nav={this.props.nav} leftTitle={this.props.isChild?"子任务详情":"任务详情"} backFun={this.props.isChild==true?this.backfun.bind(this):()=>{this.props.nav.pop();}}/>
          }
          rightButton={
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {
                this.state.fetchSuccess ?
                <View style={{justifyContent: 'center', flexDirection: 'row'}}>
                  {
                    this.state.isEdit?<TouchableOpacity style={[styles.touIcon, {paddingLeft: 10,paddingRight:10}]} onPress={this.creatTask.bind(this)}>
                     <Text style={styles.rightNavText}>保存</Text>
                    </TouchableOpacity>:null
                  }
                  <TouchableOpacity style={[styles.touIcon, {paddingLeft: 10,paddingRight:15}]} onPress={this.taskMenu.bind(this)}>
                    <Icon
                      name='md-more'
                      size={25}
                      color='white'
                    />
                  </TouchableOpacity>
                  </View>
                 : <Text/>
              }

            </View>}
          />
        {
          this.state.fetchSuccess?
            <InputScrollView showsVerticalScrollIndicator={false} style={{paddingBottom:50}}>
            <View style={styles.detailView}>
              <View style={styles.detailTitle}>
                <View style={styles.titleView}>
                  <TextInput
                    learButtonMode="while-editing"
                    underlineColorAndroid="transparent"
                    placeholder="任务标题"
                    editable={canUpdate}
                    defaultValue={this.state.taskTitle}
                    style={[styles.titleText,{height:40,textAlignVertical:'center'}]}
                    onChangeText={(text) => this.setState({isEdit:true,taskTitle: text})}/>
                </View>
              </View>

              <View style={styles.groupName}>
                <View style={[styles.statusView,{backgroundColor:viewBgColor}]}>
                  <Text style={[styles.Title,{color:textColor}]}>{viewtext}</Text>
                </View>
                {
                  this.state.Stage==""?null: <View style={[styles.statusView,{marginLeft:10}]}>
                    <Text style={[styles.Title,{color:"#000000"}]}>{stage}</Text>
                  </View>
                }
              </View>

              <View style={styles.ProdescribeView}>
                <View style={styles.describeView}>
                  <TextInput
                    learButtonMode="while-editing"
                    underlineColorAndroid="transparent"
                    placeholder="任务描述"
                    multiline={true}
                    editable={canUpdate}
                    defaultValue={this.state.taskDescribe}
                    style={styles.describeText}
                    onChangeText={(text) => this.setState({isEdit:true,taskDescribe: text})}/>
                </View>
              </View>

              <View>
                <View style={styles.filesRow}>
                  <View style={styles.filesViews}>
                    {this.state.FILES.length!=0&&this.state.FILES.map((item,index)=>{
                      let itemIndex = item.Name.lastIndexOf(".");
                      let itemName = item.Name.substring(0, itemIndex);
                      let icoName = "file-text";
                      let iconColor;
                      var name = item.Name.substring(itemIndex, item.Name.length);
                      switch (name) {
                        case ".txt":
                          icoName = "file-text-o";
                          iconColor = "#91A7B9";
                          break;
                        case ".jpg":
                        case ".jpeg":
                        case ".png":
                        case ".gif":
                          icoName = "file-image-o";
                          iconColor = "#E15555";
                          break;
                        case ".docx":
                        case ".doc":
                          icoName = "file-word-o";
                          iconColor = "#3E9AE8";
                          break;
                        case ".xlsx":
                        case ".xls":
                          icoName = "file-excel-o";
                          iconColor = "#2FB266";
                          break;
                        case ".pptx":
                        case ".ppt":
                          icoName = "file-powerpoint-o";
                          iconColor = "#EB8B18";
                          break;
                        case ".rar":
                        case ".zip":
                          icoName = "file-zip-o";
                          iconColor = "#7DCA3D";
                          break;
                        case ".pdf":
                          icoName = "file-pdf-o";
                          iconColor = "#CF2C34";
                          break;
                        case ".mp3":
                        case ".amr":
                          icoName = "file-sound-o";
                          iconColor = "#8183F1";
                          break;
                        case ".mp4":
                          icoName = "file-movie-o";
                          iconColor = "#6D8AAB";
                          break;
                        default:
                          icoName = "file-text";
                          iconColor = "#BEC3C7";
                          break;
                      }
                      let fileName=item.Name;
                      if(item.Name.length>16){
                        fileName=item.Name.substring(0, 16)+"...";
                      }
                      return(
                        <View key={index} style={[styles.fileCon,{paddingRight:10}]}>
                          <TouchableOpacity onPress={this.downloadFile.bind(this,item)} onLongPress={canUpdate?this.removeFile.bind(this,index,item.Name):()=>{}}>
                            <View style={styles.fileRow}>
                              <View style={styles.fileView}>
                                <Icons
                                  name={icoName}
                                  size={18}
                                  color={iconColor}
                                  />
                                <Text numberOfLines={1} style={{fontSize: 13}}>{" "+fileName}</Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>
                      )
                    })}
                  </View>
                  <View style={styles.detailFilesView}>
                    {this.state.FILES.length!=0?<Text style={[styles.tips,{justifyContent: 'flex-start',flex:1}]}>长按可删除附件</Text>:<Text style={{flex:1,justifyContent: 'flex-start'}}/>}
                    <TouchableOpacity onPress={canUpdate?this.addFiles.bind(this):()=>{}}>
                      <View style={styles.filesIcon}>
                        <Icons
                          name="paperclip"
                          size={18}
                          />
                      </View>
                    </TouchableOpacity>
                  </View>

                </View>
              </View>
              {
                this.state.projectName==""?null:<View style={[styles.detailTitle,{marginTop:10}]}>
                  <View style={styles.detailFilesView}>
                    <Text style={styles.detailProjName}>{this.state.projectName}</Text>
                  </View>
                </View>
              }
              <View style={[styles.detailTitle,{marginTop:10}]}>
                <View style={styles.detailFilesView}>
                  <View/>
                  <Text style={styles.detailProjName}>{this.state.UserCreatedInfo}</Text>
                </View>
              </View>
            </View>
            <View style={[styles.whiteContainer,{paddingLeft:12,paddingRight:12}]}>
              <View style={styles.CreatTaskRow1}>
                <TouchableOpacity onPress={canUpdate?this.startDatePicker.bind(this):()=>{}}>
                  <View style={styles.CreatTaskRows}>
                    <Text style={styles.Title}>开始时间:</Text>
                    <View style={{flex:1, paddingLeft:10}}>
                      <Text style={styles.Title}>{this.state.startData}</Text>
                    </View>
                    <Icons
                      name='angle-right'
                      size={16}
                      style={styles.rigthBtn}
                      />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.CreatTaskRow1}>
                <TouchableOpacity onPress={canUpdate?this.endDatePicker.bind(this):()=>{}}>
                  <View style={styles.CreatTaskRows}>
                    <Text style={styles.Title}>结束时间:</Text>
                    <View style={{flex:1,paddingLeft:10}}>
                      <Text style={styles.Title}>{this.state.endData}</Text>
                    </View>
                    <Icons
                      name='angle-right'
                      size={16}
                      style={styles.rigthBtn}
                      />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.CreatTaskRow1}>
                <View style={styles.CreatTaskRows}>
                  <Text style={styles.Title}>负责人:</Text>
                  <TouchableOpacity style={{flex:1}} onPress={canUpdate?this.addCharge.bind(this):()=>{}}>
                    <View style={{flex:1,paddingLeft:10}}>
                      {this.state.Charger.length!=0?<View style={styles.userView}>
                        <Image
                          source={{uri: this.state.Charger.Avatar}}
                          style={styles.userAvatar}
                          />
                        <Text style={styles.Title}>{this.state.Charger.Name}</Text>
                      </View>:<Text style={styles.Title}>未设置</Text>}
                    </View>
                  </TouchableOpacity>
                  <Icons
                    name='angle-right'
                    size={16}
                    style={styles.rigthBtn}
                    />
                </View>
              </View>

              <View style={styles.CreatTaskRow1}>
                <View style={styles.CreatTaskRows}>
                  <Text style={styles.Title}>任务成员:</Text>
                  <TouchableOpacity style={{flex:1}} onPress={canUpdate?this.addMembers.bind(this):()=>{}}>
                    <View style={{flex:1,paddingLeft:10}}>
                      {this.state.Members.length!=0?<Text style={[styles.Title,{width:width-120}]}>{members.join("、")}</Text>:
                        <Text style={styles.Title}>未设置</Text>}
                    </View>
                  </TouchableOpacity>
                  <Icons
                    name='angle-right'
                    size={16}
                    style={styles.rigthBtn}
                    />
                </View>
              </View>

              <View style={styles.CreatTaskRow1}>
                <View style={styles.CreatTaskRows}>
                  <Text style={styles.Title}>旁观者:</Text>
                  <TouchableOpacity style={{flex:1}} onPress={canUpdate?this.addSpectators.bind(this):()=>{}}>
                    <View style={{flex:1,paddingLeft:10}}>
                      {this.state.Spectators.length!=0?<Text style={[styles.Title,{width:width-120}]}>{spectators.join("、")}</Text>:
                        <Text style={styles.Title}>未设置</Text>}
                    </View>
                  </TouchableOpacity>
                  <Icons
                    name='angle-right'
                    size={16}
                    style={styles.rigthBtn}
                    />
                </View>
              </View>

              <View style={styles.CreatTaskRow1}>
                <View style={styles.CreatTaskRows}>
                  <Text style={styles.Title}>审核人:</Text>
                  <TouchableOpacity style={{flex:1}} onPress={canUpdate?this.addAudit.bind(this):()=>{}}>
                    <View style={{flex:1,paddingLeft:10}}>
                      {this.state.Audit.length!=0?<View style={styles.userView}>
                        <Image
                          source={{uri: this.state.Audit.Avatar}}
                          style={styles.userAvatar}
                          />
                        <Text style={styles.Title}>{this.state.Audit.Name}</Text>
                      </View>:<Text style={styles.Title}>未设置</Text>}
                    </View>
                  </TouchableOpacity>
                  <Icons
                    name='angle-right'
                    size={16}
                    style={styles.rigthBtn}
                    />
                </View>
                <Text style={styles.tips}>如设置审核人,则必须经过审核人审核通过任务才能完成</Text>
              </View>

              <View style={[styles.CreatTaskRow1,{paddingTop:6,paddingBottom:6}]}>
                <View style={styles.workHoursRow}>
                  <View>
                    <View style={{flexDirection: 'row', alignItems: 'center',}}>
                      <Text style={styles.Title}>计划工时</Text>
                      <View style={styles.hourText}>
                        <TextInput
                          keyboardType="numeric"
                          editable={canUpdate}
                          underlineColorAndroid="transparent"
                          placeholder="0"
                          defaultValue={this.state.planHours.toString()}
                          style={[styles.hourTextIn,{textAlignVertical:'bottom',textAlign:'center'}]}
                          onChangeText={(text) => this.setState({isEdit:true,planHours: text})}/>
                      </View>
                      <Text style={styles.Title}>小时</Text>
                    </View>
                  </View>
                  <View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={styles.Title}>剩余工时</Text>
                      <View style={styles.hourText}>
                        <TextInput
                          keyboardType="numeric"
                          underlineColorAndroid="transparent"
                          placeholder="0"
                          editable={canUpdate}
                          defaultValue={this.state.surplusHours.toString()}
                          style={[styles.hourTextIn,{textAlignVertical:'bottom',textAlign:'center'}]}
                          onChangeText={(text) => this.setState({isEdit:true,surplusHours: text})}/>
                      </View>
                      <Text style={styles.Title}>小时</Text>
                    </View>
                  </View>
                </View>
              </View>
              {
                this.state.ExpandProperties.length!=0&&this.state.ExpandProperties.map((item,index)=>{
                  return(
                    <View key={index} style={styles.ExpandPropertieView}>
                      <Text style={styles.ExpandPropertiesTI} numberOfLines={1}>{item.Name+":"}</Text>
                      <TextInput
                        clearButtonMode="while-editing"
                        underlineColorAndroid="transparent"
                        placeholder={item.Name}
                        editable={canUpdate}
                        defaultValue={item.Value}
                        style={[styles.ExpandPropertiesText,{height:40,textAlignVertical:'center'}]}
                        onChangeText={(text) => this.setState({isEdit:true,['expand' + item.Id]: text})}/>
                    </View>
                  )
                })
              }
              {
                this.props.isChild&&this.props.isChild?null:<View style={{marginTop:10}}>
                  <View><Text style={styles.childText}>子任务({this.state.ChildCount})</Text></View>
                  {
                    this.state.Children.length!=0&&this.state.Children.map((item,index)=>{
                      var icoName = "square-o";
                      var iconColor = "#000000";
                      switch(item&&item.Status){
                        case 1://未启动
                          icoName = "calender";
                          iconColor = "#f8f8f8";
                          break;
                        case 2://进行中
                          icoName = "square-o";
                          iconColor = "#000000";
                          break;
                        case 3://已超期
                          icoName = "square";
                          iconColor = "#ff0000";
                          break;
                        case 4://审核中
                          icoName = "square";
                          iconColor = "#000000";
                          break;
                        case 5://完成
                        case 7:
                          icoName = "check-square-o";
                          iconColor = "#000000";
                          break;
                      }
                      return(
                        <TouchableOpacity key={index} onPress={this.taskDetail.bind(this,item.Id)}>
                          <View style={[styles.listTopView,{padding: 0,height:22}]}>
                            <View style={styles.nameView}>
                              <Icons
                                name={icoName}
                                size={20}
                                color={iconColor}
                                />
                            </View>
                            <View style={{flex:1,marginLeft:10}}><Text numberOfLines={1}>{item&&item.Title}</Text></View>
                            <View style={styles.imgView}>
                              <Image
                                source={{uri: item&&item.Avatar}}
                                style={styles.thumbnail}
                                />
                            </View>
                            <View></View>
                          </View>
                        </TouchableOpacity>
                      )
                    })
                  }
                  {
                    canUpdate?<TouchableOpacity onPress={this.addChildTask.bind(this)}>
                      <View style={styles.addChild}>
                        <Icon
                          name='md-add'
                          size={18}
                          color='blue'
                          />
                        <Text style={[styles.Title,{color: "blue",marginLeft:8}]}>添加子任务</Text>
                      </View>
                    </TouchableOpacity>:null
                  }
                </View>
              }
            </View>
            <View style={styles.logsAndcommentsView}>
              <TabView nav={this.props.nav}/>
            </View>
          </InputScrollView>:<View/>
        }
        {
          this.state.fetchSuccess ? <BottomView commentConfig={this.state.commentConfig}/>: null
        }
        <ActionSheet
          ref={(o) => {this.ActionSheet = o}}
          options={Actbuttons}
          cancelButtonIndex={CANCEL_INDEX}
          destructiveButtonIndex={DESTRUCTIVE_INDEX}
          onPress={this._handlePress.bind(this)}
          />
        <TaskMenuView ref="MenuView" nav={this.props.nav}/>
        <BusyIndicator color='#EFF3F5' loadType={1} loadSize={10} textFontSize={15} overlayColor='#4A4A4A' textColor='white' />
        <View  onLayout={this.keyboardLayout.bind(this)}/>
      </View>
    );
  }
};

