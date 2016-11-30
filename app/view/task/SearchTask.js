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
  InteractionManager,
  Picker,
  Dimensions
} from 'react-native';
import styles from "./style";
import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons'
import NavLeftView from '../common/NavLeftView'
var {height, width} = Dimensions.get('window');
import api from "../../network/ApiHelper";
import _ from 'lodash'
import Icons from 'react-native-vector-icons/FontAwesome';
var BusyIndicator = require('react-native-busy-indicator');
var loaderHandler = require('react-native-busy-indicator/LoaderHandler');

var cancleUserArr={
  "Id":0,
  "Name": "选择我的下属"
};
var cancleDepArr={
  "Id":0,
  "Name": "选择我的部门"
};

export default class SearchTask extends Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {
      users:[],
      deps:[],
      userId:0,
      depId:0,
      userName:"",
      depName:"",
      keywords:"",
      fetchSuccess:false
    };
  };
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.getData();
    });
  }
  getData(){
    loaderHandler.showLoader("请稍等。。。");
    api.Task.getUnderlingAndDepartment()
      .then((res)=>{
        loaderHandler.hideLoader();
        if(res.Type==1){
          res.Data.subordinate.splice(0, 0, cancleUserArr);
          res.Data.deps.splice(0, 0, cancleDepArr);
          this.setState({
            fetchSuccess:true,
            users:res.Data.subordinate?res.Data.subordinate:[],
            deps:res.Data.deps?res.Data.deps:[]
          });
        }else{
          ToastAndroid.show("数据获取失败",ToastAndroid.SHORT);
        }
      });
  }
  searchTask(){
    let conditions={
      keywords:this.state.keywords,
      userId:this.state.userId,
      userName:this.state.userName,
      depId:this.state.depId,
      depName:this.state.depName
    };
    this.props.nav.push({
      id:'SearchResults',
      conditions:conditions
    })
  }
  selectDepartment(dep){
    if(dep!="选择我的部门"){
      var depData = _.pluck(this.state.deps, "Name");
      let depIndex=depData.indexOf(dep,depData);
      let newDep=this.state.deps[depIndex];
      if(newDep!=null){
        this.setState({depId:newDep["Id"],depName:newDep["Name"]})
      }
    }else{
      this.setState({depId:0,depName:""})
    }
  }
  selectSubordinate(sub){
    if(sub!="选择我的下属"){
      var userData = _.pluck(this.state.users, "Name");
      let userIndex=userData.indexOf(sub,userData);
      let newUser=this.state.users[userIndex];
      if(newUser!=null){
        this.setState({userId:newUser["Id"],userName:newUser["Name"]})
      }
    }else{
      this.setState({userId:0,userName:""})
    }
  }
  render() {
    return (
      <View style={[styles.container,{backgroundColor:'#ffffff'}]}>
        <NavigationBar
          style={styles.NavBarSty}
          leftButton={
            <NavLeftView nav={this.props.nav} leftTitle="搜索任务"/>
          }
          rightButton={
            <TouchableOpacity style={styles.navRightText} onPress={this.searchTask.bind(this)}>
              <Text numberOfLines={1} style={styles.rightNavText}>搜索</Text>
            </TouchableOpacity>
          }/>
        {this.state.fetchSuccess?<View style={styles.whiteContainer}>
          <View style={styles.searchView}>
            <View style={styles.taskName}>
              <TextInput
                ref="textname"
                underlineColorAndroid="transparent"
                placeholder="输入任务名称"
                textAlignVertical={'center'}
                textAlign={'left'}
                style={styles.TextInputs}
                onChangeText={(text) => this.setState({keywords: text})}/>
            </View>

            {this.state.users.length!=1?<View style={styles.taskName}>
              <Picker
                selectedValue={this.state.userName}
                style={{width:width-60}}
                onValueChange={this.selectSubordinate.bind(this)}>
                {this.state.users.map((item, index)=> {
                  return (
                    <Picker.Item
                      key={index}
                      label={item.Name}
                      value={item.Name}/>
                  )
                })}
              </Picker>
            </View>:<View/>}

            {this.state.deps.length!=1? <View style={styles.taskName}>
              <Picker
                selectedValue={this.state.depName}
                style={{width:width-60}}
                onValueChange={this.selectDepartment.bind(this)}>
                {this.state.deps.map((item, index)=> {
                  return (
                    <Picker.Item
                      key={index}
                      label={item.Name}
                      value={item.Name}/>
                  )
                })}
              </Picker>
            </View>:<View/>}

          </View>
        </View>:<View style={styles.whiteContainer}/>}
        <BusyIndicator color='#EFF3F5' loadType={1} loadSize={10} textFontSize={15} overlayColor='#4A4A4A' textColor='white' />
      </View>
    );
  }
};

