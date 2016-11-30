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
  DatePickerAndroid,
  ScrollView,
  ProgressBarAndroid,
  Dimensions
} from 'react-native';
import styles from "./style";
import Pstyle from '../project/style'
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
let _this;
let userData=[];//用来判断身份是否重复的数组
import ActionSheet from 'react-native-actionsheet';
const dismissKeyboard = require('dismissKeyboard');
import InputScrollView from 'react-native-inputscrollview';
let inputComponents = [];
export default class CreatTask extends Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    var newDate = formatter('yyyy-MM-dd', new Date());
    this.state = {
      taskTitle:this.props.copyTaskData==null?"":this.props.copyTaskData.taskTitle,
      taskDescribe:this.props.copyTaskData==null?"":this.props.copyTaskData.taskDescribe,
      files:[],
      visiable:false,
      startData:newDate,
      endData:newDate,
      Charger:[],//负责人
      Members:[],//任务成员
      Spectators:[],//旁观者
      Audit:[],//审核人
      planHours:0,//计划工时
      surplusHours:0,//剩余工时
      ExpandProperties:[],//拓展属性
      ishaveExpand:false,//是否获取到拓展属性
      groupName:"",
      taskStageId:0,
      isEdit:false,
      stages:[]
    };
    _this=this;
  };
  componentDidMount() {
    userData=[];
    InteractionManager.runAfterInteractions(() => {
      var currUser = api.User.getCurrentUser();
      this.state.Charger=currUser;
      this.setState({Charger:this.state.Charger});
      userData.push(this.state.Charger);
      this.getData();
      if(this.props.stages){
        let names = _.pluck(this.props.stages, "Name");
        this.state.stages=names;
        let ids=_.pluck(this.props.stages, "Id");
        let id=ids.indexOf(this.props.currStage);
        if(id>-1){
          this.state.groupName=names[id];
          this.state.taskStageId=this.props.currStage;
        }
        if (this.state.stages.indexOf("取消") > -1) {
          this.state.stages.splice(this.state.stages.indexOf("取消"), 1);
          this.state.stages.push("取消");
        }
        else {
          this.state.stages.push("取消");
        }
      }

    });
  }
  getData(){
    //this.refs.loader.startLoader();
    api.Task.getExtendedProperty()
      .then((res)=>{
        if(res.Type==1){
          this.setState({ishaveExpand:true});
          if(res.Data!=null){
            this.setState({ExpandProperties:res.Data})
          }
        }else{
          ToastAndroid.show("获取拓展属性失败",ToastAndroid.SHORT)
        }
      })
  }
  getFiles(file){
    var fileData = _.pluck(this.state.files, "name");
    let fileIndex=fileData.indexOf(file.name,fileData);
    if(fileIndex==-1){
      this.state.files.push(file);
      this.setState({
        files:this.state.files
      })
    }else{
      ToastAndroid.show("已选择该文件,请勿重复选择",ToastAndroid.SHORT)
    }
  }
  addFiles(){
    dismissKeyboard();
    this.props.nav.push({
        id: 'FileSelector',
        getSelFile: (item)=> {
          this.getFiles(item)
        }
      }
    );
  }
  removeFile(index){
    this.state.files.splice(index, 1);
    this.setState({
      files:this.state.files
    })
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
            this.setState({endData:formatter('yyyy-MM-dd',date)});
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
    dismissKeyboard();
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
          this.setState({Charger:Charge})
        }
      }else{
        userData.push(Charge);
        this.setState({Charger:Charge})
      }
    }
  }
  //添加任务成员(多选)
  addMembers() {
    dismissKeyboard();
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
          this.setState({Members:temp});
        }else{
          userData = userData.concat(b);
          this.setState({Members:b});
        }
      }else{
        userData = userData.concat(selectedItem);
        this.setState({Members:selectedItem})
      }
    }
  }

  //添加旁观者(多选)
  addSpectators() {
    dismissKeyboard();
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
          this.setState({Spectators:temp});
        }else{
          userData = userData.concat(b);
          this.setState({Spectators:b});
        }
      }else{
        userData = userData.concat(selectedItem);
        this.setState({Spectators:selectedItem})
      }
    }
  }

  //添加审核人(单选)
  addAudit() {
    dismissKeyboard();
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
          ToastAndroid.show("同一用户只能在任务中担任一种角色",ToastAndroid.SHORT);
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
          this.setState({Audit:Audit})
        }
      }else{
        userData.push(Audit);
        this.setState({Audit:Audit})
      }
    }
  }

  creatTask(){
    dismissKeyboard();
    if (this.state.taskTitle && this.state.taskTitle.length > 32) {
      ToastAndroid.show("任务标题最多不能超过32个字符",ToastAndroid.SHORT);
      return;
    }
    this.state.taskTitle = this.state.taskTitle.trim();
    if (this.state.taskTitle.length == 0) {
      ToastAndroid.show("任务标题不能为空",ToastAndroid.SHORT);
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
    let extendeds=_.pluck(Extended, "Value").join(";").toString();//拓展属性
    var files = this.state.files && this.state.files.map((item)=> {
        return {
          uri: "file://" + encodeURI(item.path),
          name: encodeURIComponent(item.name)
        };
      });
    let isNum=isNaN(this.state.planHours);
    if(isNum){
      ToastAndroid.show("工时必须为数字",ToastAndroid.SHORT);
      return;
    }
    if(Number(this.state.planHours)>1000){
      ToastAndroid.show("计划工时必须介于0-1000之间",ToastAndroid.SHORT);
      return;
    }
    if(this.props.stages){
      if(this.state.groupName==""||this.state.taskStageId==0){
        ToastAndroid.show("请选择任务分组",ToastAndroid.SHORT);
        return;
      }
    }
    let taskModel;
    if(this.props.project==null){
      taskModel={
        ParentId:this.props.parentId==null?0:this.props.parentId,
        Title:this.state.taskTitle,
        Description:this.state.taskDescribe,
        DateToStart:this.state.startData,
        DateToFinish:this.state.endData,
        DirectorId:this.state.Charger.Id,
        OnlookerIds:_.pluck(this.state.Spectators, "Id"),
        AuditorId:this.state.Audit.Id,
        HoursExpected:this.state.planHours
      };
    }
    if(this.props.project){
      taskModel={
        ParentId:this.props.parentId==null?0:this.props.parentId,
        ProjectId:this.props.project==null?0:this.props.project.projectId,
        TaskStageId:this.state.taskStageId,
        Title:this.state.taskTitle,
        Description:this.state.taskDescribe,
        DateToStart:this.state.startData,
        DateToFinish:this.state.endData,
        DirectorId:this.state.Charger.Id,
        OnlookerIds:_.pluck(this.state.Spectators, "Id"),
        AuditorId:this.state.Audit.Id,
        HoursExpected:this.state.planHours
      };
    }
    let members=_.pluck(this.state.Members, "Id");//任务成员
    loaderHandler.showLoader("请稍等。。。");
    api.Task.createTask(taskModel,extendeds,members,files)
      .then((res)=>{
        if(res.Type==1){
          //返回并刷新列表
          if(this.props.isChild){
            this.props.getTaskData(res.Data);
            ToastAndroid.show("创建成功",ToastAndroid.SHORT);
            loaderHandler.hideLoader();
            this.props.nav.pop()
          }else if(this.props.copyTaskData){
            setTimeout(()=>{
              setTimeout(()=>{this.props.reloadList()},1000);
              ToastAndroid.show("复制成功",ToastAndroid.SHORT);
              loaderHandler.hideLoader();
              this.props.nav.pop();
            },500);
          }else if(this.props.stages){
            setTimeout(()=>{
              setTimeout(()=>{this.props.reloadList()},1000);
              ToastAndroid.show("创建成功",ToastAndroid.SHORT);
              loaderHandler.hideLoader();
              this.props.nav.pop()
            },500);
          }
          else{
            setTimeout(()=>{this.props.reloadList(this.isOK.bind(this))},1500);
          }
        }else{
          loaderHandler.hideLoader();
          ToastAndroid.show(res.Data,{position: 100});
        }
      })
  }
  isOK(isok){
    if(isok){
      ToastAndroid.show("创建成功",ToastAndroid.SHORT);
      loaderHandler.hideLoader();
      this.props.nav.pop();
    }else{
      ToastAndroid.show("列表刷新失败,请重试",ToastAndroid.SHORT);
      loaderHandler.hideLoader();
      this.props.nav.pop();
    }
  }
  selectStage(){
    dismissKeyboard();
    this.ActionSheet.show();
  }
  _handlePress(index){
    if(index!=this.state.stages.length-1){
      this.setState({groupName:this.state.stages[index],taskStageId:this.props.stages[index].Id});
    }
  }
  render() {
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
    return (
      <View style={styles.whiteContainer}>
        <NavigationBar
          style={styles.NavBarSty}
          leftButton={
            <NavLeftView nav={this.props.nav} leftTitle={this.props.copyTaskData==null?"创建任务":"复制任务"}/>
          }
          rightButton={
            <TouchableOpacity style={styles.navRightText} onPress={this.creatTask.bind(this)}>
              <Text numberOfLines={1} style={styles.rightNavText}>完成</Text>
            </TouchableOpacity>
          }
        />
        <InputScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.whiteContainer,{paddingLeft:12,paddingRight:12}]}>

          <View style={styles.CreatTaskRow}>
            <TextInput
              ref="taskTitle"
              underlineColorAndroid="transparent"
              placeholder="任务标题"
              defaultValue={this.state.taskTitle}
              style={{height:40,fontSize: 14,textAlignVertical:'center'}}
              onChangeText={(text) => this.setState({taskTitle: text})}/>
          </View>


            <View style={styles.describeView}>
            <TextInput
              ref="taskTitle"
              underlineColorAndroid="transparent"
              placeholder="任务描述"
              multiline={true}
              defaultValue={this.state.taskDescribe}
              style={styles.describeText}
              onChangeText={(text) => this.setState({taskDescribe: text})}/>
            </View>

          <View style={styles.filesRow}>
            <View style={styles.filesViews}>
              {this.state.files.length!=0&&this.state.files.map((item,index)=>{
                let itemIndex = item.name.lastIndexOf(".");
                //let itemName = item.name.substring(0, itemIndex);
                let icoName = "file-text";
                let iconColor;
                var name = item.name.substring(itemIndex, item.name.length);
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
                return(
                  <View key={index} style={styles.fileCon}>
                  <View style={styles.fileRow}>
                    <View style={styles.fileView}>
                      <Icons
                        name={icoName}
                        size={18}
                        color={iconColor}
                      />
                      <Text style={{fontSize: 13}}>{" "+item.name}</Text>
                    </View>
                    <Icon name='ios-close-circle'
                          size={20}
                          color='gray'
                          onPress={this.removeFile.bind(this,index)}
                          style={styles.closeImgIcon}/>
                  </View>
                    </View>
                )
              })}
            </View>
            <TouchableOpacity onPress={this.addFiles.bind(this)}>
              <View style={styles.filesView}>
                <Icons
                  name="paperclip"
                  size={15}
                />
                <Text style={styles.Title}>添加附件</Text>
              </View>
            </TouchableOpacity>
          </View>
          {
            this.props.stages==null?null:<View style={styles.CreatTaskRow1}>
              <View style={styles.CreatTaskRows}>
                <Text style={styles.Title}>任务分组:</Text>
                {
                  <TouchableOpacity onPress={this.selectStage.bind(this)}>
                    <View style={Pstyle.selTemplates}>
                      <Text numberOfLines={1} style={[Pstyle.Title,{width:width-110,marginLeft:10}]}>{this.state.groupName}</Text>
                      <Icons
                        name="caret-down"
                        size={15}
                        color="#000000"
                        style={styles.rigthBtn}
                      />
                    </View>
                  </TouchableOpacity>
                }
              </View>
            </View>
          }


          <View style={styles.CreatTaskRow1}>
            <TouchableOpacity onPress={this.startDatePicker.bind(this)}>
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
            <TouchableOpacity onPress={this.endDatePicker.bind(this)}>
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
            <TouchableOpacity style={{flex:1}} onPress={this.addCharge.bind(this)}>
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
            <TouchableOpacity style={{flex:1}} onPress={this.addMembers.bind(this)}>
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
            <TouchableOpacity style={{flex:1}} onPress={this.addSpectators.bind(this)}>
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
            <TouchableOpacity style={{flex:1}} onPress={this.addAudit.bind(this)}>
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
                      underlineColorAndroid="transparent"
                      placeholder="0"
                      style={[styles.hourTextIn,{textAlignVertical:'bottom',textAlign:'center'}]}
                      onChangeText={(text) => this.setState({planHours: text})}/>
                  </View>
                  <Text style={[styles.Title,{letterSpacing:6}]}>小时</Text>
                </View>
              </View>
            </View>
          </View>
          {
            this.state.ishaveExpand?null:<View style={{flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'}}>
              <View style={{width: 30, height: 30, justifyContent: 'center'}}>
              <ActivityIndicator animating={true} color='gray'/>
              </View>
              <Text style={styles.tips}>
                数据加载中……
              </Text>
            </View>
          }
          {
            this.state.ExpandProperties.length!=0&&this.state.ExpandProperties.map((item,index)=>{
              return(
                <View key={index} style={styles.CreatTaskRow}>
                  <TextInput
                    clearButtonMode="while-editing"
                    underlineColorAndroid="transparent"
                    placeholder={item.Name}
                    style={{height:40,fontSize: 14,textAlignVertical:'center'}}
                    onBlur={()=>{this.setState({isEdit:false})}}
                    onFocus={()=>{this.setState({isEdit:true})}}
                    onChangeText={(text) => this.setState({['expand' + item.Id]: text})}/>
                </View>
              )
            })
          }
        </View>
        </InputScrollView>
        {
          this.state.stages.length!=0? <ActionSheet
          ref={(o) => this.ActionSheet = o}
          options={this.state.stages}
          cancelButtonIndex={this.state.stages.length-1}
          onPress={this._handlePress.bind(this)}
        />:null
        }
       
        <BusyIndicator color='#EFF3F5' loadType={1} loadSize={10} textFontSize={15} overlayColor='#4A4A4A' textColor='white' />
      </View>
    );
  }
};

