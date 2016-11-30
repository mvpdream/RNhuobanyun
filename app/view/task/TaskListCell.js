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
let newTask=false;

export default class TaskListCell extends Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {

    };
  };

  componentDidMount() {

  }
  itemMenu(item) {
    if (item != null) {
      this.props.callback&&this.props.callback(item);
    }
  }
  taskDetail(taskId,sectionID){
    if(sectionID=="section0")
    {
      newTask=true
    }
    else{
      newTask=false
    }
    this.props.nav.push({
      id: 'TaskDetail',
      taskId:taskId,
      newTask:newTask,
      isChild:false,
      project:this.props.project&&this.props.project,
      stages:this.props.stages&&this.props.stages,
      reloadLists:this.reloadLists.bind(this),
      reloadNum:this.props.reloadNum,
    })
  }
  reloadLists(){
    this.props.reloadList();
  }
  render() {
    var item=this.props.item&&this.props.item;
    var icoName = "square-o";
    var iconColor = "#008000";
    switch(item&&item.Status){
      case 1://未启动
        icoName = "calendar";
        iconColor = "#999999";
        break;
      case 2://进行中
        icoName = "square-o";
        iconColor = "#008000";
        break;
      case 3://已超期
        icoName = "square";
        iconColor = "#ff0000";
        break;
      case 4://审核中
        icoName = "square";
        iconColor = "#ff9900";
        break;
      case 5://完成
      case 7:
        icoName = "check-square-o";
        iconColor = "#000000";
        break;
    }

    return (
      //onLongPress={this.itemMenu.bind(this, item)}
      <TouchableOpacity onPress={this.taskDetail.bind(this,item.Id,this.props.sectionID)} activeOpacity={0.5} onLongPress={this.itemMenu.bind(this, item)}>
        <View style={styles.taskListRow}>
          <View style={styles.listTopView}>
            <View style={styles.nameView}>
              <Icons
                name={icoName}
                size={20}
                color={iconColor}
              />
            </View>
            <View style={{flex:1,marginLeft:10}}><Text numberOfLines={1} style={styles.Title}>{item&&item.Title}</Text></View>
            <View style={styles.imgView}>
              <Image
                source={{uri: item&&item.Avatar}}
                style={styles.thumbnail}
              />
            </View>
            <View></View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
};

