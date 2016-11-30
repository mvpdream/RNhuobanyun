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

export default class ProjectListCell extends Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {

    };
  };

  componentDidMount() {

  }
  projectDetail(projectId,name){
    this.props.nav.push({
      id: 'ProjectTabView',
      projectId:projectId,
      projectName:name,
      reloadData:this.props.reloadList
    })
  }
  render() {
    var item=this.props.item&&this.props.item;
    return (
      <TouchableOpacity onPress={this.projectDetail.bind(this,item.Id,item.Name)} activeOpacity={0.5}>
        <View style={styles.taskListRow}>
          <View>
          <View style={styles.listTopView}>
            <View style={{flex:1}}>
              <Text numberOfLines={1} style={[styles.projectName,{color:item&&item.Overdue?"#ff0000":"#000000"}]}>{item&&item.Name}</Text></View>
            <View style={styles.imgView}>
              <Image
                source={{uri: item&&item.Avatar}}
                style={styles.thumbnail}
              />
            </View>
          </View>

          <View style={[styles.listTopView,{marginTop:6}]}>
            <View style={{flex:1}}>
              <Text style={styles.title}>{item&&item.StartFinishTime}</Text></View>
            <View style={styles.imgView}>
              <Text style={styles.title}>{item&&item.Progress}</Text>
            </View>
          </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
};

