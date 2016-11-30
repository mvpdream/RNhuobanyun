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
  ActivityIndicator,
  InteractionManager,
  RefreshControl,
  ProgressBarAndroid,
  Alert,
  Modal,
  Dimensions
} from 'react-native';
import styles from "./style";
import Icons from 'react-native-vector-icons/FontAwesome'
import api from "../../network/ApiHelper";
var oneData = [];
var firstLoad=false;//是否是第一次加载
var BusyIndicator = require('react-native-busy-indicator');
var loaderHandler = require('react-native-busy-indicator/LoaderHandler');

import TaskListCell from './TaskListCell'
var listViewData = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});
import _ from 'lodash'
import ActionSheet from 'react-native-actionsheet';
let cellItem;
const CANCEL_INDEX = 0;


export default class TaskList extends Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {
      page: 1,
      AllData: [],
      oneData: [],
      hasMore: false,//是否可以加载更多
      taskList: listViewData.cloneWithRows({}),
      ishavedata: false,
      isRefreshControl: false,
      hasTaskData: true,
      stages:[],
      button:['取消'],
      buttons:['取消']
    };
  };

  componentDidMount() {
    this.state.AllData = [];
    this.state.page = 1;
    firstLoad = true;
    InteractionManager.runAfterInteractions(() => {
      loaderHandler.showLoader("请稍等。。。");
      if(this.props.stagetId!=null){
        this.getStageTaskLists(this.props.stagetId);
        this.getProjectStages();
      }else{
        this.getLists(this.props.taskType);
      }

    });
  }
  getProjectStages(){
    api.Project.getTaskStage(this.props.project.projectId)
      .then((res)=>{
        if(res.Type==1){
          if(res.Data.length!=0){
            this.setState({
              stages:res.Data
            })
          }
        }else{
          ToastAndroid.show('获取失败',ToastAndroid.SHORT);
        }
      })
  }
  getLists(type){
    api.Task.myTaskFilter(type,this.state.page)
      .then((resData)=>{
        loaderHandler.hideLoader();
        if(resData.Type==1){
          if (resData.Data && resData.Data.length == 0 && firstLoad) {
            //第一次加载，且没有数据的时候
            this.setState({hasTaskData: false});
          }
          if (this.state.AllData.length == 0 && firstLoad) {
            //第一次加载有数据
            this.state.AllData = resData.Data;
          }
          if (this.state.AllData.length > 0 && this.state.AllData.length < 5) {
            //数据小于等于5条
            this.setState({ishavedata: false,hasMore: false, page: 1});
          }
          if (resData.Data && resData.Data.length != 0) {
            //有数据
            this.setState({hasTaskData: true})
          }
          if (!firstLoad) {
            //不是第一次加载,concat数组组成新的数据
            var oldDataLen = this.state.AllData.length;
            this.state.AllData = this.state.AllData.concat(resData.Data);
            if (this.state.AllData.length == oldDataLen) {
              ToastAndroid.show("没有数据咯",ToastAndroid.SHORT);
              this.setState({
                ishavedata: false,
                isRefreshControl: false,
                hasMore: false,
                taskList: listViewData.cloneWithRows(this.state.AllData)
              });
              return;
            }
          }
          this.setState({
            ishavedata: false,
            isRefreshControl: false,
            taskList: listViewData.cloneWithRows(this.state.AllData)
          });
          if (this.refs.list && this.state.AllData.length > 0 && this.state.AllData.length <= 5) {
            this.refs.list.scrollTo({x: 0, y: 0, animated: false});
          }
        }else{
          this.setState({
            isRefreshControl: false
          });
        }
      })
  }
  getStageTaskLists(stagetId){
    api.Project.getStageTasks(stagetId,this.state.page)
      .then((resData)=>{
        loaderHandler.hideLoader();
        if(resData.Type==1){
          if (resData.Data && resData.Data.length == 0 && firstLoad) {
            //第一次加载，且没有数据的时候
            this.setState({hasTaskData: false});
          }
          if (this.state.AllData.length == 0 && firstLoad) {
            //第一次加载有数据
            this.state.AllData = resData.Data;
          }
          if (this.state.AllData.length > 0 && this.state.AllData.length < 5) {
            //数据小于等于5条
            this.setState({ishavedata: false,hasMore: false, page: 1});
          }
          if (resData.Data && resData.Data.length != 0) {
            //有数据
            this.setState({hasTaskData: true})
          }
          if (!firstLoad) {
            //不是第一次加载,concat数组组成新的数据
            var oldDataLen = this.state.AllData.length;
            this.state.AllData = this.state.AllData.concat(resData.Data);
            if (this.state.AllData.length == oldDataLen) {
              ToastAndroid.show("没有数据咯",ToastAndroid.SHORT);
              this.setState({
                ishavedata: false,
                isRefreshControl: false,
                hasMore: false,
                taskList: listViewData.cloneWithRows(this.state.AllData)
              });
              return;
            }
          }
          this.setState({
            ishavedata: false,
            isRefreshControl: false,
            taskList: listViewData.cloneWithRows(this.state.AllData)
          });
          if (this.refs.list && this.state.AllData.length > 0 && this.state.AllData.length <= 5) {
            this.refs.list.scrollTo({x: 0, y: 0, animated: false});
          }
        }else{
          this.setState({
            isRefreshControl: false
          });
        }
      })
  }
  reloadStageTaskList(){
    api.Project.getStageTasks(this.props.stagetId,1)
      .then((resData)=> {
        if (resData.Type == 1) {
          if (resData.Data && resData.Data.length != 0) {
            this.setState({hasTaskData: true})
          }
          if (resData.Data && resData.Data.length == 0) {
            this.setState({hasTaskData: false})
          }
          var temp = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
          this.setState({
            ishavedata: false,
            isRefreshControl: false,
            taskList: temp.cloneWithRows(resData.Data)
          });
          this.state.AllData = resData.Data;
          if (this.refs.list && this.state.AllData.length > 0 && this.state.AllData.length <= 5) {
            this.refs.list.scrollTo({x: 0, y: 0, animated: false});
          }
        } else {
          this.setState({
            isRefreshControl: false
          });
        }

      })
  }
  reloadStageTaskListForId(stagetId){
    api.Project.getStageTasks(stagetId,1)
      .then((resData)=> {
        if (resData.Type == 1) {
          if (resData.Data && resData.Data.length != 0) {
            this.setState({hasTaskData: true})
          }
          if (resData.Data && resData.Data.length == 0) {
            this.setState({hasTaskData: false})
          }
          var temp = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
          this.setState({
            ishavedata: false,
            isRefreshControl: false,
            taskList: temp.cloneWithRows(resData.Data)
          });
          this.state.AllData = resData.Data;
          if (this.refs.list && this.state.AllData.length > 0 && this.state.AllData.length <= 5) {
            this.refs.list.scrollTo({x: 0, y: 0, animated: false});
          }
        } else {
          this.setState({
            isRefreshControl: false
          });
        }

      })
  }
  reloadTaskList(type){
    api.Task.myTaskFilter(type, 1)
      .then((resData)=> {
        if (resData.Type == 1) {
          if (resData.Data && resData.Data.length != 0) {
            this.setState({hasTaskData: true})
          }
          if (resData.Data && resData.Data.length == 0) {
            this.setState({hasTaskData: false})
          }
          var temp = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
          this.setState({
            ishavedata: false,
            isRefreshControl: false,
            taskList: temp.cloneWithRows(resData.Data)
          });
          this.state.AllData = resData.Data;
          if (this.refs.list && this.state.AllData.length > 0 && this.state.AllData.length <= 5) {
            this.refs.list.scrollTo({x: 0, y: 0, animated: false});
          }
          this.props.isLoadFinish(true);
        } else {
          this.setState({
            isRefreshControl: false
          });
          this.props.isLoadFinish(true);
        }

      })
  }
  reloadList(){
    if(this.props.stagetId){
      this.reloadStageTaskList();
    }else{
      api.Task.myTaskFilter(this.props.taskType, 1)
        .then((resData)=> {
          if (resData.Type == 1) {
            if (resData.Data && resData.Data.length != 0) {
              this.setState({hasTaskData: true})
            }
            var temp = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
            this.setState({
              ishavedata: false,
              isRefreshControl: false,
              taskList: temp.cloneWithRows(resData.Data)
            });
            this.state.AllData = resData.Data;
            if (this.refs.list && this.state.AllData.length > 0 && this.state.AllData.length <= 5) {
              this.refs.list.scrollTo({x: 0, y: 0, animated: false});
            }
          } else {
            this.setState({
              isRefreshControl: false
            });
          }

        })
    }
  }
  renderFooter() {
    return (
    this.state.ishavedata?<View ref='footerView' style={styles.footerView}>
      <View style={{width:30,height:30,justifyContent: 'center'}}> 
      <ActivityIndicator animating={true} color='blue'/>
      </View>
      <Text style={styles.footerText}>
        数据加载中……
      </Text>
    </View>:null);
  }
  onScroll() {
    this.state.hasMore = true;
  }
  onEndReached(type) {
    if (this.state.hasMore) {
      this.state.page++;
      firstLoad = false;
      this.setState({ishavedata: true});
      if(this.props.stagetId){
        this.getStageTaskLists(this.props.stagetId)
      }else{
        switch (type) {
          case 1://我负责的
            this.getLists(1);
            break;
          case 4://我参与的
            this.getLists(4);
            break;
          case 8://我旁观的
            this.getLists(8);
            break;
          default://我创建的
            this.getLists();
            break;
        }
      }
    }
  };
  onRefresh(type) {
    firstLoad = false;
    oneData = [];
    this.setState({
      AllData: [],
      hasMore: true,
      isRefreshControl: true
    });
    this.state.page = 1;
    firstLoad = true;
    if(this.props.stagetId){
      this.getStageTaskLists(this.props.stagetId)
    }else{
      switch (type) {
        case 1://我负责的
          this.getLists(1);
          break;
        case 4://我参与的
          this.getLists(4);
          break;
        case 8://我旁观的
          this.getLists(8);
          break;
        default://我创建的
          this.getLists();
          break;
      }
    }
  }
  getItem(item){
    cellItem=item;
    this.state.buttons.push('复制任务');
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
    if(item.Task_Move){
      this.state.buttons.push('移动任务')
    }
    if(item.Task_Recycle){
      this.state.buttons.push('删除任务')
    }
    if(item.Task_Quit){
      this.state.buttons.push('退出任务')
    }
    this.setState({
      buttons:this.state.buttons
    })
    this.ActionSheet.show();
  }
  copyTask(){
    let copyTaskData={
      taskTitle:cellItem.Title,
      taskDescribe:cellItem.Description,
    };
    this.props.nav.push({
      id:'CreatTask',
      isChild:false,
      stages:this.state.stages,
      project:this.props.project,
      reloadList:this.refreshList.bind(this),
      copyTaskData:copyTaskData
    });
  }
  refreshList(){
    this.reloadStageTaskList();
  }
  setList(typeName,status){
    var currentData = this.state.AllData;
    loaderHandler.hideLoader();
    let tempIds = _.pluck(currentData, 'Id');
    let _index = tempIds.indexOf(cellItem['Id']);
    if (_index > -1) {
      switch (typeName) {
        case "restart":
        case "finish":
          currentData[_index].Status = status;
          break;
        case "delete":
          currentData.splice(_index, 1);
          break;
      }
    this.setState({
      taskList: listViewData.cloneWithRows(currentData)
    });
  }
  }
  restartTask(){
    loaderHandler.showLoader("请稍等。。。");
    api.Task.restartTask(cellItem.Id)
      .then((res)=>{
        if(res.Type==1){
          this.setList("restart",res.Data)
        }else{
          loaderHandler.hideLoader();
          ToastAndroid.show(res.Data,ToastAndroid.SHORT);
        }
      })
  }
  finishTask(){
    loaderHandler.showLoader("请稍等。。。");
    api.Task.finishTask(cellItem.Id)
      .then((res)=>{
        if(res.Type==1){
          this.setList("finish",res.Data)
        }else{
          loaderHandler.hideLoader();
          ToastAndroid.show(res.Data,ToastAndroid.SHORT);
        }
      })
  }
  quitTask(){
    loaderHandler.showLoader("请稍等。。。");
    api.Task.quitTask(cellItem.Id)
      .then((res)=>{
        if(res.Type==1){
          loaderHandler.hideLoader();
            ToastAndroid.show("退出成功",ToastAndroid.SHORT);
        }else{
          loaderHandler.hideLoader();
          ToastAndroid.show(res.Data,ToastAndroid.SHORT);
        }
      })
  }
  deleteTask(){
    loaderHandler.showLoader("请稍等。。。");
    api.Task.recycleTask(cellItem.Id)
      .then((res)=>{
        if(res.Type==1){
          this.setList("delete");
        }else{
          loaderHandler.hideLoader();
          ToastAndroid.show(res.Data,ToastAndroid.SHORT);
        }
      })
  }
  moveTask(){
    this.state.button = ['取消'];
    let names = _.pluck(this.state.stages, 'Name');
    this.state.button= this.state.button.concat(names);
    this.setState({button:this.state.button});
    this.ActionSheets.show();
  }
  _handleMovePress(index){
    if(index!=0){
      let stageName=this.state.button[index];//获取到选中的名字
      let ids=_.pluck(this.state.stages, 'Name');//当前项目所有阶段的name
      let selectIndex=ids.indexOf(stageName);//选中项在集合中的位置
      if(selectIndex!=-1){
        let selectArr=this.state.stages[selectIndex];
        loaderHandler.showLoader("请稍等。。。");
        api.Project.sortTask(cellItem.Id,selectArr.Id)
          .then((res)=>{
            loaderHandler.hideLoader();
            if(res.Type==1){
              if(selectArr.Id!=this.props.stagetId){
                this.setList("delete");
                this.props.reloadMoveList(selectArr.Id);
              }
            }else{
              ToastAndroid.show(res.Data,ToastAndroid.SHORT);
            }
          })
      }else{

      }
    }
  }
  _handlePress(index){
    let menuName=this.state.buttons[index];
    switch(menuName){
      case "移动任务":
        this.moveTask();
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
  renderContent() {
    let ActButtons=this.state.buttons;
    return (
      <View style={[styles.container,{marginTop:8}]}>
      {
        this.state.buttons.length!=1? <ActionSheet 
                    ref={(o) => this.ActionSheet = o}
                    title="操作"
                    options={ActButtons}
                    cancelButtonIndex={CANCEL_INDEX}
                    onPress={this._handlePress.bind(this)}
                />:null
      }
       {
        this.state.button.length!=1? <ActionSheet 
                    ref={(o) => this.ActionSheets = o}
                    title="移动到"
                    options={this.state.button}
                    cancelButtonIndex={CANCEL_INDEX}
                    onPress={this._handleMovePress.bind(this)}
                />:null
      }
      <ListView
        dataSource={this.state.taskList}
        ref="list"
        keyboardShouldPersistTaps={true}
        removeClippedSubviews={false}
        enableEmptySections={true}
        renderRow={this.taskItem.bind(this)}
        onEndReached={this.onEndReached.bind(this, this.props.stagetId==null?this.props.taskType:this.props.stagetId)}
        onEndReachedThreshold={5}
        onScroll={this.onScroll.bind(this)}
        renderFooter={this.renderFooter.bind(this)}
        refreshControl={
          <RefreshControl
              refreshing={this.state.isRefreshControl}
              onRefresh={this.onRefresh.bind(this, this.props.stagetId==null?this.props.taskType:this.props.stagetId)}
              title="Loading..."
              colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
            />
        }
      />
      {!this.state.hasTaskData ?
        <View style={styles.noDataView}>
          <Icons
            name="exclamation-circle"
            size={50}
            color="#717171"
          />
          <Text style={styles.noruleViewText}>暂无任务</Text>
        </View> : null
      }
      </View>
    )
  }

  taskItem(item, sectionID, rowID) {
    return (
      <TaskListCell
        ref="cell"
        callback={this.props.project?this.getItem.bind(this):()=>{}}
        stages={this.state.stages}
        rowID={rowID}
        key={rowID}
        item={item}
        nav={this.props.nav}
        project={this.props.project}
        reloadList={this.reloadList.bind(this)}/>)
  }

  render() {
    return (
      <View style={{flex: 1}}>
        {this.renderContent()}
        <BusyIndicator color='#EFF3F5' loadType={1} loadSize={10} textFontSize={15} overlayColor='#4A4A4A' textColor='white' />
      </View>

    );
  }
};

