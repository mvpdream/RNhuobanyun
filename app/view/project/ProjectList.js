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
  Dimensions
} from 'react-native';
import styles from "./style";
import Icons from 'react-native-vector-icons/FontAwesome'
import api from "../../network/ApiHelper";
var oneData = [];
var firstLoad=false;//是否是第一次加载
var BusyIndicator = require('react-native-busy-indicator');
var loaderHandler = require('react-native-busy-indicator/LoaderHandler');

import ProjectListCell from './ProjectListCell'
var listViewData = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});


export default class ProjectList extends Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {
      page: 1,
      AllData: [],
      oneData: [],
      hasMore: false,//是否可以加载更多
      projectList: listViewData.cloneWithRows({}),
      ishavedata: false,
      isRefreshControl: false,
      hasProjectData: true
    };
  };

  componentDidMount() {
    this.state.AllData = [];
    this.state.page = 1;
    firstLoad = true;
    loaderHandler.showLoader("请稍等。。。");
    this.getLists(this.props.projectType);
  }
  getLists(type){
    api.Project.myProject(type,this.state.page)
      .then((resData)=>{
        loaderHandler.hideLoader();
        if(resData.Type==1){
          if (resData.Data && resData.Data.length == 0 && firstLoad) {
            //第一次加载，且没有数据的时候
            this.setState({hasProjectData: false});
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
            this.setState({hasProjectData: true})
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
                projectList: listViewData.cloneWithRows(this.state.AllData)
              });
              return;
            }
          }
          this.setState({
            ishavedata: false,
            isRefreshControl: false,
            projectList: listViewData.cloneWithRows(this.state.AllData)
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
  reloadProjectList(type){
    api.Project.myProject(type, 1)
      .then((resData)=> {
        if (resData.Type == 1) {
          if (resData.Data && resData.Data.length != 0) {
            this.setState({hasProjectData: true})
          }
          var temp = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
          this.setState({
            ishavedata: false,
            isRefreshControl: false,
            projectList: temp.cloneWithRows(resData.Data)
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

  renderFooter() {
    return (
      this.state.ishavedata ? <View ref='footerView' style={styles.footerView}>
        <View style={{width: 30, height: 30, justifyContent: 'center'}}>
        <ActivityIndicator animating={true} color='blue'/>
          </View>
        <Text style={styles.footerText}>
          数据加载中……
        </Text>
      </View> : null);
  }

  onScroll() {
    this.state.hasMore = true;
  }

  onEndReached(actType) {
    if (this.state.hasMore) {
      this.state.page++;
      firstLoad = false;
      this.setState({ishavedata: true});
      switch (actType) {
        case 99999://已归档的
          this.getLists(99999);
          break;
        default://我参与的
          this.getLists();
          break;
      }
    }
  };

  onRefresh(actType) {
    firstLoad = false;
    oneData = [];
    this.setState({
      AllData: [],
      hasMore: true,
      isRefreshControl: true
    });
    this.state.page = 1;
    firstLoad = true;
    switch (actType) {
      case 99999://已归档的
        this.getLists(99999);
        break;
      default://我参与的
        this.getLists();
        break;
    }

  }
  renderContent() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.projectList}
          ref="list"
          style={{marginTop:10}}
          keyboardShouldPersistTaps={true}
          removeClippedSubviews={false}
          enableEmptySections={true}
          renderRow={this.projectItem.bind(this)}
          onEndReached={this.onEndReached.bind(this, this.props.projectType)}
          onEndReachedThreshold={5}
          onScroll={this.onScroll.bind(this)}
          renderFooter={this.renderFooter.bind(this)}
          refreshControl={
             <RefreshControl
                refreshing={this.state.isRefreshControl}
                 onRefresh={this.onRefresh.bind(this, this.props.projectType)}
                title="Loading..."
                colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
              />
          }
        />
        {!this.state.hasProjectData?
          <View style={styles.noDataView}>
            <Icons
              name="exclamation-circle"
              size={50}
              color="#717171"
            />
            <Text style={styles.noruleViewText}>暂无项目</Text>
          </View> : null
        }
      </View>
    )
  }

  projectItem(item, sectionID, rowID) {
    return (<ProjectListCell ref="cell" rowID={rowID} key={rowID} item={item} nav={this.props.nav} reloadList={this.props.reloadLists}/>)
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

