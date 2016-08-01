/**
 * Created by wangshuo on 2016/2/16.
 */
'use strict';

import React, {
  Image,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ToastAndroid,
  ScrollView,
  ListView,
  ProgressBarAndroid
  } from 'react-native';
import styles from "./style";
import NavToolbar from '../navigation/navToolBar/NavToolBar.android';
import NavTab from '../navigation/navTab/NavTab.android';
var Dimensions = require('Dimensions');
import api from "../../network/ApiHelper";
import Icon from 'react-native-vector-icons/FontAwesome';
import ScrollableTabView from 'react-native-scrollable-tab-view';
var {height, widths} = Dimensions.get('window');
import NavigationBar from 'react-native-navigation-bar';
import ReportRules from './ReportRules';
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
    var toolbarActions = [
      {title: '提交情况', show: 'always'},
    ];
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
        <NavToolbar
          navIconName={"android-arrow-back"}
          title={'收到的汇报'}
          actions={toolbarActions}
          onActionSelected={this.getUncommittedReport.bind(this)}
          onClicked={() => {this.props.nav.pop()}}/>


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

