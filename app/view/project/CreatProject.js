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
  ProgressBarAndroid,
  DatePickerAndroid,
  Dimensions
} from 'react-native';
import styles from "./style";
import taskStyles from "../task/style";
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
import InputScrollView from 'react-native-inputscrollview'
let _this;
let userData=[];//用来判断身份是否重复的数组
import ActionSheet from 'react-native-actionsheet';
var buttons = ["0"];
var thisGroup;
var thisKb;
var thisMember;
class IconView extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={styles.iconContainer}>
          <Icons
            name={this.props.name}
            size={25}
          />
        </View>
      </TouchableOpacity>
    )
  }
  ;
}
class ProjectMember extends Component {
  constructor(props) {
    super(props);
    this.state = {
      members:[]
    };
    thisMember=this;
  }
  componentDidMount() {
    // var currUser = api.User.getCurrentUser();
    // var newCurrUser={
    //   Avatar: currUser.Avatar,
    //   Type:"user",
    //   Id: currUser.Id,
    //   Name: currUser.Name
    // };
    // this.state.members.push(newCurrUser);
    // this.setState({members:this.state.members})
  }
  addMembers(){
    var selectorConfig = {
      selectorType: 0,
      selectorRadio: 1,
      getselectorItem: this.getMember.bind(this)
    };
    this.props.nav.push({
      id: 'SelectorMain',
      selectorConfig: selectorConfig
    });
  }
  getMember(user){
    let Charge=_this.state.Charger;
    var ids = _.pluck(user, "Id");
    let index=ids.indexOf(Charge.Id);
    if(index!=-1){
      user.splice(index,1)
    };
    var a = this.state.members;
    var b = user;
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
      this.state.members = temp.concat(this.state.members);
      this.setState({isEdit:true,members:this.state.members});
    }else{
      this.state.members = b.concat(this.state.members);
      this.setState({isEdit:true,members:this.state.members});
    }
  }
  removeMember(index){
    this.state.members.splice(index,1);
    this.setState({members:this.state.members});
  }
  setAdmin(index){
    //let itemIndex=this.state.members.indexOf(item);
    this.state.members[index].Type="admin";
    this.setState({members:this.state.members});
  }
  removeAdmin(index){
    this.state.members[index].Type="user";
    this.setState({members:this.state.members});
  }
  memberCell(item,index){
    return(
      <View key={index} style={styles.memberItem}>
        <View style={styles.memberItemLeft}>
          <Image
            source={{uri: item.Avatar}}
            style={styles.userAvatar}
          />
          <Text style={[styles.title,{marginLeft:6}]}>{item&&item.Name}</Text>
          {
            item&&item.Type=="admin"&&<Text style={[styles.adminTitle,{marginLeft:5}]}>管理员</Text>
          }
        </View>
        {
            <View style={styles.memberItemRight}>
              {
                item&&item.Type=="user"? <TouchableOpacity onPress={this.setAdmin.bind(this,index)}>
                  <View style={[styles.iconContainer,{marginRight:8}]}>
                    <Text style={styles.title}>设为管理员</Text>
                  </View>
                </TouchableOpacity>:<TouchableOpacity onPress={this.removeAdmin.bind(this,index)}>
                  <View style={[styles.iconContainer,{marginRight:8,backgroundColor:'#f44336'}]}>
                    <Text style={[styles.title,{color:"#ffffff"}]}>解除管理员</Text>
                  </View>
                </TouchableOpacity>
              }

              <IconView name="trash-o" onPress={this.removeMember.bind(this,index,item)}/>
          </View>
        }

      </View>
    )
  }
  render() {
    return (
      <View>
        <View style={styles.memberView}>
          <Text style={[styles.title,{justifyContent: 'flex-start',flex:1}]}>项目成员:</Text>
          <IconView name="plus" onPress={this.addMembers.bind(this)}/>
        </View>
        <View>
          {
            this.state.members.length!=0&&this.state.members.map((item,index)=>{
              return this.memberCell(item,index)
            })
          }
        </View>
      </View>
    )
  }
  ;
}
class GroupView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups:[]
    };
    thisGroup=this;
  }
  changeState(){
    if(_this.state.selectTemplate.length!=0){
      this.setState({groups:_this.state.selectTemplate.Setting.TaskGroups.split(",")});
    }
  }
  cleanState(){
    this.setState({groups:[]});
  }
  addGroup(){
    this.state.groups.push("");
    this.setState({groups:this.state.groups});
  }
  removeGroup(index,item){
    this.state.groups.splice(index,1);
    this.setState({groups:this.state.groups});
  }
  setGroupName(index,text){
    this.setState({['group' + index]: text});
    this.state.groups[index]=text
  }
  groupCell(item,index){
    return(
      <View key={index} style={styles.memberItem}>
        <View style={styles.groupItemLeft}>
          <View style={styles.groupItemNum}>
            <Text style={styles.groupItemNumText}>{index+1}</Text>
          </View>
          <View style={[styles.groupItemRow,{height:40}]}>
          <TextInput
            ref={"group"+index}
            underlineColorAndroid="transparent"
            textAlignVertical={'center'}
            defaultValue={item}
            textAlign={'left'}
            onChangeText={this.setGroupName.bind(this,index)}
            style={{width:width-90,fontSize: 14,height:40}}
            />
          </View>
        </View>
        {
          index==0?null:<IconView name="trash-o" onPress={this.removeGroup.bind(this,index,item)}/>
        }
      </View>
    )
  }
  render() {
    return (
      <View>
        <View style={styles.memberView}>
          <Text style={[styles.title,{justifyContent: 'flex-start',flex:1}]}>任务分组:</Text>
          <IconView name="plus" onPress={this.addGroup.bind(this)}/>
        </View>
        <View>
          {
            this.state.groups.length!=0&&this.state.groups.map((item,index)=>{
              return this.groupCell(item,index)
            })
          }
        </View>
      </View>
    )
  };
}
class KbView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      kbs:[]
    };
    thisKb=this;
  }
  changeState(){
    if(_this.state.selectTemplate.length!=0){
      let names=_this.state.selectTemplate.Setting.CatalogName.split(";");
      let newNames=names.map((item,index)=>{
        var items=item.split(",");
        if(items.length>=1){return items[0]}
      });
      this.setState({kbs:newNames});
    }
  }
  cleanState(){
    this.setState({kbs:[]});
  }
  addGroup(){
    this.state.kbs.push("");
    this.setState({kbs:this.state.kbs});
  }
  removeKb(index){
    this.state.kbs.splice(index,1);
    this.setState({kbs:this.state.kbs});
  }
  setKbName(index,text){
    this.setState({['kb' + index]: text});
    this.state.kbs[index]=text
  }
  groupCell(item,index){
    return(
      <View key={index} style={styles.memberItem}>
        <View style={styles.groupItemLeft}>
          <View style={styles.groupItemNum}>
            <Icons
              name='folder'
              size={18}
              color="#E6B02D"
            />
          </View>
          <View style={[styles.groupItemRow,{height:40}]}>
            <TextInput
              ref={"kb"+index}
              clearButtonMode="while-editing"
              underlineColorAndroid="transparent"
              textAlignVertical={'center'}
              defaultValue={item}
              textAlign={'left'}
              onChangeText={this.setKbName.bind(this)}
              style={{width:width-95,height:40,fontSize: 14}}
            />
          </View>
        </View>
        {
          index==0?null:<IconView name="trash-o" onPress={this.removeKb.bind(this,index,item)}/>
        }
      </View>
    )
  }
  render() {
    return (
      <View>
        <View style={styles.memberView}>
          <Text style={[styles.title,{justifyContent: 'flex-start',flex:1}]}>文库目录:</Text>
          <IconView name="plus" onPress={this.addGroup.bind(this)}/>
        </View>
        <View>
          {
            this.state.kbs.length!=0&&this.state.kbs.map((item,index)=>{
              return this.groupCell(item,index)
            })
          }
        </View>
      </View>
    )
  };
}
export default class CreatProject extends Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    var newDate = formatter('yyyy-MM-dd', new Date());
    let finish=new Date(newDate);
    finish.setMonth(finish.getMonth() + 1);
    var endData = formatter('yyyy-MM-dd', finish);
    this.state = {
      projectName:"",
      files:[],
      visiable:false,
      startData:newDate,
      endData:endData,
      Charger:[],//负责人
      Templates:[],//全部的项目模板
      selectTemplate:[],//选中的模板
      TemplatesName:"",
      ishaveTemplates:false,//是否获取到拓展属性
      buttons:[]
    };
    _this=this;
  };
  componentDidMount() {
    userData=[];
    var currUser = api.User.getCurrentUser();
    this.state.Charger=currUser;
    this.setState({Charger:this.state.Charger});
    this.getData();
  }
  getData(){
    //this.refs.loader.startLoader();
    api.Project.getCompanyTemplates()
      .then((res)=>{
        if(res.Type==1){
          this.setState({ishaveTemplates:true});
          if(res.Data!=null){
            let names=_.pluck(res.Data, "Name");
            this.state.buttons=names;
            if ( this.state.buttons.indexOf("其他") > -1) {
               this.state.buttons.splice(buttons.indexOf("其他"), 1);
               this.state.buttons.push("其他");
            }
            else {
               this.state.buttons.push("其他");
            }
            if ( this.state.buttons.indexOf("取消") > -1) {
               this.state.buttons.splice( this.state.buttons.indexOf("取消"), 1);
               this.state.buttons.push("取消");
            }
            else {
               this.state.buttons.push("取消");
            }
            this.setState({buttons:this.state.buttons,Templates:res.Data})
          }
        }else{
          ToastAndroid.show("获取项目模板失败",ToastAndroid.SHORT)
        }
      })
  }
  startDatePicker() {
    let today = new Date(this.state.startData);
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
      var ids = _.pluck(thisMember.state.members, "Id");
      let index=ids.indexOf(Charge.Id);
      if(index!=-1){
        thisMember.state.members.splice(index,1)
      };
      this.setState({Charger:Charge});
    }
  }
  selectTemplate(){
    this.ActionSheet.show();
  }
  _handlePress(index){
    if(!isNaN(index)&&index!= this.state.buttons.length-1&&index!= this.state.buttons.length-2){
      this.setState({TemplatesName: this.state.buttons[index],selectTemplate:this.state.Templates[index]});
      this.refs.groupView.changeState();
      this.refs.kbView.changeState();
    }
    if(!isNaN(index)&&index== this.state.buttons.length-2){
      //其他
      this.setState({TemplatesName: this.state.buttons[index]});
      this.refs.groupView.cleanState();
      thisGroup.state.groups.push("");
      thisGroup.setState({groups:thisGroup.state.groups});
      this.refs.kbView.cleanState();
      thisKb.state.kbs.push("");
      thisKb.setState({kbs:thisKb.state.kbs});
    }

  }
  creatProject(){
    if (this.state.projectName && this.state.projectName.length > 32) {
      ToastAndroid.show("项目名称最多不能超过32个字符",ToastAndroid.SHORT);
      return;
    }
    this.state.projectName = this.state.projectName.trim();
    if (this.state.projectName.length == 0) {
      ToastAndroid.show("项目名称不能为空",ToastAndroid.SHORT);
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
    let projectMembers=thisMember.state.members.filter((item,index)=>{
      if(item.Type=="user"){
        return item
      }
    });
    let projectAdmin=thisMember.state.members.filter((item,index)=>{
      if(item.Type=="admin"){
        return item
      }
    });
    let members=_.pluck(projectMembers, "Id");
    let admins=_.pluck(projectAdmin, "Id");
    if(this.state.TemplatesName==""){
      ToastAndroid.show("请选择任务模板",ToastAndroid.SHORT) ;
      return;
    }
    if(thisGroup.state.groups.length==0){
      ToastAndroid.show("任务分组不能为空",ToastAndroid.SHORT) ;
      return;
    }
    if(thisKb.state.kbs.length==0){
      ToastAndroid.show("文库目录不能为空",ToastAndroid.SHORT) ;
      return;
    }
    let textArr_group=[];
    let textArr_kb=[];
    let flag=false;
    for(var i=0;i<thisGroup.state.groups.length;i++){
      //循环操作后的数组
      if(thisGroup.state["group" + i]==null){
        if(thisGroup.refs["group"+i]==null||thisGroup.refs["group" + i]._getText()==""){
          ToastAndroid.show("分组"+(i+1)+"不能为空",ToastAndroid.SHORT);
          flag=true;
        }else{
          textArr_group.push(thisGroup.refs["group" + i]._getText());
        }
      }else{
        if(thisGroup.state["group" + i]==""){
          ToastAndroid.show("分组"+(i+1)+"不能为空",ToastAndroid.SHORT);
          flag=true;
        }else{
          textArr_group.push(thisGroup.state["group" + i]);
        }
      }
    }
    for(var i=0;i<thisKb.state.kbs.length;i++){
      //循环操作后的数组
      if(thisKb.state["kb" + i]==null){
        if(thisKb.refs["kb"+i]==null||thisKb.refs["kb" + i]._getText()==""){
          ToastAndroid.show("目录"+(i+1)+"不能为空",ToastAndroid.SHORT);
          flag=true;
        }else{
          textArr_kb.push(thisKb.refs["kb" + i]._getText());
        }
      }else{
        if(thisKb.state["kb" + i]==""){
          ToastAndroid.show("目录"+(i+1)+"不能为空",ToastAndroid.SHORT);
          flag=true;
        }else{
          if(thisKb.state["kb" + i].length>=16){
            ToastAndroid.show("目录"+(i+1)+"不能超过16个字",ToastAndroid.SHORT);
            flag=true;
          }else{
            textArr_kb.push(thisKb.state["kb" + i]);
          }
        }
      }
    }
    if(!flag){
      let createModel={
        Name:this.state.projectName,
        DateStarted:this.state.startData,
        DateToFinish:this.state.endData
      };
      loaderHandler.showLoader("请稍等。。。");
      api.Project.createProject(createModel,this.state.Charger.Id,admins,members,textArr_group.join(";"),textArr_kb.join(";"))
        .then((res)=>{
          if(res.Type==1){
            setTimeout(()=>{
              ToastAndroid.show("创建成功",ToastAndroid.SHORT);
              this.props.nav.pop();
              this.props.reloadList();
              loaderHandler.hideLoader();
            },1000);
          }else{
            ToastAndroid.show(res.Data,ToastAndroid.SHORT);
          }
        })
    }

  }
  render() {
    return (
      <View style={styles.whiteContainer}>
        <NavigationBar
          style={styles.NavBarSty}
          leftButton={
            <NavLeftView nav={this.props.nav} leftTitle={"新建项目"}/>
          }
          rightButton={
            <TouchableOpacity style={styles.navRightText} onPress={this.creatProject.bind(this)}>
              <Text numberOfLines={1} style={styles.rightNavText}>创建</Text>
            </TouchableOpacity>
          }
        />
        <InputScrollView showsVerticalScrollIndicator={false}>
        <View style={[taskStyles.whiteContainer,{paddingLeft:12,paddingRight:12}]}>

          <View style={taskStyles.CreatTaskRow}>
            <TextInput
              ref="taskTitle"
              clearButtonMode="while-editing"
              underlineColorAndroid="transparent"
              placeholder="项目名称"
              textAlignVertical={'center'}
              textAlign={'left'}
              style={{height:40,fontSize: 14,}}
              onChangeText={(text) => this.setState({projectName: text})}/>
          </View>

          <View style={taskStyles.CreatTaskRow1}>
            <TouchableOpacity onPress={this.startDatePicker.bind(this)}>
              <View style={taskStyles.CreatTaskRows}>
                <Text style={taskStyles.Title}>开始时间:</Text>
                <View style={{flex:1, paddingLeft:10}}>
                  <Text style={taskStyles.Title}>{this.state.startData}</Text>
                </View>
                <Icons
                  name='angle-right'
                  size={16}
                  style={taskStyles.rigthBtn}
                  />
              </View>
            </TouchableOpacity>
          </View>

          <View style={taskStyles.CreatTaskRow1}>
            <TouchableOpacity onPress={this.endDatePicker.bind(this)}>
              <View style={taskStyles.CreatTaskRows}>
                <Text style={taskStyles.Title}>结束时间:</Text>
                <View style={{flex:1, paddingLeft:10}}>
                  <Text style={taskStyles.Title}>{this.state.endData}</Text>
                </View>
                <Icons
                  name='angle-right'
                  size={16}
                  style={taskStyles.rigthBtn}
                  />
              </View>
            </TouchableOpacity>
          </View>

          <View style={taskStyles.CreatTaskRow1}>
            <View style={taskStyles.CreatTaskRows}>
            <Text style={taskStyles.Title}>负责人:</Text>
            <TouchableOpacity style={{flex:1}} onPress={this.addCharge.bind(this)}>
              <View style={{flex:1,paddingLeft:10}}>
                {this.state.Charger.length!=0?<View style={taskStyles.userView}>
                  <Image
                    source={{uri: this.state.Charger.Avatar}}
                    style={taskStyles.userAvatar}
                  />
                  <Text style={taskStyles.Title}>{this.state.Charger.Name}</Text>
                </View>:<Text style={taskStyles.Title}>未设置</Text>}
              </View>
            </TouchableOpacity>
            <Icons
              name='angle-right'
              size={16}
              style={taskStyles.rigthBtn}
            />
            </View>
          </View>
          <View>
            <ProjectMember nav={this.props.nav}/>
          </View>
          <View style={styles.CreatProjectRow}>
            <View style={taskStyles.CreatTaskRows}>
              <Text style={taskStyles.Title}>项目模板:</Text>
              {
                this.state.ishaveTemplates?<TouchableOpacity onPress={this.selectTemplate.bind(this)}>
                  <View style={styles.selTemplates}>
                    <Text numberOfLines={1} style={[styles.Title,{width:width-110,marginLeft:10}]}>{this.state.TemplatesName}</Text>
                    <View style={styles.downIcon}>
                      <Icons
                        name="caret-down"
                        size={15}
                        color="#000000"
                      />
                    </View>
                  </View>
                </TouchableOpacity>:<TouchableOpacity onPress={this.selectTemplate.bind(this)}>
                  <View style={styles.selTemplates}>
                    <Text numberOfLines={1} style={[styles.Title,{width:width-110,marginLeft:10}]}>{this.state.TemplatesName}</Text>
                    <View style={styles.downIcon}>
                      <Icons
                        name="caret-down"
                        size={15}
                        color="#000000"
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              }

            </View>
          </View>
          {
            this.state.ishaveTemplates?null:<View style={{flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'}}>
              <View style={{width: 30, height: 30, justifyContent: 'center'}}>
                <ActivityIndicator animating={true} color='gray'/>
                </View>
              <Text style={taskStyles.tips}>
                数据加载中……
              </Text>
            </View>
          }
          {
            this.state.TemplatesName==""?null:<View>
              <GroupView ref="groupView" nav={this.props.nav}/>
              <KbView ref="kbView" nav={this.props.nav}/>
            </View>
          }

        </View>
        </InputScrollView>
        {
          this.state.buttons.length!=0? <ActionSheet
          ref={(o) => this.ActionSheet = o}
          options={this.state.buttons}
          cancelButtonIndex={this.state.buttons.length-1}
          onPress={this._handlePress.bind(this)}
        />:null
        }
       
        <BusyIndicator color='#EFF3F5' loadType={1} loadSize={10} textFontSize={15} overlayColor='#4A4A4A' textColor='white' />
      </View>
    );
  }
};

