'use strict';
import React,{Component} from 'react'
import {
  Image,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ToastAndroid,
  ListView,
  RefreshControl,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  InteractionManager,
  ProgressBarAndroid,
  Dimensions
} from 'react-native';
import api from "../../network/ApiHelper";
import styles from "../common/style";
import Icons from 'react-native-vector-icons/Ionicons';
import CommentInput from '../common/CommentInput.js'
import NavigationBar from 'react-native-navbar';
import NavLeftView from '../common/NavLeftView'
var zanflag = false;
var activityData = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});
var firstLoad = false;
var oneData = [];
var BusyIndicator = require('react-native-busy-indicator');
var loaderHandler = require('react-native-busy-indicator/LoaderHandler');

export default class TaskLogLists extends React.Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {
      AllData: [],
      hasActData: true,
      page: 1,
      hasMore: false,
      ishavedata: true,
      isnodata: false,
      commentConfig: [],
      isRefreshControl: false,
      allList: activityData.cloneWithRows({})
    }
  }

  componentDidMount() {
    this.state.AllData = [];
    this.state.page = 1;
    firstLoad = true;
    InteractionManager.runAfterInteractions(() => {
      loaderHandler.showLoader("请稍等。。。");
      this.getComments();
    });
  }

  getComments() {
    api.Task.getTaskLogs(this.props.taskId, this.state.page)
      .then((resData)=> {
        loaderHandler.hideLoader();
        if(resData.Type==1){
          if (resData.Data && resData.Data.length == 0 && firstLoad) {
            //第一次加载，且没有数据的时候
            this.setState({hasActData: false});
          }
          if (this.state.AllData.length == 0 && firstLoad) {
            this.state.AllData = resData.Data;
          }
          if (this.state.AllData.length > 0 && this.state.AllData.length < 5) {
            this.setState({hasMore: false});
          }
          if (!firstLoad) {
            var oldDataLen = this.state.AllData.length;
            this.state.AllData = this.state.AllData.concat(resData.Data==null?[]:resData.Data);
            if (this.state.AllData.length == oldDataLen) {
              ToastAndroid.show("没有数据咯",ToastAndroid.SHORT);
              this.setState({
                ishavedata: false,
                isRefreshControl: false,
                hasMore: false,
                allList: activityData.cloneWithRows(this.state.AllData)
              });
              return;
            }
          }
          this.setState({
            isRefreshControl: false,
            ishavedata: false,
            allList: activityData.cloneWithRows(this.state.AllData)
          });
        }else{
          this.setState({
            isRefreshControl: false,
            ishavedata: false
          });
        }

      })

  };
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

  onEndReached() {
    if (this.state.hasMore) {
      this.state.page++;
      firstLoad = false;
      this.setState({ishavedata: true});
      this.getComments();
    }
  };

  onRefresh() {
    firstLoad = false;
    oneData = [];
    this.setState({
      AllData: [],
      hasMore: true,
      isRefreshControl: true
    });
    this.state.page = 1;
    firstLoad = true;
    this.getComments();
  }

  activityItem(item, sectionID, rowID) {
    return ( <View key={rowID} style={styles.commentListView}>
      <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 10,
          marginTop: 5
        }}>
          <Image
            source={{uri: item.Avatar}}
            style={styles.itemUserimgs}
          />
          <Text style={[styles.nomText, {marginLeft: 5}]}>{item.Name}</Text>
        </View>
        <View>
          <Text style={styles.dateText}>{item.DateCreated}</Text>
        </View>
      </View>
      <View style={styles.comParBody1}>
          <View style={styles.comBody1}>
            <Text style={[styles.nomText, {paddingRight: 10}]}>{item.Content}</Text>
          </View>
      </View>
    </View>)
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <NavigationBar
          style={styles.NavBarSty}
          leftButton={
            <NavLeftView nav={this.props.nav} leftTitle="日志列表"/>
          }
        />
        <View style={{flex: 1, backgroundColor: '#EFF0F4'}}>
          {this.state.hasActData ? <ListView
            dataSource={this.state.allList}
            enableEmptySections={true}
            style={{backgroundColor: 'white'}}
            renderRow={this.activityItem.bind(this)}
            onEndReached={this.onEndReached.bind(this)}
            onEndReachedThreshold={5}
            onScroll={this.onScroll.bind(this)}
            renderFooter={this.renderFooter.bind(this)}
            refreshControl={
              <RefreshControl
                style={{backgroundColor: 'transparent'}}
                refreshing={this.state.isRefreshControl}
                onRefresh={this.onRefresh.bind(this)}
                title="Loading..."
              />
            }
          /> :
            <View style={styles.noruleViewV}>
              <Icons
                name="exclamation-circle"
                size={50}
                color="#717171"
              />
              <Text style={styles.noruleViewText}>暂无相关数据</Text>
            </View>
          }
          <BusyIndicator color='#EFF3F5' loadType={1} loadSize={10} textFontSize={15} overlayColor='#4A4A4A' textColor='white' />
        </View>
      </View>
    )
  }
};

