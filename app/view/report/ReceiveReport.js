import React, { Component } from 'react';
import {
 Image,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ToastAndroid,
  ScrollView,
  ListView,
  ProgressBarAndroid,
  Dimensions
  } from 'react-native';

import styles from "./style";
import api from "../../network/ApiHelper";
import Icon from 'react-native-vector-icons/FontAwesome';
import ScrollableTabView from 'react-native-scrollable-tab-view';
var {height, widths} = Dimensions.get('window');
import NavigationBar from 'react-native-navbar';
import NavLeftView from '../common/NavLeftView'
import Icons from 'react-native-vector-icons/Ionicons';
import _ from 'lodash';
import ReceiveReportList from './ReceiveReportList.js'

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

export default class ReceiveReport extends React.Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {

    };
  };


  getUncommittedReport() {
    this.props.nav.push({
      id: 'UncommittedReport',
    });
  };

  render() {
    var noruleView = (
      <View style={styles.noruleViewV}>
        <Icon
          name="exclamation-circle"
          size={80}
          color="#A94442"
          />
        <Text style={styles.noruleViewText}>暂无相关汇报</Text>
      </View>
    );
    return (
      <View style={{flex: 1,backgroundColor:'#E4E4E4',}}>
        <NavigationBar
          style={styles.NavSty}
          leftButton={
                <NavLeftView nav={this.props.nav} leftTitle="收到的汇报"/>
                   }
          rightButton={
                   <TouchableOpacity style={{marginRight:10,justifyContent: 'center'}} onPress={this.getUncommittedReport.bind(this)}>
                    <Text numberOfLines={1} style={styles.rightNavText}>提交情况</Text>
                      </TouchableOpacity>
                    } />


        <ScrollableTabView
          tabBarBackgroundColor='white'
          tabBarUnderlineColor='#3A83E1'
          tabBarActiveTextColor='#3A83E1'
          initialPage={this.props.type==null?0:this.props.type+1}>
          <View
            tabLabel="全部"
            style={{flex: 1,backgroundColor:'#ECEFF1'}}
            >
           <ReceiveReportList nav={this.props.nav} type={api.Report.REPORT_TYPE.ALL}/>
          </View>

          <View
            tabLabel="日报"
            style={{flex: 1}}
            >
            <ReceiveReportList nav={this.props.nav} type={api.Report.REPORT_TYPE.DAILY}/>
          </View>

          <View
            tabLabel="周报"
            style={{flex: 1}}
            >
            <ReceiveReportList nav={this.props.nav} type={api.Report.REPORT_TYPE.WEEKLY}/>
          </View>

          <View
            tabLabel="月报"
            style={{flex: 1}}
            >
            <ReceiveReportList nav={this.props.nav} type={api.Report.REPORT_TYPE.MONTHLY}/>
          </View>
        </ScrollableTabView>
      </View>
    );
  }
};

