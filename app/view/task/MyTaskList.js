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
  RefreshControl,
  Dimensions
} from 'react-native';
import styles from "./style";
import api from "../../network/ApiHelper";
import Icon from 'react-native-vector-icons/Ionicons'
import Icons from 'react-native-vector-icons/FontAwesome';
var BusyIndicator = require('react-native-busy-indicator');
var loaderHandler = require('react-native-busy-indicator/LoaderHandler');

import _ from 'lodash';
import TaskListCell from './TaskListCell'

var getSectionData = (dataBlob, sectionID) => {
  return dataBlob[sectionID];
};
var getRowData = (dataBlob, sectionID, rowID) => {
  return dataBlob[rowID];
};
var dataSource = new ListView.DataSource({
  getRowData: getRowData,
  getSectionHeaderData: getSectionData,
  rowHasChanged: (row1, row2) => row1 !== row2,
  sectionHeaderHasChanged: (s1, s2) => s1 !== s2
});
export default class MyTaskList extends Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {
      hasTaskData: true,
      isRefreshControl: false,
      taskData:[],
      allList: dataSource.cloneWithRowsAndSections({}, [], [])
    };
  };

  componentDidMount() {
    loaderHandler.showLoader("请稍等。。。");
    this.getDatas();
  }
  getDatas(){
    api.Task.myTasks()
      .then((res)=>{
        loaderHandler.hideLoader();
        if(res.Type==1){
          if(res.Data!=null){
            let newData = this.creatData(res.Data);
            this.setState({
              hasTaskData:true,
              taskData:res.Data,
              isRefreshControl: false,
              allList: dataSource.cloneWithRowsAndSections(newData.blobData, newData.sectionIds, newData.rowIds),
            });
          }else{
            this.setState({hasTaskData:false, isRefreshControl: false});
          }

        }else{
          this.setState({hasTaskData:false, isRefreshControl: false});
          ToastAndroid.show(res.Data,ToastAndroid.SHORT);
        }
      })
  }
  reloadTaskList(){
    api.Task.myTasks()
      .then((res)=>{
        loaderHandler.hideLoader();
        if(res.Type==1){
          if(res.Data!=null){
            let newData = this.creatData(res.Data);
            this.setState({
              hasTaskData:true,
              isRefreshControl: false,
              allList: dataSource.cloneWithRowsAndSections(newData.blobData, newData.sectionIds, newData.rowIds),
            });
          }else{
            this.setState({isRefreshControl: false,hasTaskData:false});
          }
          this.props.isLoadFinish(true);
        }else{
          this.setState({isRefreshControl: false,hasTaskData:false});
          ToastAndroid.show(res.Data,ToastAndroid.SHORT);
          this.props.isLoadFinish(true);
        }

      })
  }
  onRefresh(){
    this.setState({
      isRefreshControl:true
    });
    this.state.allList = dataSource.cloneWithRowsAndSections({}, [], []);
    this.getDatas();
  }
  creatData(Listdata) {
    var data = Listdata;
    var sectionIds = [];
    var rowIds = [];
    var blobData = {};
    var keys = _.keys(data);

    keys.forEach((o, i)=> {
      var sectionId = 'section' + i;
      sectionIds[sectionIds.length] = sectionId;
      blobData[sectionId] = o;
    });

    for (var i in keys) {
      var temp = data[keys[i]];
      var ids = [];
      for (var j = 0; j < temp.length; j++) {
        var id = 'S' + i + ',R' + j;
        blobData[id] = temp[j];
        ids[ids.length] = id;
      }
      rowIds[rowIds.length] = ids;
    }
    var dataItems = {
      blobData: blobData,
      sectionIds: sectionIds,
      rowIds: rowIds
    };
    return dataItems;
  }
  taskItem(item,sectionID) {
    if(this.state.taskData.length!=0){
      var keys = _.keys(this.state.taskData);
      if(keys.indexOf("新任务")!=-1){
        //有新任务
        return(<TaskListCell
          nav={this.props.nav}
          sectionID={sectionID}
          reloadList={this.getDatas.bind(this)}
          item={item}
          reloadNum={this.props.reloadNum}/>)
      }else{
        //没有新任务
        return(<TaskListCell nav={this.props.nav} sectionID={sectionID}
                             reloadList={this.getDatas.bind(this)}
                             item={item}
                            />)
      }
    }
  };

  renderSectionHeader(sectionData, sectionID) {
    return (
      <View style={{padding: 10, paddingLeft: 10, backgroundColor: '#dadada'}}>
        <Text style={{fontSize: 15, color: 'black'}}>
          {sectionData}
        </Text>
      </View>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.allList}
          enableEmptySections={true}
          removeClippedSubviews={false}
          renderRow={this.taskItem.bind(this)}
          renderSectionHeader={this.renderSectionHeader.bind(this)}
          refreshControl={
             <RefreshControl
                refreshing={this.state.isRefreshControl}
                onRefresh={this.onRefresh.bind(this)}
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
            <Text style={styles.noDataViewText}>暂无任务</Text>
          </View> : null
        }
        <BusyIndicator color='#EFF3F5' loadType={1} loadSize={10} textFontSize={15} overlayColor='#4A4A4A' textColor='white' />
      </View>
    );
  }
};

