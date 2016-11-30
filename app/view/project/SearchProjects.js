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
import actstyles from "../activities/style";
import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons'
import Icons from 'react-native-vector-icons/FontAwesome';
var {height, width} = Dimensions.get('window');
var BusyIndicator = require('react-native-busy-indicator');
var loaderHandler = require('react-native-busy-indicator/LoaderHandler');

import api from "../../network/ApiHelper";
import ProjectListCell from './ProjectListCell'
var listViewData = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});


export default class SearchProjects extends Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {
      projectList: listViewData.cloneWithRows({}),
      hasTaskData:true,
      keywords:"",
      renderPlaceholderOnly: true
    };
  };
  componentDidMount() {

  }
  projectItem(item, sectionID, rowID) {
    return (<ProjectListCell ref="cell" rowID={rowID} key={rowID} item={item} nav={this.props.nav}/>)
  }
  search(){
    this.refs.searchText.blur();
    this.state.keywords = this.state.keywords.trim();
    if (this.state.keywords == "" || this.state.keywords.length == 0) {
      ToastAndroid.show("请输入搜索关键字",ToastAndroid.SHORT);
    }
    else {
      loaderHandler.showLoader("请稍等。。。");
      api.Project.searchProject(this.state.keywords)
        .then((res)=>{
          loaderHandler.hideLoader();
          if(res.Type==1){
            if(res.Data.length!=0){
              this.setState({hasTaskData:true,projectList:listViewData.cloneWithRows(res.Data)});
            }else{
              this.setState({hasTaskData:false})
            }
          }else{
            ToastAndroid.show("获取数据失败",ToastAndroid.SHORT);
            this.setState({hasTaskData:false})
          }
        })
    }

  }
  render() {
    return (
      <View style={styles.whiteContainer}>
        <NavigationBar
          style={styles.NavBarSty}
          leftButton={
            <View style={styles.navLeftBtn}>
              <TouchableOpacity style={[styles.touIcon, {paddingLeft: 10,paddingRight: 10}]} onPress={() => {
                this.props.nav.pop()
              }}>
                <Icon
                  name="md-arrow-round-back"
                  size={28}
                  color="white"
                />
              </TouchableOpacity>
              <View style={[actstyles.searchView, {
                width: Dimensions.get('window').width * 0.77,
                alignItems: 'center',
                marginLeft: 0,
                justifyContent: 'center'
              }]}>
                <Icons
                  name="search"
                  size={20}
                  color="#5D5B5B"
                  style={{marginLeft: 10, marginRight: 5}}
                />
                <TextInput
                  ref="searchText"
                  underlineColorAndroid='transparent'
                  placeholder=" 关键字"
                  autoFocus={true}
                  textAlignVertical='center'
                  returnKeyType="search"
                  onSubmitEditing={this.search.bind(this)}
                  onChangeText={(text) => this.setState({keywords: text})}
                  style={{flex: 1, padding:0,width: Dimensions.get('window').width * 0.55}}
                />
              </View>
            </View>
          }
          rightButton={
            <TouchableOpacity onPress={this.search.bind(this)} style={{marginRight: 10, justifyContent: 'center'}}>
              <Text numberOfLines={1} style={{color: 'white', fontSize: 16}}>搜索</Text>
            </TouchableOpacity>
          }/>
        <View style={styles.container}>
          <View style={{flex:1,marginTop:10}}>

            {!this.state.hasTaskData ?
              <View style={styles.noDataView}>
                <Icons
                  name="exclamation-circle"
                  size={50}
                  color="#717171"
                />
                <Text style={styles.noruleViewText}>暂无相关数据</Text>
              </View> : <ListView
              dataSource={this.state.projectList}
              ref="list"
              keyboardShouldPersistTaps={true}
              removeClippedSubviews={false}
              enableEmptySections={true}
              renderRow={this.projectItem.bind(this)}
            />
            }
          </View>
        </View>

        <BusyIndicator color='#EFF3F5' loadType={1} loadSize={10} textFontSize={15} overlayColor='#4A4A4A' textColor='white' />
      </View>
    );
  }
};

