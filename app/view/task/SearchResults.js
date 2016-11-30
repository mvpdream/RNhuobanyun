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
  Dimensions
} from 'react-native';
import styles from "./style";
import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons'
import Icons from 'react-native-vector-icons/FontAwesome';
import NavLeftView from '../common/NavLeftView'
var {height, width} = Dimensions.get('window');
import api from "../../network/ApiHelper";
var BusyIndicator = require('react-native-busy-indicator');
var loaderHandler = require('react-native-busy-indicator/LoaderHandler');

import TaskListCell from './TaskListCell'
var listViewData = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});


export default class SearchResults extends Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {
      taskList: listViewData.cloneWithRows({}),
      hasTaskData:true
    };
  };
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.getData();
    });
  }
  getData(){
    loaderHandler.showLoader("请稍等。。。");
    InteractionManager.runAfterInteractions(() => {
      api.Task.getSearchTasks(this.props.conditions.keywords,this.props.conditions.userId,this.props.conditions.depId)
        .then((res)=>{
          loaderHandler.hideLoader();
          if(res.Type==1){
            if(res.Data.length!=0){
              this.setState({taskList:listViewData.cloneWithRows(res.Data)});
            }else{
              this.setState({hasTaskData:false})
            }
          }else{
            ToastAndroid.show("获取数据失败",ToastAndroid.SHORT);
            this.setState({hasTaskData:false})
          }
        })
    });
  }
  taskItem(item, sectionID, rowID) {
    return (<TaskListCell ref="cell" rowID={rowID} key={rowID} item={item} nav={this.props.nav}/>)
  }
  render() {
    return (
      <View style={styles.whiteContainer}>
        <NavigationBar
          style={styles.NavBarSty}
          leftButton={
            <NavLeftView nav={this.props.nav} leftTitle="搜索任务"/>
          }
        />
        <View style={styles.container}>
          <View style={styles.conditions}>
            <Text style={[styles.Title,{width:width-25}]}>
              搜索条件: {this.props.conditions.keywords+" "+this.props.conditions.userName+" "+this.props.conditions.depName}
            </Text>
          </View>
          <View style={{flex:1,marginTop:20}}>

            {!this.state.hasTaskData ?
              <View style={styles.noDataView}>
                <Icons
                  name="exclamation-circle"
                  size={50}
                  color="#717171"
                />
                <Text style={styles.noruleViewText}>暂无相关数据</Text>
              </View> : <ListView
              dataSource={this.state.taskList}
              ref="list"
              keyboardShouldPersistTaps={true}
              removeClippedSubviews={false}
              enableEmptySections={true}
              renderRow={this.taskItem.bind(this)}
            />
            }
          </View>
        </View>

        <BusyIndicator color='#EFF3F5' loadType={1} loadSize={10} textFontSize={15} overlayColor='#4A4A4A' textColor='white' />
      </View>
    );
  }
};

