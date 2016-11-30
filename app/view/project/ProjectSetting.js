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
  Alert,
  TouchableOpacity,
  ToastAndroid,
  ListView,
  TextInput,
  InteractionManager,
  ActivityIndicator,
  DatePickerAndroid,
  Keyboard,
  Dimensions
} from 'react-native';
import styles from "./style";
import taskStyles from "../task/style";
import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons'
import Icons from 'react-native-vector-icons/FontAwesome';
var {height, width} = Dimensions.get('window');
import api from "../../network/ApiHelper";
import NavLeftView from '../common/NavLeftView';
import _ from 'lodash'
import InputScrollView from 'react-native-inputscrollview';
var BusyIndicator = require('react-native-busy-indicator');
var loaderHandler = require('react-native-busy-indicator/LoaderHandler');
let userData=[];//用来判断身份是否重复的数组
var thisMember;
var _this;
import {formatter} from '../../tools/DateHelper'
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
      members:_this.state.Promembers
    };
    thisMember=this;
  }
  componentDidMount() {

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
    let selectUser=[];
    let Charge=_this.state.Charger;
    var ids = _.pluck(user, "Id");
    let index=ids.indexOf(Charge.Id);
    if(index!=-1){
      user.splice(index,1)
    };
    if(user&&user.length!=0){
      for(var i=0;i<user.length;i++){
        let users={
          Id: user[i].Id,
          Name: user[i].Name,
          Avatar: user[i].Avatar,
          Role: 4
        };
        selectUser.push(users);
      }
    }
    var a = this.state.members;
    var b = selectUser;
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
      this.setState({members:this.state.members});
      _this.setState({isEdit:true})
    }else{
      this.state.members = b.concat(this.state.members);
      this.setState({members:this.state.members});
      _this.setState({isEdit:true})
    }
  }
  removeMember(index){
    this.state.members.splice(index,1);
    this.setState({members:this.state.members});
    _this.setState({isEdit:true})
  }
  setAdmin(index){
    //let itemIndex=this.state.members.indexOf(item);
    this.state.members[index].Role=2;
    this.setState({members:this.state.members});
    _this.setState({isEdit:true})
  }
  removeAdmin(index){
    this.state.members[index].Role=4;
    this.setState({members:this.state.members});
    _this.setState({isEdit:true})
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
            item&&item.Role==2&&<Text style={[styles.adminTitle,{marginLeft:5}]}>管理员</Text>
          }
        </View>
            <View style={styles.memberItemRight}>
              {
                item&&item.Role==4? <TouchableOpacity onPress={this.setAdmin.bind(this,index)}>
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
export default class ProjectSetting extends Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {
      isEdit:false,
      startData:"",
      endData:"",
      projectName:"",
      Charger:[],
      Promembers:[],
      fetchSuccess:false,
      status:0
    };
    _this=this;
  };
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      loaderHandler.showLoader("请稍等。。。");
      api.Project.projectSetting(this.props.project.projectId)
        .then((res)=>{
          if(res.Type==1){
            this.setState({
              projectName:res.Data.Name,
              Charger:res.Data.Director,
              startData:res.Data.DateStarted,
              endData:res.Data.DateToFinish,
              Promembers:res.Data.Members,
              status:res.Data.Status,
              fetchSuccess:true
            });
            thisMember.setState({
              members:res.Data.Members
            });
            loaderHandler.hideLoader();
          }else{
            ToastAndroid.show(res.Data,ToastAndroid.SHORT);
          }
        })
    });
     this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
  }
   componentWillUnmount () {
     console.log("Unmount")
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow () {
    this.props.callback&&this.props.callback(true);
  }

  _keyboardDidHide () {
    this.props.callback&&this.props.callback(false);
  }
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
    let Charge=selectedItem[0];
    var ids = _.pluck(thisMember.state.members, "Id");
    let index=ids.indexOf(Charge.Id);
    if(index!=-1){
      thisMember.state.members.splice(index,1)
    };
    this.setState({isEdit:true,Charger:Charge});
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
  editProject(){
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
      if(item.Role==4){
        return item
      }
    });
    let projectAdmin=thisMember.state.members.filter((item,index)=>{
      if(item.Role==2){
        return item
      }
    });
    let members=_.pluck(projectMembers, "Id");
    let admins=_.pluck(projectAdmin, "Id");

    let editModel={
      Id:this.props.project.projectId,
      Name:this.state.projectName,
      DateStarted:this.state.startData,
      DateToFinish:this.state.endData
    };
     loaderHandler.showLoader("请稍等。。。");
    api.Project.editProject(editModel,this.state.Charger.Id,admins,members)
      .then((res)=>{
        if(res.Type==1){
          this.setState({isEdit:false});
          // this.props.nav.pop();
          this.props.reloadData();
           loaderHandler.hideLoader();
          ToastAndroid.show(res.Data,ToastAndroid.SHORT);
        }else{
           loaderHandler.hideLoader();
          ToastAndroid.show(res.Data,ToastAndroid.SHORT);
        }

      })
  }
  finishProject(index){
    if(index==0){
      //取消归档
      Alert.alert(
        '提示',
        '确定取消归档该项目？',
        [
          {text: '取消'},
          {
            text: '确定', onPress: () => {
            loaderHandler.showLoader("请稍等。。。");
            api.Project.cancelFinishProject(this.props.project.projectId)
              .then((res)=>{
                if(res.Type==1){
                  setTimeout(()=>{
                    this.props.nav.pop();
                    this.props.reloadData();
                    loaderHandler.hideLoader();
                    ToastAndroid.show(res.Data,ToastAndroid.SHORT);
                  },1500)
                }else{
                  loaderHandler.hideLoader();
                  ToastAndroid.show(res.Data,ToastAndroid.SHORT);
                }
              })
          }
          }
        ]
      );
    }else{
      Alert.alert(
        '提示',
        '确定归档该项目？',
        [
          {text: '取消'},
          {
            text: '确定', onPress: () => {
            loaderHandler.showLoader("请稍等。。。");
            api.Project.finishProject(this.props.project.projectId)
              .then((res)=>{
                if(res.Type==1){
                  setTimeout(()=>{
                    this.props.nav.pop();
                    this.props.reloadData();
                    loaderHandler.hideLoader();
                    ToastAndroid.show(res.Data,ToastAndroid.SHORT);
                  },1500)
                }else{
                  loaderHandler.hideLoader();
                  ToastAndroid.show(res.Data,ToastAndroid.SHORT);
                }
              })
          }
          }
        ]
      );
    }
  }
  deleteProject(){
    Alert.alert(
      '提示',
      '确定删除该项目？',
      [
        {text: '取消'},
        {
          text: '确定', onPress: () => {
          loaderHandler.showLoader("请稍等。。。");
          api.Project.recycleProject(this.props.project.projectId)
            .then((res)=>{
              if(res.Type==1){
                setTimeout(()=>{
                  this.props.nav.pop();
                  this.props.reloadData();
                  loaderHandler.hideLoader();
                  ToastAndroid.show(res.Data,ToastAndroid.SHORT);
                },1500)
              }else{
                loaderHandler.hideLoader();
                ToastAndroid.show(res.Data,ToastAndroid.SHORT);
              }
            })
        }
        }
      ]
    );

  }
  render() {
    return (
      <View style={styles.whiteContainer}>
        <NavigationBar
          style={styles.NavBarSty}
          leftButton={
            <NavLeftView nav={this.props.nav} leftTitle="设置"/>
          }
          rightButton={
            <View style={styles.LeftView}>
              {
                this.state.isEdit?<TouchableOpacity style={[styles.touIcon, {paddingLeft: 10,paddingRight:10}]} onPress={this.editProject.bind(this)}>
                  <Text style={styles.rightNavText}>保存</Text>
                </TouchableOpacity>:null
              }
            </View>}/>
        {
          this.state.fetchSuccess?<InputScrollView showsVerticalScrollIndicator={false}>
            <View style={[taskStyles.whiteContainer,{paddingLeft:12,paddingRight:12}]}>
              <View style={taskStyles.CreatTaskRow}>
                <TextInput
                  ref="taskTitle"
                  clearButtonMode="while-editing"
                  underlineColorAndroid="transparent"
                  placeholder="项目名称"
                  defaultValue={this.state.projectName}
                  textAlign={'left'}
                  style={{height:40,fontSize: 14,textAlignVertical:'center'}}
                  onChangeText={(text) => this.setState({isEdit:true,projectName: text})}/>
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
              <ProjectMember nav={this.props.nav}/>
              <View style={{marginTop:10}}>
                {
                  this.state.status==4?<TouchableOpacity onPress={this.finishProject.bind(this,0)} activeOpacity={0.5}>
                    <View style={styles.settingBtn}>
                      <Text style={styles.BtnTitle}>取消归档</Text>
                    </View>
                  </TouchableOpacity>:<TouchableOpacity onPress={this.finishProject.bind(this,1)} activeOpacity={0.5}>
                    <View style={styles.settingBtn}>
                      <Text style={styles.BtnTitle}>归档项目</Text>
                    </View>
                  </TouchableOpacity>
                }
                <TouchableOpacity onPress={this.deleteProject.bind(this)} activeOpacity={0.5}>
                  <View style={styles.settingBtn}>
                    <Text style={styles.BtnTitle}>删除项目</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </InputScrollView>:<View style={styles.whiteContainer}/>
        }
         <BusyIndicator color='#EFF3F5' loadType={1} loadSize={10} textFontSize={15} overlayColor='#4A4A4A' textColor='white' />
      </View>
    );
  }
};

