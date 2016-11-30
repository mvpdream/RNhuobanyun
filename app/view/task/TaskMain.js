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
  InteractionManager,
  Dimensions
} from 'react-native';
import styles from "./style";
import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons'
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TaskList from './TaskList'
import MyTaskList from './MyTaskList'
var isLoaderFun;
import NavLeftView from '../common/NavLeftView'
export default class TaskMain extends Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {

    };
  };

  componentDidMount() {

  }
  searchTask(){
    this.props.nav.push({id:'SearchTask'})
  }
  addTask(){
    /*参考信息动态进行列表刷新*/
    this.props.nav.push({id:'CreatTask',isChild:false,reloadList:this.reloadList.bind(this)})
  }
  reloadList(isLoaderOk){
    if(isLoaderOk!=null){isLoaderFun=isLoaderOk;}
    if(this.refs&&this.refs.scrollTab.state.currentPage){

      switch(this.refs.scrollTab.state.currentPage){
        case 0:
          this.refs.myTasks.reloadTaskList();//我的任务
          break;
        case 1:
          this.refs.asDirector.reloadTaskList(1);//我负责的
          break;
        case 2:
          this.refs.asPartner.reloadTaskList(4);//我参与的
          break;
        case 3:
          this.refs.asCreator.reloadTaskList();//我创建的
          break;
        case 4:
          this.refs.asOnlooker.reloadTaskList(8);//我旁观的
          break;
      }
    }else{
      this.refs.myTasks.reloadTaskList();//我的任务
    }


  }
  loadFinish(isload){
    if(isload){
      //列表刷新完成
      isLoaderFun(true);
    }
  }
  render() {
    const titleConfig = {
      title: '任务',
      tintColor: 'white'
    };
    return (
      <View style={styles.container}>
        <NavigationBar
          style={styles.NavBarSty}
          title={this.props.type==null?titleConfig:<View/>}
          leftButton={
            this.props.type==null?<View/>:<NavLeftView nav={this.props.nav} leftTitle={'任务'}/>
          }
          rightButton={
           <View style={styles.LeftView}>
              <TouchableOpacity style={styles.navLeftIcon} onPress={this.searchTask.bind(this)}>
                <Icon
                  name='md-search'
                  size={25}
                  color='white'
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.navLeftIcon} onPress={this.addTask.bind(this)}>
                <Icon
                  name='md-add'
                  size={25}
                  color='white'
                />
              </TouchableOpacity>
            </View>

            }/>
        <View style={{flex: 1}}>
          <ScrollableTabView
            ref="scrollTab"
            tabBarBackgroundColor='white'
            tabBarUnderlineColor='#3A83E1'
            tabBarActiveTextColor='#3A83E1'
            removeClippedSubviews={false}
            initialPage={0}>
            <View tabLabel='我的任务' style={{flex: 1}} nav={this.props.nav}>
              <MyTaskList ref="myTasks" nav={this.props.nav} isLoadFinish={this.loadFinish.bind(this)} reloadNum={this.props.reloadNum}/>
            </View>
            <View tabLabel='我负责的' style={{flex: 1}} nav={this.props.nav}>
              <TaskList ref='asDirector' nav={this.props.nav} taskType={1} isLoadFinish={this.loadFinish.bind(this)}/>
            </View>
            <View tabLabel='我参与的' style={{flex: 1}} nav={this.props.nav}>
              <TaskList ref='asPartner' nav={this.props.nav} taskType={4} isLoadFinish={this.loadFinish.bind(this)}/>
            </View>
            <View tabLabel='我创建的' style={{flex: 1}} nav={this.props.nav}>
              <TaskList ref='asCreator' nav={this.props.nav} isLoadFinish={this.loadFinish.bind(this)}/>
            </View>
            <View tabLabel='我旁观的' style={{flex: 1}} nav={this.props.nav}>
              <TaskList ref='asOnlooker' nav={this.props.nav} taskType={8} isLoadFinish={this.loadFinish.bind(this)}/>
            </View>
          </ScrollableTabView>
        </View>
      </View>
    );
  }
};

