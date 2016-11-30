import React, {Component} from 'react'
import {
  Platform,
  PixelRatio,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableNativeFeedback,
  TouchableHighlight,
  ToastAndroid,
  TouchableOpacity
} from 'react-native';

import styles from "./style";
import Icon from 'react-native-vector-icons/FontAwesome';
var statusBarSize = Platform.OS == 'ios' ? 10 : 0;
var active="AllActivities";
import AllActivities from '../activities/AllActivities.js'
//import AddressBook from '../addressbook/AddressBook.js'
//import Report from '../report/ReportMain.js'
import User from '../usercenter/UserCenterMain.js'
import Application from './Application.js';
//import KB from '../kb/KbMain.js'
//import Attendance from '../attendance/AttendanceMain.js'
import TabNavigator from 'react-native-tab-navigator';
import api from "../../network/ApiHelper";
import Task from '../task/TaskMain'
import Project from '../project/ProjectMain'
import JPush from 'react-native-jpush';
import Modal from './UpdateView'

export default class MainTabView  extends React.Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {
      taskNum:'',
      versionNum:"3.2",
      description:"",
      downloadAddress:"",
      selectedTab: this.props.selectedTab!=null?this.props.selectedTab:'Activities'
    }
  }

  componentDidMount() {
    var currUser=api.User.getCurrentUser();
    if(currUser!=null){
      JPush.setAlias(currUser.Id.toString());
    }
    this.getTaskNum();
    this.CheckUpdate();
    this.timer = setInterval(
      () => {
        this.getTaskNum();
      },
      36000
    );
  }
  CheckUpdate() {
    api.Util.checkUpdate(this.state.versionNum, 0)
      .then((res)=> {
        if (res.Type == 1) {
          this.setState({
            versionNum:res.Data.VersionNum,
            description:res.Data.Description,
            downloadAddress:res.Data.DownloadAddress});
          this.refs.updateModal.openModal();
        }
      })
  }
  getTaskNum(){
    api.Task.unreadTaskCount()
      .then((num)=>{
        if(num.Type==1){
          if(num.Data!=0){
            if(num.Data!=this.state.taskNum){
              if(this.refs.TabNav){
                this.setState({taskNum:num.Data})
              }
            }
          }
        }
      }).catch((err)=>{})
  }
  changeNum(){
    let num=Number(this.state.taskNum);
    if(num<=0){
      this.setState({taskNum:""})
    }else{
      this.setState({taskNum:this.state.taskNum-1})
    }

  }
  render() {

    return (
      <View style={{flex:1}}>
        <TabNavigator>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'Activities'}
            title="信息"
            renderIcon={
            () =><Icon
            name='comments'
            size={27}
            style={{height:27}}
            color='#656468'
            />}
            renderSelectedIcon={() =>
            <Icon
            name='comments'
            size={28}
            style={{height:28}}
            color='#3b5998'
            />}
            titleStyle={{fontSize:12}}
            tabStyle={{height:53}}
            onPress={() => this.setState({ selectedTab: 'Activities' })}>
            <AllActivities  nav={this.props.nav}/>
          </TabNavigator.Item>



          <TabNavigator.Item
            selected={this.state.selectedTab === 'Task'}
            title="任务"
            badgeText={this.state.taskNum}
            renderIcon={
            () =><Icon
              name='tasks'
              size={27}
              style={{height: 27}}
              color='#656468'
            />}
            renderSelectedIcon={() =>
            <Icon
              name='tasks'
              size={28}
              style={{height: 28}}
              color='#3b5998'
            />}
            titleStyle={{fontSize: 12}}
            tabStyle={{height:53}}
            onPress={() => this.setState({selectedTab: 'Task'})}>
            <Task reloadNum={this.changeNum.bind(this)} nav={this.props.nav}/>
          </TabNavigator.Item>

          <TabNavigator.Item
            selected={this.state.selectedTab === 'Project'}
            title="项目"
            renderIcon={
            () =><Icon
              name='list-alt'
              size={27}
              style={{height: 30}}
              color='#656468'
            />}
            renderSelectedIcon={() =>
            <Icon
              name='list-alt'
              size={28}
              style={{height: 30}}
              color='#3b5998'
            />}
            titleStyle={{fontSize: 12}}
            tabStyle={{height:53}}
            onPress={() => this.setState({selectedTab: 'Project'})}>
           <Project nav={this.props.nav}/>
          </TabNavigator.Item>




          <TabNavigator.Item
            selected={this.state.selectedTab === 'Application'}
            title="应用"
            renderIcon={
            () =><Icon
            name='th-large'
            size={27}
            style={{height:27}}
            color='#656468'
            />}
            renderSelectedIcon={() =>
            <Icon
            name='th-large'
            size={28}
            style={{height:28}}
            color='#3b5998'
            />}
            titleStyle={{fontSize:12}}
            tabStyle={{height:53}}
            onPress={() => this.setState({ selectedTab: 'Application' })}>
             <Application nav={this.props.nav}/>
          </TabNavigator.Item>


          <TabNavigator.Item
            selected={this.state.selectedTab === 'UserCenter'}
            title="个人"
            renderIcon={
            () =><Icon
            name='user'
            size={27}
            style={{height:27}}
            color='#656468'
            />}
            renderSelectedIcon={() =>
            <Icon
            name='user'
            size={28}
            style={{height:28}}
            color='#3b5998'
            />}
            titleStyle={{fontSize:12}}
            tabStyle={{height:53}}
            onPress={() => this.setState({ selectedTab: 'UserCenter' })}>
             <User nav={this.props.nav}/>
          </TabNavigator.Item>


        </TabNavigator>
        <Modal ref="updateModal" description={this.state.description} versionNum={this.state.versionNum} downloadAddress={this.state.downloadAddress}/>
      </View>
    );
  }
}

