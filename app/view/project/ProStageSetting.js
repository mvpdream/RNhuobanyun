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
  Keyboard,
  Dimensions
} from 'react-native';
import styles from "./style";
import actstyles from "../activities/style";
import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons'
import Icons from 'react-native-vector-icons/FontAwesome';
var {height, width} = Dimensions.get('window');
import api from "../../network/ApiHelper";
var BusyIndicator = require('react-native-busy-indicator');
var loaderHandler = require('react-native-busy-indicator/LoaderHandler');
import NavLeftView from '../common/NavLeftView';
import _ from 'lodash'
var DraggableList = require('react-native-draggablelist');
import InputScrollView from 'react-native-inputscrollview'
let Ids=[];
let stageTemps=[];
let selectItem=[];
import Prompt from 'react-native-prompt';
let _this;
let cellThis;

class Cell extends Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {
    };
    cellThis=this;
  }
  removeStage(){
    let ids=_.pluck(_this.state.stages,"Id");
    Alert.alert(
      '提示',
      '确定删除该任务阶段？',
      [
        {text: '取消'},
        {
          text: '确定', onPress: () => {
         loaderHandler.showLoader("请稍等。。。");
          api.Project.deleteStage(_this.props.project&&_this.props.project.projectId,this.props.rowData.Id)
            .then((res)=>{
              if(res.Type==1){
                let index=ids.indexOf(this.props.rowData.Id);
                if(index>=0){
                  _this.state.stages.splice(index,1);
                  stageTemps=_this.state.stages;
                }
                _this.props.reloadData();
               loaderHandler.hideLoader;
                _this.setState({
                  stages:_this.state.stages
                })
              }else{
                loaderHandler.hideLoader;
                ToastAndroid.show(res.Data);
              }
            });
        }
        }
      ]
    );

  }
  render(){
    return(
    <View style={styles.dragItem}>
      <View style={styles.dragItemLeft}>
        <TouchableOpacity>
        <Icons
          name="bars"
          size={25}
          color='gray'
          {...this.props.dragHandlers}
        />
        </TouchableOpacity>
        <View style={[styles.dragItemRow,{height:35}]}>
          <TextInput
            clearButtonMode="while-editing"
            underlineColorAndroid="transparent"
            defaultValue={this.props.rowData.Name}
            onChangeText={(text) => {
              let index=stageTemps.indexOf(this.props.rowData);
              stageTemps[index].Name=text;
              _this.setState({isEdit:true})}
            }
            style={{width:width-95,height:40,fontSize: 14,marginBottom:-20,textAlignVertical:'bottom'}}
          />
        </View>
      </View>
      <TouchableOpacity onPress={this.removeStage.bind(this)}>
        <View style={styles.iconContainer}>
          <Icons
            name="trash-o"
            size={23}
          />
        </View>
      </TouchableOpacity>
    </View>
    )
  }
}
export default class ProStageSetting extends Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {
      isEdit:false,
      stages:[],
      promptVisible:false,
      creatFlag: false
    };
    _this=this;
    
  };
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      loaderHandler.showLoader("请稍等。。。");
      this.getData();
    });
   
  }
  getData(){
    api.Project.getTaskStage(this.props.project.projectId)
      .then((res)=>{
        if(res.Type==1){
          loaderHandler.hideLoader();
          if(res.Data.length!=0){
            this.setState({
              stages:res.Data
            });
            stageTemps=res.Data;
          }
        }else{
          ToastAndroid.show('获取失败',ToastAndroid.SHORT);
        }
      })
  }
  searchTask(){

  }
  reloadList(){

  }
  addStage(){
    this.setState({promptVisible:true})
  }
  creatStage(value) {
    //确认
    value = value.trim();
    if (value.length == 0) {
      ToastAndroid.show('输入项中不能为空',ToastAndroid.SHORT);
      return;
    }
    if(value.length >= 32){
      ToastAndroid.show('输入项中的字符长度不能超出32个字符',ToastAndroid.SHORT);
      return;
    }
    //防止用户重复点击
    this.setState({creatFlag: true});
    loaderHandler.showLoader("请稍等。。。");
    api.Project.createStage(this.props.project&&this.props.project.projectId,value)
      .then((res)=> {
        this.setState({creatFlag: false});
        if (res.Type == 1) {
          this.state.stages.push(res.Data);
          stageTemps=this.state.stages;
          this.props.reloadData();
           loaderHandler.hideLoader();
          this.setState({
            stages:this.state.stages,
            promptVisible: false
          });
        }
        else {
          ToastAndroid.show(res.Data,ToastAndroid.SHORT);
           loaderHandler.hideLoader();
        }
      })
  }
  saveStages(){
    let stageArr=[];
    let flag=false;
    let ids=_.pluck(stageTemps,"Id");
    for(var i=0;i<stageTemps.length;i++){
        let index=ids.indexOf(ids[i]);
        if(index>=0){
          if(stageTemps[index].Name==""){
            ToastAndroid.show("第"+(index+1)+"项不能为空",ToastAndroid.SHORT);
            flag=true;
          }
          if(stageTemps[index].Name.length>=32){
            ToastAndroid.show("第"+(index+1)+"项长度不能超出32个字符",ToastAndroid.SHORT);
            flag=true;
          }
          stageArr.push(stageTemps[index].Name);
        }
    }
    if(!flag){
      loaderHandler.showLoader("请稍等。。。");
      api.Project.editStage(this.props.project.projectId,ids.join(";"),stageArr.join(";"))
        .then((res)=>{
          if(res.Type==1){
            // this.props.reloadData();
            loaderHandler.hideLoader();
            this.setState({isEdit:false});
            this.props.nav.pop();
            this.props.nav.replace({
               id: 'ProjectTabView',
                projectId:this.props.project.projectId,
                projectName:this.props.project.projectName,
            })
          }else{
            loaderHandler.hideLoader();
          }
          ToastAndroid.show(res.Data,ToastAndroid.SHORT);
        })
    }
  }
  _onMove(ids){
    Ids=ids;
    let newArr=[];
    for(var i=0;i<ids.length;i++){
      let tempIds=_.pluck(stageTemps,"Id");
      let index=tempIds.indexOf(Number(ids[i]));
      if(index!=-1){
        newArr.push(stageTemps[index]);
      }
    }
    if(newArr.length!=0){
      stageTemps=newArr;
    }
    this.setState({isEdit:true})
  };
  render() {
    return (
      <View style={styles.whiteContainer}>
        <NavigationBar
          style={styles.NavBarSty}
          leftButton={
            <NavLeftView nav={this.props.nav} leftTitle={"任务分组设置"}/>
          }
          rightButton={
            <View style={styles.LeftView}>
              {
                this.state.isEdit?<TouchableOpacity style={[styles.touIcon, {paddingLeft: 10,paddingRight:10}]} onPress={this.saveStages.bind(this)}>
                  <Text style={styles.rightNavText}>保存</Text>
                </TouchableOpacity>:null
              }
              <TouchableOpacity style={styles.navIconTou} onPress={this.addStage.bind(this)}>
                <Icon
                  name='ios-add'
                  size={30}
                  color='white'
                />
              </TouchableOpacity>
            </View>}/>
            <InputScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.container,{flex:1}]}>
          <View style={[styles.whiteContainer,{marginTop:10}]}>
            <View style={styles.dragListView}>
            <DraggableList
              component={Cell}
              onMove={this._onMove.bind(this)}
              toggleScroll={this._toggleScroll}
              dataSource={this.state.stages}
            />
            </View>
          </View>
        </View>
        </InputScrollView>
        <Prompt
          ref="prompt"
          title="新建任务分组"
          visible={this.state.promptVisible}
          submitText="确定"
          cancelText="取消"
          onCancel={()=>{this.setState({promptVisible: false})}}
          onSubmit={this.state.creatFlag ? ()=> {
          } : this.creatStage.bind(this)}/>
       <BusyIndicator color='#EFF3F5' loadType={1} loadSize={10} textFontSize={15} overlayColor='#4A4A4A' textColor='white' />
      </View>
    );
  }
};

